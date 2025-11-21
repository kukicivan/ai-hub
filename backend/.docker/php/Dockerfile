ARG PHP_VERSION=8.3

FROM php:${PHP_VERSION}-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    mysql-client \
    mysql-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    nodejs \
    npm \
    shadow \
    oniguruma-dev \
    icu-dev \
    $PHPIZE_DEPS \
    linux-headers

# Configure and install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        zip \
        exif \
        pcntl \
        bcmath \
        gd \
        opcache \
        intl \
        mbstring

# Install DOM and other XML-related extensions in one step (DOM first)
RUN docker-php-source extract \
    && docker-php-ext-install dom xml \
    && docker-php-source delete

# Install Xdebug
RUN pecl install xdebug \
    && docker-php-ext-enable xdebug

# Configure PHP-FPM timeouts
RUN echo "request_terminate_timeout = 10800" >> /usr/local/etc/php-fpm.d/www.conf \
    && echo "pm.max_requests = 500" >> /usr/local/etc/php-fpm.d/www.conf

# Configure PHP timeouts
RUN echo "max_execution_time = 10800" >> /usr/local/etc/php/php.ini-production \
    && echo "max_input_time = 10800" >> /usr/local/etc/php/php.ini-production \
    && cp /usr/local/etc/php/php.ini-production /usr/local/etc/php/php.ini

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy PHP configuration
COPY php.ini /usr/local/etc/php/conf.d/custom.ini

# Create user with matching UID/GID
ARG UID=1000
ARG GID=1000

RUN usermod -u ${UID} www-data && \
    groupmod -g ${GID} www-data

# Create necessary directories with proper permissions
RUN mkdir -p /var/www/storage/app/public \
    /var/www/storage/logs \
    /var/www/storage/framework/sessions \
    /var/www/storage/framework/views \
    /var/www/storage/framework/cache \
    /var/www/storage/framework/testing \
    /var/www/bootstrap/cache \
    && chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Switch to www-data user
USER www-data

# Expose port 9000 for PHP-FPM
EXPOSE 9000

CMD ["php-fpm"]