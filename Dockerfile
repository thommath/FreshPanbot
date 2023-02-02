FROM denoland/deno:1.25.0

ENV DENO_DEPLOYMENT_ID=${DRONE_COMMIT_SHA}

WORKDIR /app

COPY . .
RUN deno cache main.ts --import-map=import_map.json

EXPOSE 8000

CMD ["run", "-A", "main.ts"]