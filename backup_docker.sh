#!/bin/bash

# Settings
VOLUME_NAME="db-data"
BACKUP_DIR="/home/com6023m/com6023m/docker_backups"

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

while true; do
  TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
  BACKUP_FILE="$BACKUP_DIR/${VOLUME_NAME}_$TIMESTAMP.tar.gz"

  echo "[$(date)] Starting backup..."

  sudo docker run --rm \
    -v ${VOLUME_NAME}:/volume \
    -v "$BACKUP_DIR":/backup \
    alpine \
    tar czf /backup/$(basename "$BACKUP_FILE") -C /volume .

  echo "[$(date)] Backup created at $BACKUP_FILE"

  echo "[$(date)] Cleaning up old backups..."
  backup_files=("$BACKUP_DIR"/db-data_*.tar.gz)
  backup_count=${#backup_files[@]}

  if (( backup_count > 10 )); then
    files_to_delete=($(ls -1t "$BACKUP_DIR"/db-data_*.tar.gz | tail -n +11))
    for file in "${files_to_delete[@]}"; do
      echo "Deleting old backup: $file"
      rm -f "$file"
    done
  else
    echo "[$(date)] No old backups to delete."
  fi

  echo "[$(date)] Sleeping 30 minutes..."
  sleep 1800
done