import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 4000;

app.post('/order', (req, res) => {
  // Expect a correlationId, productId, quantity, etc.
  const { correlationId, productId, requestedQty } = req.body || {};
  const event = {
    service: 'supplier-api',
    at: new Date().toISOString(),
    correlationId,
    received: { productId, requestedQty }
  };
  console.log(JSON.stringify(event));
  return res.json({
    ok: true,
    message: 'Order received by supplier-api',
    correlationId,
  });
});

app.get('/health', (_req, res) => res.send('OK'));

app.listen(PORT, () => {
  console.log(JSON.stringify({ service: 'supplier-api', msg: `listening on ${PORT}` }));
});