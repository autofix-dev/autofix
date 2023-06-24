# To force Gitpod to rebuild this Dockerfile, increment this counter
ARG FORCE_REBUILD=1

FROM gitpod/workspace-full

ENV PATH="$PATH:/workspace/autofix/bin"
