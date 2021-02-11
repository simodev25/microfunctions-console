### STAGE 1: Build ###
FROM node:12.3-alpine AS build
RUN apk add yarn git
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn  install
COPY . .
RUN yarn build
### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
# When the container starts, replace the env.js with values from environment variables
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
