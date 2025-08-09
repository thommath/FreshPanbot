FROM denoland/deno:2.4.3

ARG GIT_REVISION
ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}
ENV DENO_DIR=/app/.deno

RUN useradd -U -u 1000 --create-home appuser

WORKDIR /app

COPY import_map.json main.ts ./
RUN mkdir -p $DENO_DIR && chown -R appuser:appuser /app
RUN deno run -A --watch=static/,routes/ main.ts

COPY . .

USER appuser

EXPOSE 8000
CMD ["run", "-A", "main.ts"]
