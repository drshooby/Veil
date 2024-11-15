#!/bin/bash
# Must do "chmod +x start.sh" (different for Windows) to make executable!
# Windows users can run from Git Bash or WSL

# Does the user have docker installed?
if ! command -v docker &> /dev/null; then
    echo "Docker could not be found. Please install Docker first."
    exit 1
fi

# Does the user have docker-compose installed?
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose could not be found. Please install Docker Compose first."
    exit 1
fi

set -e
echo "Quick setup for Docker backend and frontend."

# Build the images using Docker Compose
echo "Building backend and frontend images..."
docker-compose build

# Start the services using Docker Compose
echo "Starting backend and frontend services..."
docker-compose up -d

# Print the URLs for accessing the services
echo "Setup complete."
echo "Frontend is running on http://localhost:3000"
echo "Backend is running on http://localhost:8080"