FROM denoland/deno:2.4.3

ARG GIT_REVISION
ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}

WORKDIR /app

COPY . .
RUN deno install --entrypoint main.ts

EXPOSE 8000

RUN useradd -U -u 1000 appuser && chown -R 1000:1000 /app
USER 1000
CMD ["run", "-A", "main.ts"]
