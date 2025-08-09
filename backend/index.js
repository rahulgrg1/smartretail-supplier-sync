import express from 'express';
import bodyParser from 'body-parser';
import { QueueClient } from '@azure/storage-queue';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const QUEUE_NAME = process.env.QUEUE_NAME || 'stock-events';
const queueClient = new QueueClient(AZURE_STORAGE_CONNECTION_STRING, QUEUE_NAME);

app.get('/health', (_req, res) => res.send('OK'));

app.post('/simulate-low-stock', async (req, res) => {
  const { productId = 'SKU-123', currentQty = 2, threshold = 5 } = req.body || {};
  const correlationId = uuidv4();
  const payload = { eventType: 'LOW_STOCK', productId, currentQty, threshold, correlationId, at: new Date().toISOString() };
  console.log(JSON.stringify({ service: 'backend', msg: 'emitting event', payload }));
  await queueClient.sendMessage(Buffer.from(JSON.stringify(payload)).toString('base64'));
  res.json({ ok: true, payload });
});

app.listen(PORT, () => console.log(JSON.stringify({ service: 'backend', msg: `listening on ${PORT}` })));

