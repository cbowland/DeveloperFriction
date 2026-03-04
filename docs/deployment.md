# Building and Deploying

## Deploying via Red Hat Developer Hub (Recommended)

RHDH can install the Tekton pipeline on the cluster and trigger a full build-and-deploy in one step using the Software Template.

1. Register `template.yaml` in your RHDH catalog locations (if not already done).
2. In RHDH, go to **Create** and choose **Deploy Developer Friction Survey**.
3. Fill in the namespace and confirm the defaults (git URL, image repo, app name).
4. RHDH will:
    - Install the Tekton Pipeline in your namespace
    - Create a PipelineRun that clones the repo, builds the container with Buildah, pushes to quay.io, and deploys to OpenShift

Monitor the pipeline run on the component's **CI** tab in RHDH.

## Deploying via CLI

### Option 1: Tekton Pipeline

Install the pipeline and trigger a build-and-deploy manually:

```bash
oc apply -f tekton/pipeline.yaml
oc create -f tekton/pipelinerun.yaml
```

The pipeline will:

1. Clone the Git repository
2. Build the container image with Buildah
3. Push to `quay.io/cbowland/developer-friction-survey` (tagged with the commit SHA and `latest`)
4. Apply the Deployment, Service, and Route manifests
5. Wait for the rollout to complete

### Option 2: Apply Manifests Directly

If the image is already built and pushed to quay.io, apply the plain manifests:

```bash
oc apply -f k8s/
oc rollout status deployment/developer-friction-survey
```

## Building Locally

To build and push the image from your Mac without the pipeline:

```bash
podman build --platform linux/amd64 -f Containerfile -t developer-friction-survey .
podman login quay.io
podman tag developer-friction-survey quay.io/cbowland/developer-friction-survey:latest
podman push quay.io/cbowland/developer-friction-survey:latest
```

Build stages run natively on ARM; only the runtime stage targets `linux/amd64` for OpenShift.

## Getting the Route URL

After deployment, retrieve the public URL:

```bash
oc get route developer-friction-survey -o jsonpath='{.spec.host}'
```

## Red Hat Developer Hub Integration

The component is registered in RHDH via `catalog-info.yaml`. Key annotations:

| Annotation                                | Purpose                                         |
|-------------------------------------------|-------------------------------------------------|
| `backstage.io/kubernetes-id`              | Links component to Kubernetes resources          |
| `backstage.io/kubernetes-label-selector`  | Allows RHDH to find the running deployment       |
| `janus-idp.io/tekton`                     | Displays Tekton pipeline runs on the component page |

To register the component, go to **Create > Register Existing Component** in RHDH and enter the URL to `catalog-info.yaml` in your GitHub repository.
