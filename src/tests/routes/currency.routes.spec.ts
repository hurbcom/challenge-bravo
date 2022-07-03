import request from "supertest";
import { DataSource } from "typeorm";
import { v4, v5 } from "uuid";
import { AppDataSource } from "../../data-source";
import app from "../../app";
import { Currency } from "../../entities/currency.entity";



describe("Testing the user routes", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("Should be able to create a new account", async () => {
    const symbol = "AAAB";
    const name = "Alvo Atalio Andrade Ber";
    const amount = 2;
    const price = 4;

    const userData = { symbol, name, amount, price };

    const response = await request(app).post("/currency").send(userData);

    expect(response.status).toBe(201);
  });

  test("Should be able list all currency", async () => {
    const response = await request(app).get("/currency");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("map");
  })

  test("Mocking a request body", async () => {
    const mockBody = {
      symbol: "FAFAF",
      name: "Farofa amaa Farofa ama Farofa",
      amount: 10,
      price: 1
    }

    const { status, body } = await request(app).post("/currency").send(mockBody)

    expect(status).toBe(201)
    expect(body).toHaveProperty("symbol", mockBody.symbol)
    expect(body).toHaveProperty("name", mockBody.name)
  })

  test("Should update the currency", async () => {
    const symbol = "NEWSYMBOL";
    const name = "Alvo Atalio Andrade Ber";
    const amount = 2;
    const price = 4;

    const userData = { symbol, name, amount, price };

    const response = await request(app).post("/currency").send(userData);

    const newData = {
      "name": "Zelta z z",
      "amount": 0.5,
      "price": 10
    }

    const responseUpdate =  await request(app).patch(`/currency/${response.body.id}`).send(newData);

    expect(responseUpdate.status).toBe(200)
    expect(responseUpdate.body.name).toBe("Zelta z z")
    expect(responseUpdate.body.price).toBe((newData.price/newData.amount));
  });

  test("Should delete the currency", async () => {
    const symbol = "SYBBB";
    const name = "Currency to be deleted";
    const amount = 312.32;
    const price = 0.4324234;

    const userData = { symbol, name, amount, price };

    const response = await request(app).post("/currency").send(userData);

    const responseDeleted =  await request(app).delete(`/currency/${response.body.id}`);

    expect(responseDeleted.status).toBe(204);
  });
});