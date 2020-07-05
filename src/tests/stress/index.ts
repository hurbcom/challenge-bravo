import exchange from "./exchange-stress-test";
import exchangeStressTest from "./exchange-stress-test";
import currencyStressTest from "./currency-stress-test";

const start = async () => {
  console.log(`Starting stress tests...`);
  await exchangeStressTest();
  await currencyStressTest();
};

start();