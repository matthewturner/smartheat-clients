const parser = require('fast-xml-parser');
const request = require('request-promise');

const host = 'https://salus-api.arrayent.com:8081';

class SalusApi {
    constructor(logger, options) {
        this._logger = logger;
        this._options = options;
        this._token = null;
        this._deviceInfo = null;
    }

    get credentials() {
        return {
            appId: 1097,
            name: this._options.username,
            password: this._options.password
        };
    }

    urlTo(page, params = {}) {
        let qs = {};
        if (this._token === null) {
            qs = Object.assign(params, this.credentials);
        } else {
            qs = Object.assign(params, this._token);
        }
        return {
            url: `${host}/zdk/services/zamapi/${page}`,
            qs: qs
        }
    }

    async login() {
        try {
            this._logger.debug('Logging in...');
            this._logger.debug(host);

            const loginBody = await request.get(this.urlTo('userLogin'));
            let loginResponse = parser.parse(loginBody)['ns1:userLoginResponse'];
            this._token = {
                userId: loginResponse.userId,
                secToken: loginResponse.securityToken
            };

            this._logger.debug('Loading devices page...');
            let devicesBody = await request.get(this.urlTo('getDeviceList'));
            let deviceList = parser.parse(devicesBody)['ns1:getDeviceListResponse'].devList;
            this._logger.debug(JSON.stringify(deviceList));
            this._device = {
                devId: deviceList.devId,
                deviceTypeId: deviceList.deviceTypeId
            };

            this._logger.debug(`Logged on (${this._device.devId}, ${this._token.userId}, ${this._token.secToken})`);
        } catch (error) {
            this._logger.debug('Error occurred:');
            this._logger.debug(error);
        }
    }

    async online() {
        this._logger.debug('Checking device status...');
        const online = await this.deviceInfo(386);
        return online === 1;
    }

    async device() {
        return {
            contactable: !(await this.deviceInfo(307) == 3200),
            currentTemperature: await this.deviceInfo(306) / 100,
            targetTemperature: await this.deviceInfo(307) / 100,
            status: (await this.deviceInfo(309) === 1 ? 'on' : 'off')
        };
    }

    async deviceInfo(attrId) {
        if (this._deviceInfo === null) {
            const body = await request.get(this.urlTo('getDeviceAttributesWithValues', this._device));
            // this._logger.debug(body);
            const deviceInfo = parser.parse(body)['ns1:getDeviceAttributesWithValuesResponse'];
            // this._logger.debug(JSON.stringify(deviceInfo));
            this._deviceInfo = deviceInfo;
        }
        const attribute = this._deviceInfo.attrList.find(x => x.id === attrId);
        // this._logger.debug(JSON.stringify(attribute));
        return attribute.value;
    }

    async setTemperature(temp) {
        let t = temp.toFixed(1);
        this._logger.debug(`Setting temp: ${t}...`);
        const payload = {
            name1: "A85",
            value1: (t * 100).toString(),
            name2: "A88",
            value2: "1"
        };
        await this.updateDevice(payload);
    }

    async turnWaterOnFor(hours) {
        this._logger.debug(`Setting water boost time: ${hours} hours...`);

        const payload = {
            name1: "C43",
            value1: hours.toString()
        };
        await this.updateDevice(payload);
    }

    async updateDevice(payload) {
        const params = Object.assign(this._device, payload);
        const responseBody = await request.get(this.urlTo('setMultiDeviceAttributes2', params));
        const response = parser.parse(responseBody)['ns1:setMultiDeviceAttributes2Response'];
        this._logger.debug(JSON.stringify(response));
    }

    async logout() {
        this._logger.debug('Logging out...');
    }

    card() {
        return {
            title: 'Salus',
            image: {
                smallImageUrl: 'https://salus-it500.com/public/assets/it500_icon.png',
                largeImageUrl: 'https://salus-it500.com/public/assets/logo.png',
            }
        };
    }

    get friendlyName() {
        return 'thermostat';
    }

    get manufacturerName() {
        return 'Salus';
    }

    get description() {
        return 'Controls the Salus IT-500';
    }

    get shouldDefer() {
        return true;
    }
}

module.exports = SalusApi;