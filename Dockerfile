FROM node:22-bookworm-slim AS build
WORKDIR /app
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN sed -i 's|https://npm.mirrors.msh.team|https://registry.npmjs.org|g' package-lock.json \
    && sed -i 's|http://npm.mirrors.msh.team|https://registry.npmjs.org|g' package-lock.json \
    && npm ci --include=dev --no-audit --no-fund
COPY . .
RUN npm run build \
    && npm prune --omit=dev

FROM node:22-bookworm-slim
WORKDIR /app
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
ENV NODE_ENV=production
ENV PORT=5000
ENV HOST=0.0.0.0
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -fsS http://127.0.0.1:5000/api/health >/dev/null || exit 1
CMD ["node", "server/index.mjs"]
