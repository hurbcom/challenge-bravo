/* eslint-disable no-underscore-dangle */
async function globalTeardown() {
    const instance = global.__MONGOINSTANCE;
    await instance.stop();
    process.exit(0);
}

module.exports = globalTeardown;
