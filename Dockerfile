# ==================== BUILD STAGE ====================
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .

# Variables inyectadas en build time como ARG
ARG VITE_API_URL
ARG VITE_IS_SANDBOX=true
ARG VITE_GOOGLE_MAPS_KEY
ARG VITE_MP_PUBLIC_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_IS_SANDBOX=$VITE_IS_SANDBOX
ENV VITE_GOOGLE_MAPS_KEY=$VITE_GOOGLE_MAPS_KEY
ENV VITE_MP_PUBLIC_KEY=$VITE_MP_PUBLIC_KEY

RUN npx vite build && test -d dist

# ==================== PRODUCTION STAGE ====================
FROM nginx:alpine AS production

# Elimina config default de nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia config con soporte para SPA y $PORT de Railway
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copia el build de Vite
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["/bin/sh", "-c", "envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
