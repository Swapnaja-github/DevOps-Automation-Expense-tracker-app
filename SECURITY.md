# 🔐 Security, IAM.
This document outlines the security practices, Identity and Access Management (IAM) approach followed by this project.

## IAM (Identity and Access Management)

This project follows the principle of **least privilege**, using **Role-Based Access Control (RBAC)** for both Azure and Kubernetes.

### 1. **Role-Based Access Control (RBAC)**
For Azure resources, we use Azure RBAC to define access levels for service principals, users, and groups.

### RBAC (Role-Based Access Control) is enabled in the Kubernetes cluster. Verified by running:

```kubectl api-resources | grep rbac```
 Output confirms presence of:
 roles
 rolebindings
 clusterroles
 clusterrolebindings

This ensures fine-grained access control is in place for users and service accounts in the cluster.

### Namespaced Role: my-nginx-ingress-controller-ingress-nginx
RBAC role assigned to the Nginx Ingress Controller in the expensy namespace:

```kubectl get role my-nginx-ingress-controller-ingress-nginx -n expensy -o yaml```
This role allows specific operations required by the ingress controller, scoped only to the namespace it manages. Fine-grained permission control ensures least privilege.


### 2. **Secret Management**
Sensitive information, such as API keys, credentials, and tokens, is stored securely in:

- **GitHub Secrets**: We store environment-specific secrets like Azure credentials, DockerHub tokens in GitHub Secrets to ensure they are kept safe.
- **Kubernetes Secrets**: For storing and managing kubernetes related secrets such as database connection strings, database URL.


### ✅ To securely configure the secrets in GitHub follow these steps:

1. Go to your **forked repository** on GitHub.
2. Navigate to **Settings** → **Secrets and variables** → **Actions**.
3. Click **New repository secret**.
4. Add the following secrets as listed below.

---

### 📋 Required Secrets

| Secret Name            | Description                                                                 | Required |
|------------------------|-----------------------------------------------------------------------------|----------|
| `AKS_CLUSTER_NAME`     | Name of your Azure Kubernetes Service (AKS) cluster                         | ✅       |
| `AKS_RESOURCE_GROUP`   | Resource group where your AKS cluster is deployed                           | ✅       |
| `AZURE_CREDENTIALS`    | JSON string with Azure Service Principal credentials for deployment         | ✅       |
| `DOCKERHUB_USERNAME`   | Your Docker Hub username                                                    | ✅       |
| `DOCKERHUB_TOKEN`      | Docker Hub access token or password                                         | ✅       |
| `NEXT_PUBLIC_API_URL`  | Public API base URL for the backend                                         | ✅       |

---

### 📝 Example Format for `AZURE_CREDENTIALS`

```json
{
  "clientId": "<your-client-id>",
  "clientSecret": "<your-client-secret>",
  "subscriptionId": "<your-subscription-id>",
  "tenantId": "<your-tenant-id>",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```
---

### ✅  Kubernetes Secrets Setup:
    ```
    kubectl create secret generic expensy-secrets \
	  --from-literal=KEY_NAME="redis" \
	  --from-literal=KEY_NAME="redis-password" \
      --from-literal=KEY_NAME="mongodb" \
	  --from-literal=KEY_NAME="mongodb-password" \
      --from-literal=KEY_NAME="database-URL" \
	  --from-literal=KEY_NAME="database-URL-link" \
	  -n expensy
    ```

Then in your microservice Deployment manifests, you can reference them like:
 ```
   env:
    - name: REDIS_PASSWORD
      valueFrom:
        secretKeyRef:
          name: expensy-secrets
          key: redis-password
 ```


### Secret Handling

### 1. **Environment Variables**
Environment variables are used for configuration, and secret values are never hardcoded in the code. They are injected into the environment during runtime or through CI/CD pipelines.

### 2. **Secrets Encryption**
All secrets stored in GitHub Actions and Kubernetes secrets are encrypted at rest and are only accessible by authorized users or services. For GitHub Actions secrets, only GitHub Actions workflows have access, based on defined permissions. Secrets in Azure are encrypted using Azure's managed encryption services.




