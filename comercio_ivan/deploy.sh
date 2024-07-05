cd /var/www/comercio
git pull origin main
composer install --no-interaction --prefer-dist --optimize-autoloader --ignore-platform-reqs
npm install && npm run build

( flock -w 10 9 || exit 1
    echo 'Restarting FPM...'; sudo -S service php8.2-fpm reload ) 9>/tmp/fpmlock

if [ -f artisan ]; then
    php artisan migrate --force
    php artisan optimize
    php artisan cache:clear
fi

#php artisan horizon:terminate
