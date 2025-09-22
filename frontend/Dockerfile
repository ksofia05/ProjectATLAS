# Base Node (ligero). Luego fijamos npm 10.9.0 explícitamente.
FROM node:20-alpine

# Asegurar npm 10.9.0
RUN npm i -g npm@10.9.0

WORKDIR /app

# Instala deps con cache eficiente
COPY package*.json ./
RUN npm install

# Copia el resto del código
COPY . .

# ARG VITE_API_BASE
# ARG VITE_SUPABASE_URL
# ARG VITE_SUPABASE_ANON_KEY

# ENV VITE_API_BASE=$VITE_API_BASE
# ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
# ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Construimos el build de producción de Vite
COPY .env.docker .env
RUN cp .env.docker .env
RUN npm run build

# Vite necesita escuchar en todas las interfaces y en el puerto 80
EXPOSE 80

# Ejecuta Vite Dev Server en :80 (en lugar de 5173)
# # El argumento --host 0.0.0.0 permite acceso desde fuera del contenedor
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "80"]

CMD ["npm", "run", "preview", "--", "--port", "80", "--host", "0.0.0.0"]

