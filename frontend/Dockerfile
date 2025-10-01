FROM node:18 as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Usar el mismo nombre de variable que en tu código JS
ARG VITE_API_BASE=http://localhost

ENV VITE_API_BASE=$VITE_API_BASE

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
