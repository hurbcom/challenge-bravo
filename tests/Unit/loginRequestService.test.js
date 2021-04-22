const loginS = require('../../src/services/loginRequestService');

test('validate login fields', () => {
  let data = {
    'username': 'admin',
    'password': 'secret',
  };

  expect(loginS.validateLoginFields(data)).toHaveLength(0);
  data = {};
  expect(loginS.validateLoginFields(data)).toHaveLength(2);
});

test('get hashed password', () => {
  let password = 'secret';
  const hashedPassword = '210d3d27605d0ee737952294265400a7cba109746afacd84b9cb0139bf6b7e3a';

  expect(loginS.getHashedPassword(password)).toEqual(hashedPassword);
});

test('generate JWT', () => {
    const data = {
        id: 1,
        username: 'admin'
    };

    expect(loginS.generateJwt(data)).toMatch(/^ey/);
});