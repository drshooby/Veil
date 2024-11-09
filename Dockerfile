# Use the official Python image from the Docker Hub as the base image
FROM python:3.9-slim

# Install system dependencies (including ffmpeg and OpenCV dependencies)
RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    libsm6 \
    libxext6 \
    && apt-get clean

# Set the working directory in the container
WORKDIR /backend

# Copy the requirements.txt file into the container
COPY requirements.txt .

# Install Python dependencies (Flask, etc.)
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend directory into the container
COPY backend/ /backend/

# Expose the port Flask will run on (default is 5000)
EXPOSE 8080

# Command to run the Flask app (adjust if necessary)
CMD ["python", "app.py"]