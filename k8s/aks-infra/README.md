# Cluster deployment via Azure CLI

## Login to Azure
```az login```

## List available Azure regions
```az account list-locations -o table```

## Create resource group
```az group create --name expensyAksRG --location uaenorth```

## List avalible sizes and quotas
```
az vm list-sizes --location uaenorth --out table
az vm list-usage --location uaenorth -o table
```

## Create AKS cluster
```
az aks create \
  --resource-group expensyAksRG \
  --name expensyAksCluster \
  --node-count 3 \
  --node-vm-size Standard_DS2_v2 \
  --enable-addons monitoring \
  --generate-ssh-keys \
  --enable-managed-identity
```
## Verify:
```az aks list -o table```

## Connect to AKS Cluster
```az aks get-credentials --resource-group expensyAksRG --name expensyAksCluster``` 
(This command merges your AKS cluster credentials into your local kubeconfig file)

## Verify context
```kubectl config get-contexts```

## Test Connectivity
```kubectl get nodes```

## Cleanup
```az group delete --name expensyAksRG --yes --no-wait ```

Verify Deletion:
```az group list --output table```

---
# Cluster deployment via bicep file 
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
