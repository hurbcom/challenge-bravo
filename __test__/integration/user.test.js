const request = require('supertest');
const application = require('../../src/bootstrap/app');

describe('User tests', () => {

  let user = {
    name : "",
    email : "",
    password: ""
  };

  beforeAll(async () => {
    let emailPrefix = Math.random().toString(36).substring(3);
    user.name = "João Robson";
    user.email = emailPrefix+ "@email.com";
    user.password = "10203040";

    await request(application.app)
                    .post("/api/v1/users/register")
                    .send(user);
  });


  it('User Registration - Valid data', async () => {
    let emailPrefix = Math.random().toString(36).substring(3);
    const response = await request(application.app)
                    .post("/api/v1/users/register")
                    .send({
                        "email" : emailPrefix+"@email.com",
                        "name" : "Bryan Watson",
                        "password" : "102030"
                    });

    expect(response.status).toBe(201);
  });

  it('User Registration - Invalid data', async () => {
    const response = await request(application.app)
                    .post("/api/v1/users/register")
                    .send({
                        "email" : null,
                        "name" : null,
                        "password" : "102030"
                    });

    expect(response.status).toBe(400);
  });

  it('User Registration - Already exists', async () => {
    const response = await request(application.app)
                    .post("/api/v1/users/register")
                    .send({
                        "email" : user.email,
                        "name" : user.name,
                        "password" : "102030"
                    });

    expect(response.status).toBe(400);
  });

  it('User Authentication - Valid data', async () => {
    const response = await request(application.app)
                    .post("/api/v1/users/login")
                    .send({
                        "email" : user.email,
                        "password" : user.password
                    });
    
    expect(response.status).toBe(200);            
  });

  it('User Authentication - Invalid email', async () => {
    let password = Math.random().toString(36).substring(3);
    const response = await request(application.app)
                    .post("/api/v1/users/login")
                    .send({
                        "email" : "doesnotexist@email.com",
                        "password" : password
                    });
    
    expect(response.status).toBe(400);  
  });

  it('User Authentication - Invalid password', async () => {
    let password = Math.random().toString(36).substring(3);
    const response = await request(application.app)
                    .post("/api/v1/users/login")
                    .send({
                        "email" : user.email,
                        "password" : password
                    });
    
    expect(response.status).toBe(401);  
  });
});