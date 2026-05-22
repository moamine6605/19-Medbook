FROM node:20-alpine

WORKDIR /var/www/frontend

# Keep installs inside the container (named volume mounted at /var/www/frontend/node_modules).
COPY docker/frontend/entrypoint.sh /usr/local/bin/medbook-frontend-entrypoint
RUN chmod +x /usr/local/bin/medbook-frontend-entrypoint

EXPOSE 5173

ENTRYPOINT ["medbook-frontend-entrypoint"]

