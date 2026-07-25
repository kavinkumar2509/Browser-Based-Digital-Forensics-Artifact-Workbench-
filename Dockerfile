# Build the browser-only React application.
FROM node:20-alpine AS build

WORKDIR /app

# Keep dependency installation cacheable and reproducible.
COPY package.json package-lock.json ./
RUN npm ci

COPY . ./
RUN npm run build

# Serve only compiled static assets in the final image.
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
