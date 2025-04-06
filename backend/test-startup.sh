#!/bin/bash

echo "Starting PostgreSQL and checking test database..."

# Start PostgreSQL in the background
docker-entrypoint.sh postgres &

# Wait for PostgreSQL to start
until pg_isready -h localhost -p 5432 -U "$POSTGRES_USER"; do
  echo "Waiting for PostgreSQL to start..."
  sleep 2
done

echo "PostgreSQL started. Checking test database..."

# Drop and recreate the test database on every restart
psql -U "$POSTGRES_USER" -d postgres <<EOF
-- Drop the test database if it exists
DROP DATABASE IF EXISTS $TEST_POSTGRES_DB;

-- Create a new test database as a copy of the production database
CREATE DATABASE $TEST_POSTGRES_DB WITH TEMPLATE $POSTGRES_DB OWNER $POSTGRES_USER;
EOF

echo "Test database setup complete."

# Keep the container running in the foreground
wait
