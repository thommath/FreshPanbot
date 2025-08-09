FROM denoland/deno:2.4.3

ARG GIT_REVISION
ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}
ENV DENO_DIR=/app/.deno

WORKDIR /app

COPY import_map.json main.ts ./
RUN deno run -A --watch=static/,routes/ main.ts

COPY . .

EXPOSE 8000
CMD ["run", "-A", "main.ts"]
