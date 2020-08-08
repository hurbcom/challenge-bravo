import request from 'supertest';
import { isUuid } from 'uuidv4';
import app from '../app';

describe('Create currency', () => {
  it('should be able to add new currency coins', async () => {
    const response = await request(app).post('/currencies').send({
      code: 'TZS',
      name: 'Tanzania shilling',
    });

    expect(isUuid(response.body.id)).toBe(true);

    expect(response.body).toMatchObject({
      message: 'New currency created successfully!',
      id: expect.any(String),
      code: 'TZS',
      name: 'Tanzania shilling',
    });
  });
  it('should not be able to add new currency coin that already exists in the database', async () => {
    await request(app).post('/currencies').send({
      code: 'TZS',
      name: 'Tanzania shilling',
    });

    const response = await request(app).post('/currencies').send({
      code: 'TZS',
      name: 'Tanzania shilling',
    });

    expect(response.body).toMatchObject({
      message: 'Invalid entries. Make sure the code you entering is 3 letter long and does not exist in the list of available currencies',
    });
  });

  it('should not be able to add a currency with more than 3 digits', async () => {
    const response = await request(app).post('/currencies').send({
      code: 'TZSS',
      name: 'Tanzania shilling',
    });

    expect(response.body).toMatchObject({
      message: 'Invalid entries. Make sure the code you entering is 3 letter long and does not exist in the list of available currencies',
    });
  });
});

describe('List currencies coins', () => {
  it('should be able to list the transactions', async () => {
    await request(app).post('/currencies').send({
      code: 'AFN',
      name: 'Afghan afghani',
    });

    await request(app).post('/currencies').send({
      code: 'CAD',
      name: 'Canadian dollar',
    });

    const response = await request(app).get('/currencies');

    expect(response.body.currencies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          code: 'AFN',
          name: 'Afghan afghani',
        }),
        expect.objectContaining({
          id: expect.any(String),
          code: 'CAD',
          name: 'Canadian dollar',
        }),
      ]),
    );
  });
});

describe('Delete currency coin', () => {
  it('should be able to delete a currency coin', async () => {
    const response = await request(app).delete('/currencies/:id').send({
      id: expect.any(String),
    });

    expect(response.body).toMatchObject({
      message: 'Currency coin deleletd successfully',
    });
  });
});

describe('Exchage currencies coins', () => {
  it('should be able to convert available coins', async () => {
    const response = await request(app).post('/currencies').send({
      from: 'BRL',
      to: 'USD',
      amount: 1200,
    });

    expect(response.body).toMatchObject({
      from: 'BRL',
      to: 'USD',
      amount: 226.71,
    });
  });
});
