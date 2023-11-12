FROM node:latest as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY public/ ./public
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY src/ ./src/
RUN npm run build

FROM nginx:latest
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]