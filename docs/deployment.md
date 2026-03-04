# Building and Deploying

## Building the Container Image

The application uses a multi-stage Containerfile based on Red Hat UBI 9 Node.js images. Build stages run natively on the host architecture (producing platform-independent JavaScript output), while the runtime stage targets `linux/amd64` for OpenShift.

```bash
podman build --platform linux/amd64 -f Containerfile -t developer-friction-survey .
```

## Pushing to Quay.io

Tag and push the image to your quay.io repository:

```bash
podman login quay.io
podman tag developer-friction-survey quay.io/cbowland/developer-friction-survey:latest
podman push quay.io/cbowland/developer-friction-survey:latest
```

Ensure the quay.io repository is public, or configure an image pull secret in your OpenShift namespace.

## Deploying to OpenShift

### Option 1: Apply Manifests Directly

The `k8s/` directory contains plain OpenShift manifests for the Deployment, Service, and Route.

```bash
oc apply -f k8s/
oc rollout status deployment/developer-friction-survey
```

### Option 2: Tekton Pipeline

The Tekton pipeline deploys a prebuilt image from quay.io.

1. Install the pipeline on the cluster:

    ```bash
    oc apply -f tekton/pipeline.yaml
    ```

2. Trigger a deploy:

    ```bash
    oc create -f tekton/pipelinerun.yaml
    ```

### Getting the Route URL

After deployment, retrieve the public URL:

```bash
oc get route developer-friction-survey -o jsonpath='{.spec.host}'
```

## Red Hat Developer Hub

The component is registered in RHDH via `catalog-info.yaml`. Key annotations:

| Annotation                                | Purpose                                         |
|-------------------------------------------|-------------------------------------------------|
| `backstage.io/kubernetes-id`              | Links component to Kubernetes resources          |
| `backstage.io/kubernetes-label-selector`  | Allows RHDH to find the running deployment       |
| `janus-idp.io/tekton`                     | Displays Tekton pipeline runs on the component page |

To register the component, go to **Create > Register Existing Component** in RHDH and enter the URL to `catalog-info.yaml` in your GitHub repository.
