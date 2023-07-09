#!/bin/bash

DIR=$(pwd)

BACKUP="$DIR/Documents/pacmann/linux-container/todo-app-docker/utils/backups/backup_$(date +%d-%m-%Y).sql"

docker exec postgres-container pg_dumpall -U postgres > "$BACKUP"