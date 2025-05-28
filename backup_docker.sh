#!/bin/bash

VOLUME_NAME="db-data"
BACKUP_DIR="/home/com6023m/com6023m/docker_backups"

mkdir -p "$BACKUP_DIR"

while true; do
  TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
  BACKUP_FILE="$BACKUP_DIR/${VOLUME_NAME}_$TIMESTAMP.tar.gz"

  echo "[$(date)] Starting backup..."

  docker run --rm \
    -v ${VOLUME_NAME}:/volume \
    -v "$BACKUP_DIR":/backup \
    alpine \
    tar czf /backup/$(basename "$BACKUP_FILE") -C /volume .

  echo "[$(date)] Backup created at $BACKUP_FILE"

  # ✅ Cleanup: keep only the 10 most recent backups
  echo "Cleaning up old backups..."
  ls -1t "$BACKUP_DIR"/*.tar.gz | tail -n +11 | xargs -r rm --

  echo "Sleeping 30 minutes..."
  sleep 1800
done
