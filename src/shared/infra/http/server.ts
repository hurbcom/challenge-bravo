import express from "express";

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json());

app.listen(PORT, () => console.log(`server is running in port ${PORT}`));
