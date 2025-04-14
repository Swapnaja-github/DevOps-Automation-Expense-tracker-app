# 📈 Steps to deploy Prometheus, Grafana,node-exporter,alert manager etc

## ✅ Prerequisites

helm version
version.BuildInfo{Version:"v3.17.2", GitCommit:"cc0bbbd6d6276b83880042c1ecb34087e84d41eb", GitTreeState:"clean", GoVersion:"go1.23.7"}

kubectl config current-context
expensyAksCluster

## 🚀 Deployment Steps

Installation-
### 1. Add the Helm Chart Repository
```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

helm repo update
```

### 2.Install the kube-prometheus-stack-
```
helm install monitoring prometheus-community/kube-prometheus-stack --namespace expensy
```

### 3.Access Grafana UI-
You can port-forward to access Grafana locally:
```

```kubectl port-forward svc/monitoring-grafana -n expensy 3000:80```

Then open: http://localhost:3000

Default credentials:

Username: admin
Password: prom-operator
```
### 4.Explore Prometheus-
```
kubectl port-forward svc/monitoring-kube-prometheus-prometheus -n expensy 9090

Open http://localhost:9090
```