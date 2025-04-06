#!/bin/bash
source ../.env
echo "Stopping any running test database containers..."
docker compose stop db-test

echo "Removing existing test database..."
docker compose exec -T db psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -c "DROP DATABASE IF EXISTS ${TEST_POSTGRES_DB};"

echo "Creating a new test database..."
docker compose exec -T db psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -c "CREATE DATABASE ${TEST_POSTGRES_DB} WITH TEMPLATE ${POSTGRES_DB} OWNER ${TEST_POSTGRES_USER};"

echo "Restarting test database container..."
docker compose up -d db-test

echo "Database copy completed successfully."
