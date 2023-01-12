FROM node:18-alpine as build
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./src /app/src
COPY ./public /app/public
RUN npm run build

# Stage 2: Serve app with nginx server
FROM nginx:1.23.3-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/build .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]