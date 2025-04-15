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
To keep the monitoring components isolated, create a dedicated namespace (e.g., monitoring):
```
kubectl create namespace monitoring
```
### Step C: Install the kube-prometheus-stack
1. Deploy Prometheus and Grafana using Helm:

```
helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack -n monitoring

```
This package deploys Prometheus, Grafana, and additional Kubernetes monitoring components.

2. Verify Deployment:

```
kubectl get pods -n monitoring
kubectl get svc -n monitoring

```

### Step D: Expose Prometheus and Grafana Outside the Cluster
By default, the services are deployed as ClusterIP, accessible only inside the cluster. Update them to LoadBalancer so they are accessible from browser.

1. Edit the Prometheus Service:

```
kubectl get svc -n monitoring
kubectl edit svc kube-prometheus-stack-prometheus -n monitoring
```
In the editor, change the type: field from ClusterIP to LoadBalancer, then save and exit.

2. Edit the Grafana Service
```
kubectl edit svc kube-prometheus-stack-grafana -n monitoring
```
Similarly for Grafan, change the type: field from ClusterIP to LoadBalancer. Save and exit.