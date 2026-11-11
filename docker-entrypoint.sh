#!/bin/sh
set -e

echo "==> Synchronizing database schema with Prisma..."
./node_modules/.bin/prisma db push --skip-generate

echo "==> Starting application..."
exec "$@"
