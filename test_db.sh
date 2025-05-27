#!/bin/bash

sudo docker-compose -f docker-compose.test.yml down --volumes
sudo rm -rf ./test-db/data
sudo docker compose -f docker-compose.test.yml up --force-recreate
