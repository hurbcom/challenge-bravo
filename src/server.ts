import app from "./app";
import { AppDataSource } from "./data-source";


const PORT = process.env.PORT || 3000;

( async () => {
  const PORT = process.env.PORT || 3000;

  await AppDataSource.initialize();
  
  app.listen(PORT, () => console.log("Running at http://localhost:" + PORT));
})();