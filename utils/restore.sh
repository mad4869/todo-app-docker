#!/bin/bash

BACKUP="/var/backups/backup_$(date +%d-%m-%Y).sql"

docker exec postgres-container psql -U postgres -d todo-db -f "$BACKUP"