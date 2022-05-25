import { v4 as uuidV4 } from "uuid";

import createConnection from "../index";

async function create() {
  const connection = await createConnection("localhost");
  const id = uuidV4();

  await connection.query(
    `INSERT INTO CURRENCIES(id, name, created_at)
      values('${id}', 'USD','now()')
    `
  );

  await connection.close();
}

create().then(() => console.log("Currency USD created"));
