FROM php:8.4-cli

WORKDIR /var/www/backend

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    git \
    pkg-config \
    curl \
    unzip \
    libsqlite3-dev \
    default-mysql-client \
    libzip-dev \
    libicu-dev \
  && docker-php-ext-install -j"$(nproc)" \
    pdo \
    pdo_mysql \
    pdo_sqlite \
    intl \
    zip \
  && rm -rf /var/lib/apt/lists/*

# Composer (copy from official image to avoid curl'ing in build)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY docker/backend/entrypoint.sh /usr/local/bin/medbook-backend-entrypoint
RUN sed -i 's/\r$//' /usr/local/bin/medbook-backend-entrypoint \
  && chmod +x /usr/local/bin/medbook-backend-entrypoint

EXPOSE 8000

ENTRYPOINT ["medbook-backend-entrypoint"]
