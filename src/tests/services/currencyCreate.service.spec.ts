import { DataSource } from "typeorm";                 
import { AppDataSource } from "../../data-source";
import currecyCreateService from "../../services/currency/currecyCreate.service";

describe("Create an user", () => {
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

  test("Should insert the information of the new user in the database", async () => {
    const symbol = "AAAB";
    const name = "Alvo Atalio Andrade Ber";
    const amount = 2;
    const price = 4;

    const userData = { symbol, name, amount, price };

    const newUser = await currecyCreateService(userData);

    expect(newUser).toEqual(
      expect.objectContaining({
        name,
        price: price/amount,
      })
    );
  });
});