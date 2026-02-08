# Data Model: Local Kubernetes Deployment

## Overview

This document describes the Kubernetes resources and their relationships for the containerized Todo Chatbot application deployment. The model focuses on the infrastructure components needed to deploy and run the application in a Kubernetes environment.

## Kubernetes Resource Models

### Deployment
**Description**: Manages application pods for the frontend and backend services, ensuring the desired number of replicas are running.

**Fields**:
- `name`: Unique identifier for the deployment
- `namespace`: Kubernetes namespace where the deployment resides
- `replicas`: Number of pod replicas to maintain
- `selector`: Labels to identify the pods managed by this deployment
- `template`: Pod template specifying container images, environment variables, and resource limits

**Validation Rules**:
- `name` must be unique within the namespace
- `replicas` must be >= 0 and <= maximum allowed by cluster
- `image` must reference a valid container registry

**Relationships**:
- Creates and manages multiple `Pod` instances
- Associated with `Service` for network access

### Service
**Description**: Exposes applications running on pods to network traffic, providing stable networking and load balancing.

**Fields**:
- `name`: Unique identifier for the service
- `namespace`: Kubernetes namespace where the service resides
- `type`: Service type (ClusterIP, NodePort, LoadBalancer)
- `ports`: List of ports to expose
- `selector`: Labels to identify the pods this service routes traffic to

**Validation Rules**:
- `name` must be unique within the namespace
- `ports` must be valid port numbers (1-65535)
- `selector` must match labels on target pods

**Relationships**:
- Routes traffic to multiple `Pod` instances
- Connected to `Deployment` that manages the pods

### ConfigMap
**Description**: Stores non-confidential data in key-value pairs, used to configure applications from an external source.

**Fields**:
- `name`: Unique identifier for the ConfigMap
- `namespace`: Kubernetes namespace where the ConfigMap resides
- `data`: Key-value pairs containing configuration data
- `binaryData`: Binary data stored in the ConfigMap

**Validation Rules**:
- `name` must be unique within the namespace
- Keys in `data` must consist of alphanumeric characters, '-', '_' or '.'

**Relationships**:
- Referenced by `Deployment` to inject configuration into containers
- May be mounted as volumes in `Pod` instances

### Secret
**Description**: Stores sensitive information such as passwords, OAuth tokens, and SSH keys.

**Fields**:
- `name`: Unique identifier for the Secret
- `namespace`: Kubernetes namespace where the Secret resides
- `data`: Base64 encoded key-value pairs containing sensitive data
- `type`: Type of secret (Opaque, kubernetes.io/service-account-token, etc.)

**Validation Rules**:
- `name` must be unique within the namespace
- Values in `data` must be base64 encoded
- Size must be less than 1MB

**Relationships**:
- Referenced by `Deployment` to inject sensitive data into containers
- May be mounted as volumes in `Pod` instances

### PersistentVolume (PV)
**Description**: Represents a piece of storage in the cluster provisioned by an administrator.

**Fields**:
- `name`: Unique identifier for the PV
- `capacity`: Storage capacity
- `accessModes`: Access modes for the volume
- `persistentVolumeReclaimPolicy`: Action to take when a PV is released

**Validation Rules**:
- `name` must be globally unique
- `capacity` must be a valid storage size
- `accessModes` must be supported by the underlying storage provider

**Relationships**:
- Bound to `PersistentVolumeClaim` for use by applications
- Used by database pods for data persistence

### PersistentVolumeClaim (PVC)
**Description**: Requests storage resources from the cluster for use by applications.

**Fields**:
- `name`: Unique identifier for the PVC
- `namespace`: Kubernetes namespace where the PVC resides
- `resources.requests.storage`: Amount of storage requested
- `accessModes`: Desired access modes

**Validation Rules**:
- `name` must be unique within the namespace
- Requested storage must not exceed available capacity
- Access modes must be supported by available PVs

**Relationships**:
- Bound to a `PersistentVolume` for actual storage
- Used by `Deployment` to provide persistent storage to pods

## Application-Specific Resources

### Frontend Deployment
**Description**: Deployment configuration for the Next.js frontend application

**Fields**:
- `image`: Container image for the frontend (nexa-frontend:latest)
- `port`: Port number the frontend listens on (typically 3000)
- `environment`: Environment variables for the frontend
- `resources`: CPU and memory limits/requests

### Backend Deployment
**Description**: Deployment configuration for the FastAPI backend application

**Fields**:
- `image`: Container image for the backend (nexa-backend:latest)
- `port`: Port number the backend listens on (typically 8000)
- `environment`: Environment variables for the backend
- `resources`: CPU and memory limits/requests

### Database Deployment
**Description**: Deployment configuration for the PostgreSQL database

**Fields**:
- `image`: Container image for PostgreSQL
- `port`: Port number the database listens on (typically 5432)
- `volumeMounts`: Mount points for persistent storage
- `secrets`: Database credentials and configuration

## State Transitions

### Deployment Lifecycle
1. **Created**: Deployment manifest applied to cluster
2. **ReplicaSet Created**: Controller creates ReplicaSet to manage pods
3. **Pods Scheduled**: Pods are scheduled to nodes
4. **Running**: Pods are running and ready to serve traffic
5. **Scaling**: Replica count adjusted based on demand
6. **Terminated**: Deployment is deleted, pods are terminated

### Service Discovery
1. **Endpoint Creation**: Service endpoints are created based on pod selectors
2. **DNS Registration**: Service is registered in cluster DNS
3. **Traffic Routing**: Traffic is routed to healthy pods
4. **Load Balancing**: Traffic is distributed among available pods

## Validation Rules Summary

- All Kubernetes resources must have unique names within their namespace
- Resource dependencies must be properly configured (services select correct pods)
- Network ports must not conflict between services
- Storage resources must be properly requested and bound
- Security contexts must be appropriately configured for sensitive data