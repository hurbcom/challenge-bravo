import request from "supertest";
import { DataSource } from "typeorm";
import { v4, v5 } from "uuid";
import { AppDataSource } from "../../data-source";
import app from "../../app";
import { Currency } from "../../entities/currency.entity";



describe("Testing the error routes", () => {
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

  test("Should be able to send an error when try create currency that symbol have more than 9 characters", async () => {
    const symbol = "AAABBBBBBBBBBB";
    const name = "Alvo Atalio Andrade Ber";
    const amount = 2;
    const price = 4;

    const userData = { symbol, name, amount, price };

    const response = await request(app).post("/currency").send(userData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("symbol must be at most 9 characters");
  });

  test("Should be able to send an error when try create currency that symbol dont have only characters A to Z", async () => {
    const symbol = "AAA 2";
    const name = "Alvo Atalio Andrade Ber";
    const amount = 2;
    const price = 4;

    const userData = { symbol, name, amount, price };

    const response = await request(app).post("/currency").send(userData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Must contain only characters A to Z");
  });

  test("Should be able to send an error when try create currency missing some field", async () => {
    const name = "Alvo Atalio Andrade Ber";
    const amount = 2;
    const price = 4;

    const userData = { name, amount, price };

    const response = await request(app).post("/currency").send(userData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("symbol is a required field");
  });
});