<!-- Final Project: End-to-End DevOps Deployment -->
# 💸 Expensy - Expense Tracker App

Expensy is a full-stack expense tracking application built with **Next.js** (frontend) and **Node.js/Express** (backend), containerized with **Docker**, deployed to **Kubernetes (EKS/AKS)**, and integrated with **Prometheus/Grafana** for monitoring.

# Objectives :
1. Apply DevOps practices to build and manage a full-stack application in a production-grade environment
2. Design and implement a CI/CD pipeline using GitHub Actions to automate application delivery
3. Containerize frontend and backend services using Docker
4. Deploy and orchestrate containerized applications using Kubernetes on Azure Kubernetes Service (AKS)
5. Configure NGINX Ingress for routing external HTTP(S) traffic to microservices
6. Set up real-time monitoring and dashboards using Prometheus and Grafana
<br>

# Pre-requisites

- Docker & Docker Compose
- Node.js & npm
- MongoDB & Redis (local or containers)

# 🌐 Web Application Overview

The application is an Expense Tracker and consists of multiple services built with different languages and technologies, simulating real-world scenarios where various components interact within a microservices architecture. The application includes:

| Component    | Description                                      |
|--------------|--------------------------------------------------|
| Frontend     | Built with **Next.js** – web interface           |
| Backend      | Built with **Node.js/Express** – API logic       |
| MongoDB      | Persistent data storage                          |
| Redis        | In-memory cache for speed                        |

This sample application is an Expense Tracker with four microservices, a backend built in node, frontend built with Next.js (Node based framework), along with a MongoDB database and Redis caching DB.

[Clone this repository and share it with the team](https://github.com/saurabhd2106/devops-final-project.git)


# 🧪 Local Development Setup

## 1️⃣ Backend
  ``` 
      npm install
      npm run build
  ```

## 2️⃣ Redis Container
 ```docker run --name redis -d -p 6379:6379   redis:latest   redis-server --requirepass someredispassword```

## 3️⃣ MongoDB Container
```docker run --name mongo -d -p 27017:27017   -e MONGO_INITDB_ROOT_USERNAME=root   -e MONGO_INITDB_ROOT_PASSWORD=example   mongo:latest```

## 4️⃣ Frontend
```npm run dev```


# Step 1 - 🐳 Dockerized Setup:
This project uses **GitHub Actions** to automate Docker image builds and deployment preparation for both frontend and backend.The steps below will be executed inside a CI pipeline of the project.

## 1.1 Containerize the services (frontend,backend) using Docker.

### Backend(node.js)
```
cd expensy_backend
docker build -t backend:latest .
docker run -p 8706:8706 backend:latest
```
### Frontend(next.js)
```
cd expensy_frontend
docker build -t frontend:latest .
docker run -p 3000:3000 frontend:latest
```
Visit http://localhost:3000 to see the expensy app running in Docker.

## 1.2 Orchestrate multi-service deployments with Docker Compose (for single-machine deployments).
To manage and run all services (frontend,backend, redis, and mongodb) together, create a docker-compose.yml file in root directory of the Microservices project. It sets up networks and volumes, ensuring seamless communication between containers.

```docker compose up -d --build```

This will:

Start Redis and Mongodb
Build and run frontend and backend.

Access the Application:

Expensy App: http://localhost:3000


# Step 2- Kubernetes Deployment-

## 1.1. Cluster deployment via bicep file 
 1. Create-rg.bicep

 Deploy this at the subscription level:
```
az deployment sub create \
  --location uaenorth \
  --template-file create-rg.bicep
```

2. Create aks-cluster.bicep

Deploy it at the resource group level:
```
az deployment group create \
  --resource-group expensyAksRG \
  --template-file aks-cluster.bicep \
  --parameters sshPublicKey="$(cat ~/.ssh/id_rsa.pub)"
```
If necessary:
``` ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa```

3. Get credentials for kubectl access
```az aks get-credentials --resource-group expensyAksRG --name expensyAksCluster ```

## 1.2 Kubernetes Manifests
Create separate Deployment and Service YAML files for each microservice. Secrets/configs are stored via Kubernetes Secrets.

For backend specify the environment variables for mongodb and redis-

        ```
          env:           
            - name: DATABASE_URI
              valueFrom:
                secretKeyRef:
                  name: expensy-secrets
                  key: DATABASE_URI
            - name: REDIS_PORT
              value: "6379"
            - name: REDIS_HOST
              value: "redis-service" # Reference the corresponding service name
            - name: REDIS_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: expensy-secrets
                  key: redis-password
        ```

# Step 3- CI/CD Pipeline-
 GitHub Actions workflow is defined at:

.github/workflows/CI-pipeline.yaml
.github/workflows/CD-pipeline.yaml

# Step 4- Test the project:

Once the CI-CD pipelines runs successfully, confirm:

All Deployments and Pods are running:

```kubectl get deployments```
```kubectl get pods```

The NGINX Ingress has an external IP or DNS address:

```kubectl get ingress```

Access the app:

http://<INGRESS_IP>

Test the flow: Add expense and see if the expense data is stored.

# Step 5- Monitoring & Logging:
## Monitoring Stack
 Configured Prometheus to scrape metrics from pods
 Used node-exporter to scrape system level metrics

## Grafana dashboards:
Sample visualizations and alerting setup is included.


# Step 6- Security and Compliance:
  Secrets are managed via Kubernetes Secrets
  IAM roles used for cloud access 
  Mongo/Redis passwords never committed
  See ```SECURITY.md``` for more


