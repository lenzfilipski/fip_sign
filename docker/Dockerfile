FROM oven/bun:latest as build-stage
WORKDIR /app
COPY package*.json ./
COPY bun.lockb ./
RUN bun install
COPY public/ ./public
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY src/ ./src/
RUN bun run build

FROM nginx:latest
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]