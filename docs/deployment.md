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

## Automatic Builds on Git Push

Tekton Triggers allow the pipeline to run automatically whenever code is pushed to the GitHub repo.

### Setup

1. Apply all Tekton resources to the target namespace:

    ```bash
    oc project bobcat
    oc apply -f tekton/
    ```

    This installs:

    - `pipeline.yaml` -- the build-and-deploy pipeline
    - `trigger-template.yaml` -- defines the PipelineRun created on each trigger
    - `trigger-binding.yaml` -- extracts git URL, branch, and commit from the GitHub webhook payload
    - `event-listener.yaml` -- receives incoming webhook events and filters for push events
    - `event-listener-route.yaml` -- exposes the EventListener externally via an OpenShift Route

2. Get the webhook URL:

    ```bash
    oc get route developer-friction-survey-webhook -o jsonpath='https://{.spec.host}'
    ```

3. In your GitHub repo, go to **Settings > Webhooks > Add webhook**:
    - **Payload URL**: the route URL from step 2
    - **Content type**: `application/json`
    - **Events**: select **Just the push event**
    - **Active**: checked

Once configured, every `git push` to the repo triggers a new PipelineRun that builds, pushes, and deploys the latest code.

### How It Works

```
GitHub push event
  → EventListener (receives webhook)
  → TriggerBinding (extracts repo URL, branch, commit)
  → TriggerTemplate (creates PipelineRun)
  → Pipeline (git-clone → buildah → tag-latest → deploy)
```

## Deploying via CLI

### Option 1: Tekton Pipeline (manual trigger)

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

| Annotation                                | Purpose                                          |
|-------------------------------------------|--------------------------------------------------|
| `backstage.io/kubernetes-id`              | Links component to Kubernetes resources           |
| `backstage.io/kubernetes-namespace`       | Tells RHDH which namespace to query               |
| `backstage.io/kubernetes-label-selector`  | Allows RHDH to find the running deployment        |
| `janus-idp.io/tekton`                     | Displays Tekton pipeline runs on the component page |

To register the component, go to **Create > Register Existing Component** in RHDH and enter the URL to `catalog-info.yaml` in your GitHub repository.
