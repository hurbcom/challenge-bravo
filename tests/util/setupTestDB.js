const models = require('../../src/app/models');
const truncate = require('./truncate');

const setupTestDB = () => {
  beforeEach(async () => {
    await truncate();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });
};

module.exports = setupTestDB;
