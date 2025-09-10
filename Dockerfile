FROM node:23-alpine3.20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY ./ ./
RUN npm run build -- --configuration production
FROM nginx:alpine3.21
COPY --from=build /app/dist/<your-project-name> /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]