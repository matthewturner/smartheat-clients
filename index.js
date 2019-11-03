const SmartHeat = {
    clients: {
        Factory: require('./clients/Factory'),
        Salus: require('./clients/Salus'),
        Mock: require('./clients/Mock')
    }
};

module.exports = SmartHeat;