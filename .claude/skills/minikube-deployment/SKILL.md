---
name: minikube-deployment
description: Deploy containerized Nexa Todo Chatbot on local Minikube using AI-assisted tools (kubectl-ai, kagent). Covers starting Minikube, applying Helm charts, port-forwarding frontend, verifying pods/services, and basic debugging. Essential for Phase IV local Kubernetes deployment.
---

# Minikube Deployment

Deploy containerized Nexa Todo Chatbot on local Minikube using AI-assisted tools (kubectl-ai, kagent). Covers starting Minikube, applying Helm charts, port-forwarding frontend, verifying pods/services, and basic debugging. Essential for Phase IV local Kubernetes deployment.

## Quick Start

- Start Minikube cluster with appropriate resources
- Deploy containerized Nexa Todo Chatbot using Helm charts
- Access the application via port-forwarding or ingress
- Verify deployment health and troubleshoot issues
- Use AI tools for cluster analysis and optimization

### Essential Commands

```
minikube start --driver=docker --cpus=4 --memory=8192
```

```
kubectl-ai "deploy Helm chart nexa-todo in default namespace"
```

```
kagent "analyze cluster health and report issues"
```

```
kubectl port-forward svc/nexa-todo-frontend 3000:80
```

```
minikube dashboard
```

## Architecture

| Component | Role | Details |
|-----------|------|---------|
| Minikube Cluster | Local Kubernetes | Single-node Kubernetes cluster running locally |
| Helm Install | Application Deployment | Installs Nexa Todo Chatbot using Helm charts |
| Pods | Application Instances | Running containers for frontend and backend services |
| Chatbot Access | User Interface | Access to the deployed Todo Chatbot application |

## Key Decisions

| Decision | Option A | Option B | Recommendation |
|----------|----------|----------|----------------|
| Driver | Docker | Hyperkit/VirtualBox | Docker for consistency with containerization |
| Resource Allocation | Low (2CPU/4GB) | High (4CPU/8GB) | High for smooth multi-service operation |
| Ingress Addon | Enabled | Disabled | Enabled for proper URL routing |
| Storage Provisioner | Built-in | Custom | Built-in for simplicity |

## Implementation Steps

1. **Start Minikube**
   - Launch Minikube with adequate CPU and memory
   - Enable required addons like ingress and dashboard
   - Verify cluster status and node availability

2. **Prepare Deployment**
   - Ensure containerized images are available
   - Verify Helm charts are properly configured
   - Check values.yaml for Minikube-specific settings

3. **Deploy Application**
   - Install Helm chart using `helm install`
   - Monitor pod creation and status
   - Verify service creation and accessibility

4. **Access Application**
   - Use port-forwarding for immediate access
   - Configure ingress for full URL access
   - Test frontend and backend connectivity

5. **Verify and Debug**
   - Check pod logs for errors
   - Validate service endpoints
   - Use AI tools for cluster analysis

## Anti-Patterns

❌ **No minikube addons** - Missing essential addons like ingress or metrics-server

❌ **Ignoring pod logs** - Not checking container logs when deployment fails

❌ **Insufficient resources** - Allocating too little CPU/memory for multi-service app

❌ **No health checks** - Not verifying deployment status before assuming success

❌ **Hardcoded IP addresses** - Using static IPs instead of service discovery

## Best Practices

✅ **Proper resource allocation** - Assign adequate CPU and memory for smooth operation

✅ **Enable essential addons** - Activate ingress, metrics-server, and dashboard

✅ **Monitor deployment status** - Use kubectl to verify all resources are healthy

✅ **Use AI-assisted tools** - Leverage kubectl-ai and kagent for complex operations

✅ **Clean deployment strategy** - Use proper namespaces and labels for organization

## Essential Commands

### Minikube Management
```bash
minikube start --driver=docker --cpus=4 --memory=8192
minikube stop
minikube delete
minikube dashboard
```

### Addons Configuration
```bash
minikube addons enable ingress
minikube addons enable metrics-server
minikube addons enable dashboard
```

### Deployment Operations
```bash
helm install nexa-todo ./nexa-todo-chart
kubectl get pods
kubectl get services
kubectl get ingress
```

### Access and Verification
```bash
kubectl port-forward svc/nexa-todo-frontend 3000:80
kubectl logs -l app=nexa-todo-frontend
kubectl describe pod <pod-name>
```

## AI-Assisted Operations

Use AI tools to accelerate deployment:

1. **kubectl-ai** for complex deployment commands
2. **kagent** for cluster health analysis
3. **Natural language queries** for troubleshooting
4. **Automated configuration** for best practices
5. **Performance optimization** suggestions

## Troubleshooting

- Check Minikube status with `minikube status`
- Verify available system resources before starting
- Use `minikube logs` to diagnose startup issues
- Check pod statuses with `kubectl get pods -A`
- Use `kubectl describe` for detailed resource information

## Related Skills

- `docker-gordon-integration` - For containerizing applications before deployment
- `helm-chart-generation` - For creating deployment charts used in Minikube
- `kubernetes-manifests` - For alternative non-Helm deployment methods
- `container-security-scanning` - For validating deployed images

## Resource Optimization

For optimal Minikube performance with Nexa Todo Chatbot:

- Allocate minimum 4 CPUs and 8GB RAM
- Enable ingress addon for proper URL routing
- Use Docker driver for consistency with containerization
- Monitor resource usage with metrics-server addon
- Scale down unused services to conserve resources