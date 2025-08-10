import express from "express";
const app = express();

app.get("/products", (_req, res) => {

  res.json([{ id: "SKU-100", name: "Widget", stock: 3, threshold: 5 }]);
});

app.get("/health", (_req, res) => res.send("OK"));

app.listen(5000, () =>
  console.log(JSON.stringify({ service: "product-service", msg: "listening on 5000" }))
);
