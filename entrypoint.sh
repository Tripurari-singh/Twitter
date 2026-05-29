#!/bin/sh
set -e

echo "Setting up environment..."
# Write DATABASE_URL to .env file so prisma.config.ts can read it
echo "DATABASE_URL=${DATABASE_URL}" > .env

echo "Running migrations..."
npx prisma migrate deploy

echo "Starting app..."
exec node server.js
