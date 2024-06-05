## Sistema de Tramites del Ayuntamiento de la Paz

## Configurar ambiente de desarrollo
```shell
php artisan migrate
php artisan db:seed
```

## Roles
Los roles de los diferentes usuarios estan definidos en la base de datos en el archivo seeder [RolesSeeder](./database/seeders/RolesSeeder.php), y se puede revisar si un usuario contiene algun rol especifico de la siguiente manera:
```php
$user->esSuperAdmin() // regresa true o false
Auth::user()->esEntidadRevisora()
currentUser()->esPersona()
```
Los metodos disponibles estan definidos en el archivo trait [HasRoles](./app/Contracts/HasRoles.php).
Evitar hacer uso de declaraciones dificil de mantener y entender a largo plazo como:
```php
$user->rol->id === 1
```
Tambien existe un middleware que puede usarse para verificar el rol del usuario y se puede usar de la siguiente manera:
```php
Route::get('/')->middleware('rol:superadmin');
```
Los valores acceptados son:
```
- superadmin
- entidad-revisora
- persona
- admin-comercio
- director-entidad-revisora
- director-comercio
- admin-comercio-visor
```

## Crear una Cuenta
Para crear una cuenta se puede usar un RFC real o los valores `test-rfc-ok` y `test-rfc-fail` para pruebas.

## Unit Testing
Para correr las pruebas unitarias executar el siguiente comand:
```shell
vendor/bin/phpunit --exclude-group apis
```

## Codigo Limpio
Asegurate de escribir codigo limpio con los siguientes comandos:
```shell
./vendor/bin/pint
vendor/bin/phpcs -s --standard=PSR12 app
```
