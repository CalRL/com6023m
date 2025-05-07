#!/bin/bash

# Settings
VOLUME_NAME="db-data"
BACKUP_DIR="/home/com6023m/docker_backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/${VOLUME_NAME}_$TIMESTAMP.tar.gz"

# Create backup dir if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Run backup using a temporary container
docker run --rm \
  -v ${VOLUME_NAME}:/volume \
  -v "$BACKUP_DIR":/backup \
  alpine \
  tar czf /backup/$(basename "$BACKUP_FILE") -C /volume .

echo "Backup created at $BACKUP_FILE"