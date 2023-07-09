#!/bin/bash

BACKUP="./utils/backups/backup_$(date +%d-%m-%Y).sql"

docker cp "$BACKUP" postgres-container:/var/backups