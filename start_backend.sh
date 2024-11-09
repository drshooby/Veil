#!/bin/bash
# Must do "chmod +x start_backend.sh" (different for Windows) to make executable!
# Windows users can run from Git Bash or WSL

# Does the user have docker installed?
if ! command -v docker &> /dev/null; then
    echo "Docker could not be found. Please install Docker first."
    exit 1
fi

set -e
echo "Quick setup for docker backend image."

# Build the image
docker build -t my-backend-image .
# Run the container
docker run -p 8080:8080 my-backend-image

echo "Setup complete, backend now running on http://localhost:8080"