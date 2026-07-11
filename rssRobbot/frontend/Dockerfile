FROM node:18-alpine AS build

WORKDIR /app

COPY package.json ./
COPY frontend/package.json ./frontend/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/shared-types/src ./packages/shared-types/src/

RUN npm install

COPY frontend/. ./frontend/
RUN npm run build --workspace=frontend

FROM nginx:alpine

COPY --from=build /app/frontend/dist /usr/share/nginx/html

COPY frontend/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]