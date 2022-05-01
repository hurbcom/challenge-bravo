const mongoose = require('../database/index');

afterAll(async () => {
    await mongoose.disconnect();
});
