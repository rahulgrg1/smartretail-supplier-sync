SmartRetail Supplier Sync
This project is my final submission for our cloud-based microservices and Azure Functions lab.
It’s basically a small simulation of how different services in a retail system can talk to each other using Docker containers, queues, and serverless functions — just like in a real production setup (but smaller and easier to manage).

Overview
The idea was to build three separate services (running in containers) and connect them to three Azure Functions, with Azure Storage Queues acting as the bridge between them. Here’s the breakdown:

Backend service (Node.js)
Detects when a product is low on stock and sends a message to the queue.

Supplier API (Node.js)
Pretends to be the supplier system, receives “order” requests from the function.

Product service (Node.js)
Stores product data and lets us check stock levels.

Azure Functions

ProcessStockEvent: Listens to the queue and calls the supplier API.

ManualReorderHttp: Lets you place an order manually through an HTTP request.

DailySummaryTimer: Runs on a schedule to check stock levels.

The main goal is to see the whole flow working:
Backend → Queue → Function → Supplier API.
 Setup Instructions
1. Manual setup (local or VM)
Clone the repo



git clone https://github.com/<your-username>/smartretail-supplier-sync.git
cd smartretail-supplier-sync
Create an .env file in the infra/ folder based on .env.example and fill in your real values:



AZURE_STORAGE_CONNECTION_STRING=<your real connection string>
API_KEY=<your secret key>
Build and run everything with Docker Compose:



docker compose -f infra/docker-compose.yml --env-file infra/.env up -d --build
2. CI/CD setup (optional)
If you’re using GitHub Actions + Azure Container Registry:

Push code to main branch.

Workflow builds the images, pushes to ACR, SSHs into VM, and redeploys.

Service Roles and Communication
Flow for Low Stock event:

Backend detects low stock and posts a message to Azure Storage Queue stock-events.

Azure Function ProcessStockEvent is triggered by the queue.

The function calls supplier-api /order endpoint.

Supplier API responds with a confirmation.
 Queue/Event Message Formats
Low Stock Event (backend → queue):


{
  "eventType": "LOW_STOCK",
  "productId": "SKU-100",
  "currentQty": 1,
  "threshold": 5,
  "correlationId": "e8e31822-8fba-4eef-b06a-6f76d9ab2218",
  "at": "2025-08-10T00:55:39.020Z"
}
Sample Logs with Correlation ID
Backend:


{"service":"backend","msg":"emitting event","payload":{"eventType":"LOW_STOCK","productId":"SKU-100","currentQty":1,"threshold":5,"correlationId":"e8e31822-8fba-4eef-b06a-6f76d9ab2218","at":"2025-08-10T00:55:39.020Z"}}
Function:


{"service":"function","fn":"ProcessStockEvent","correlationId":"e8e31822-8fba-4eef-b06a-6f76d9ab2218","status":"success"}
Suuplier API:

Edit
POST /order
{"ok":true,"correlationId":"e8e31822-8fba-4eef-b06a-6f76d9ab2218"}
