# 📈 Steps to deploy Prometheus, Grafana,node-exporter,alert manager etc

## ✅ Prerequisites

helm version
version.BuildInfo{Version:"v3.17.2", GitCommit:"cc0bbbd6d6276b83880042c1ecb34087e84d41eb", GitTreeState:"clean", GoVersion:"go1.23.7"}

kubectl config current-context
expensyAksCluster

## 🚀 Deployment Steps

### Step A: Add Helm Repositories
# 1. Add the Prometheus Community Rep

```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

# 2. (Optional) Add the Stable Charts Repository

```
helm repo add stable https://charts.helm.sh/stable
helm repo update

```

### Step B: Create a Namespace for Monitoring
```
kubectl create namespace prometheus
```
### Step C: Install the kube-prometheus-stack

### Step 1: Deploy Prometheus and Grafana using Helm:

```
helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack -n prometheus

```
### Step 2: Verify Deployment:

```
kubectl get pods -n prometheus
kubectl get svc -n prometheus

```

### Step D: Expose Prometheus and Grafana Outside the Cluster
### Step 1:Edit the Prometheus Service:
```
kubectl get svc -n prometheus
kubectl edit svc kube-prometheus-stack-prometheus -n prometheus
```

### Step 2:Edit the Grafana Service
```
kubectl edit svc kube-prometheus-stack-grafana -n prometheus
```