FROM node:18-alpine AS build

WORKDIR /app

COPY package.json ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/shared-types/src ./packages/shared-types/src/
COPY packages/rssRobbot/frontend/package.json ./packages/rssRobbot/frontend/

RUN npm install

COPY packages/rssRobbot/frontend/. ./packages/rssRobbot/frontend/
RUN npm run build --workspace=@vibe-coding/rssRobbot-frontend

FROM nginx:alpine

COPY --from=build /app/packages/rssRobbot/frontend/dist /usr/share/nginx/html

COPY packages/rssRobbot/frontend/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]