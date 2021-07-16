import express from "express";

const app = express();

app.get("/", (request, response)=> {
  return response.json({mensage: "Helo World"})
})

app.listen(3333);