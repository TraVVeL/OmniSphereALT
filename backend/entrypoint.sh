#!/bin/sh
set -e

echo "Waiting for database..."
while ! nc -z database 3306; do
  sleep 1
done
echo "Database started"

python manage.py makemigrations
python manage.py migrate

exec "$@"