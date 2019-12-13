const crypto = require('crypto');

const main = async () => {
    let password = process.env.PASSWORD;

    try {
        if (process.env.HASH_PASSWORD === 'true' && process.env.PASSWORD) {
            password = crypto.createHash('md5')
                .update(process.env.PASSWORD)
                .digest('hex');
            console.log('Password hash:');
            console.log('');
            console.log(`   ${password}`);
            console.log('');
        }

        const Client = require(process.env.THERMOSTAT_TYPE);

        const client = new Client(console, {
            username: process.env.USERNAME,
            password: password,
            host: process.env.HOST,
            port: process.env.PORT,
            model: process.env.MODEL,
            pin: process.env.PIN
        });

        await client.login();
        console.log(`Online: ${await client.online()}`);
        console.log(`Device: ${JSON.stringify(await client.device())}`);
        await client.setTemperature(parseFloat(process.env.TARGET_TEMPERATURE));
        await client.logout();
    } catch (e) {
        console.error(e);
        console.error(e.stack);
    }
};

main();