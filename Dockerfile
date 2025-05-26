FROM denoland/deno:2.0.2

ARG GIT_REVISION
ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}

WORKDIR /app

COPY . .
RUN deno cache main.ts --import-map=import_map.json

EXPOSE 8000

RUN useradd -U -u 1000 appuser && chown -R 1000:1000 /app
USER 1000
CMD ["run", "-A", "main.ts"]