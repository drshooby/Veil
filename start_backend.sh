#!/bin/bash
# Must do "chmod +x start_backend.sh" to make executable
# Build the image
docker build -t my-backend-image .
# Run the container
docker run -p 8080:8080 my-backend-image