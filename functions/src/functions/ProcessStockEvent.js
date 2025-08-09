// functions/src/functions/ProcessStockEvent.js
const { app } = require("@azure/functions");
const axios = require("axios");

app.storageQueue("ProcessStockEvent", {
  connection: "AzureWebJobsStorage",
  queueName: "stock-events",
  handler: async (myQueueItem, context) => {
    try {
      let payload = myQueueItem;

      // Decode base64/string -> JSON
      if (typeof payload === "string") {
        try {
          payload = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
        } catch {
          payload = JSON.parse(payload);
        }
      }

      const { correlationId, productId, threshold, currentQty } = payload || {};
      context.log({ service: "function", msg: "received", payload });

      const baseUrl = process.env.SUPPLIER_API_BASE_URL; // set via settings below
      const requestedQty = Math.max((threshold ?? 0) - (currentQty ?? 0), 1);

      const res = await axios.post(`${baseUrl}/order`, {
        correlationId,
        productId,
        requestedQty
      }, { timeout: 5000 });

      context.log({ service: "function", msg: "supplier response", data: res.data });
    } catch (err) {
      context.log.error({ service: "function", error: err.message });
      throw err; // let Azure retry
    }
  }
});