const { app } = require("@azure/functions");
const axios = require("axios");

app.timer("DailySummaryTimer", {
  schedule: "0 0 9 * * *", 
  handler: async (_timer, ctx) => {
    ctx.log({ service: "function", fn: "DailySummaryTimer", at: new Date().toISOString() });

    const url = process.env.PRODUCT_SERVICE_URL || "http://4.206.157.44:5000/products";
    const { data } = await axios.get(url, { timeout: 5000 });


    const low = (data || []).filter(p => (p.stock ?? 0) < (p.threshold ?? 0));
    ctx.log({ service: "function", fn: "DailySummaryTimer", lowStockCount: low.length, low });


  }
});
