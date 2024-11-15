#!/bin/bash
# Must do "chmod +x start.sh" (different for Windows) to make executable!
# Windows users can run from Git Bash or WSL

set -e

# Stop and remove containers only if they exist
if docker ps -q -f name=veil-frontend-1; then
    docker stop veil-frontend-1
    docker rm veil-frontend-1
    echo "veil-frontend-1 stopped and removed."
else
    echo "veil-frontend-1 not running."
fi

if docker ps -q -f name=veil-backend-1; then
    docker stop veil-backend-1
    docker rm veil-backend-1
    echo "veil-backend-1 stopped and removed."
else
    echo "veil-backend-1 not running."
fi

echo "Containers have been deleted (if they were running)."