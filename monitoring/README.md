# 📈 Steps to deploy Prometheus, Grafana,node-exporter,alert manager etc

## ✅ Prerequisites
1. Verify Helm Installation
```helm version```

2. Verfiy connection to your AKS Cluster
```kubectl config current-context```

## 🚀 Deployment Steps

### Step A: Add Helm Repositories
1. Add the Prometheus Community Repo

```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

2. (Optional) Add the Stable Charts Repository

```
helm repo add stable https://charts.helm.sh/stable
helm repo update

```

### Step B: Create a Namespace for Monitoring
```
kubectl create namespace monitoring
```
### Step C: Install the kube-prometheus-stack
1. Deploy Prometheus and Grafana using Helm:

```
helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack -n monitoring

```
2. Verify Deployment:

```
kubectl get pods -n monitoring
kubectl get svc -n monitoring

```

### Step D: Expose Prometheus and Grafana Outside the Cluster
1. Edit the Prometheus Service:

```
kubectl get svc -n prometheus
kubectl edit svc kube-prometheus-stack-prometheus -n monitoring
```

2. Edit the Grafana Service
```
kubectl edit svc kube-prometheus-stack-grafana -n monitoring
```