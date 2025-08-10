const { app } = require("@azure/functions");
const axios = require("axios");

app.http("ManualReorderHttp", {
  methods: ["POST"],
  authLevel: "function",
  handler: async (req, ctx) => {
    const body = await req.json(); 
    const correlationId = body.correlationId || `manual-${Date.now()}`;
    ctx.log({ service: "function", fn: "ManualReorderHttp", body });

    const supplierBase = process.env.http://4.206.157.44:4000;
    const res = await axios.post(`${supplierBase}/order`, {
      correlationId,
      productId: body.productId,
      requestedQty: body.requestedQty || 1
    }, { timeout: 5000 });

    return { status: 200, jsonBody: { ok: true, correlationId, supplier: res.data } };
  }
});
