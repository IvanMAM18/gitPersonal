#!/bin/bash
#
# Preparar contenedor con base de datos para prueba
#

echo "-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-"

COMMIT_HASH=$(git rev-parse --short HEAD 2>&1)

echo " Commit Hash: $COMMIT_HASH."

export COMMIT_HASH

# Use the appropriate Docker Compose file based on the environment
docker compose -f ./docker/docker-compose.yml up --build

# Dump DB
# docker exec -i comercio-postgres /bin/bash -c "PGPASSWORD=secret psql --username postgres tramites" < ~/Downloads/comercio.sql
