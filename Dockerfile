FROM php:8.3-fpm

# Actualiza el sistema, instala dependencias y Composer en una sola capa
RUN apt-get update -y && apt-get upgrade -y && \
    apt-get install -y git nano unzip libssl-dev curl && \
    # Descargar e instalar Composer
    curl -sS https://getcomposer.org/installer -o /tmp/composer-setup.php && \
    HASH=$(curl -sS https://composer.github.io/installer.sig) && \
    php -r "if (hash_file('SHA384', '/tmp/composer-setup.php') === '$HASH') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('/tmp/composer-setup.php'); exit(1); } echo PHP_EOL;" && \
    php /tmp/composer-setup.php --install-dir=/usr/local/bin --filename=composer && \
    rm /tmp/composer-setup.php  # Limpiar archivos temporales

# Comando por defecto (puedes cambiarlo si tienes algo específico que ejecutar)
CMD ["php-fpm"]