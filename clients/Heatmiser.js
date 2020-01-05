const heatmiser = require('heatmiser');

class Heatmiser {
    constructor(logger, options) {
        this._logger = logger;
        this._options = options;
    }

    async login() {
        this._logger.debug('Logging in...');
    }

    async logout() {
        this._logger.debug('Logging out...');
    }

    async online() {
        this._logger.debug('Checking device status...');

        let device = await this.device();

        this._logger.debug(device.contactable);
        return device.contactable === true;
    }

    async device() {
        this._logger.debug('Contacting device...');
        let data = await this.readDevice();
        let info = {
            contactable: data.dcb.device_on,
            currentTemperature: data.dcb.built_in_air_temp,
            targetTemperature: data.dcb.set_room_temp,
            status: data.dcb.heating_on ? 'on' : 'off'
        };
        this._logger.debug(JSON.stringify(info));
        return info;
    }

    async setTemperature(temp) {
        this._logger.debug(`Setting temp: ${temp}...`);
        let dcb = {
            heating: {
                target: temp
            }
        };
        await this.writeDevice(dcb);
    }

    async turnWaterOnFor(hours) {
        this._logger.debug(`Boosting water for: ${hours} hours...`);
        throw new Error('Turning water on is not supported');
    }

    card() {
        return {
            title: 'Heatmiser',
            image: {
                smallImageUrl: 'https://748348.smushcdn.com/1298070/wp-content/uploads/2019/08/touch-carbon.png?lossy=1&strip=1&webp=1',
                largeImageUrl: 'https://748348.smushcdn.com/1298070/wp-content/uploads/2019/08/touch-carbon.png?lossy=1&strip=1&webp=1',
            }
        };
    }

    get friendlyName() {
        return 'thermostat';
    }

    get manufacturerName() {
        return 'Heatmiser';
    }

    get description() {
        return 'Controls the Heatmiser thermostat';
    }

    get shouldDefer() {
        return true;
    }

    async readDevice() {
        return new Promise((resolve, reject) => {
            const hm = new heatmiser.Wifi(this._options.host, this._options.pin, this._options.port, this._options.model);
            hm.on('success', (data) => {
                this._logger.debug('Success:');
                this._logger.debug(data);
                resolve(data);
            });
            hm.on('error', (data) => {
                this._logger.error('Error:');
                this._logger.error(data);
                reject(data);
            });
            hm.read_device();
        });
    }

    async writeDevice(dcb) {
        return new Promise((resolve) => {
            const hm = new heatmiser.Wifi(this._options.host, this._options.pin, this._options.port, this._options.model);
            hm.on('success', (data) => {
                this._logger.debug('Success:');
                this._logger.debug(data);
                resolve(data);
            });
            hm.on('error', (data) => {
                this._logger.error('Error:');
                this._logger.error(data);
                reject(data);
            });
            hm.write_device(dcb);
        });
    }
}

module.exports = Heatmiser;
