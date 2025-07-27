#!/bin/sh

set -a
. /usr/src/app/.env
set +a

sleep 3;

until mariadb --skip-ssl -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1"; do
  echo "Aguardando o banco de dados ficar disponível..."
  sleep 2
done

mariadb --skip-ssl -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_DATABASE" < /usr/src/app/migration.sql

sleep 3;

npm run dev
