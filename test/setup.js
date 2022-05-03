const mongoose = require('../src/database/index');

afterAll(async () => {
    await mongoose.disconnect();
});
