const crypto = require('crypto');

const Factory = require('../clients/Factory');

const main = async () => {
    const passwordHash = crypto.createHash('md5')
        .update(process.env.PASSWORD)
        .digest('hex');

    const factory = new Factory(console);

    const client = factory.create(process.env.THERMOSTAT_TYPE, {
        username: process.env.USERNAME,
        password: passwordHash,
        host: process.env.HOST,
        pin: process.env.PIN
    });

    await client.login();
    console.log(`Online: ${await client.online()}`);
    console.log(`Device: ${JSON.stringify(await client.device())}`);
    await client.setTemperature(parseFloat(process.env.TARGET_TEMPERATURE));
    await client.logout();
};

main();