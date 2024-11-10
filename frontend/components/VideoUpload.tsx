import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const VideoUpload = () => {
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [backendUrl, setBackendUrl] = useState<string>('');

  // Dynamically set the backend URL only on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBackendUrl(`${window.location.origin}/upload`);
    } else {
      setBackendUrl('http://localhost:8080/upload');
    }
  }, []);

  // Set up drag-and-drop functionality
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'video/*': [] },
    maxSize: 1000000000, // 1 GB max size
    onDrop: (acceptedFiles) => {
      setVideoFile(acceptedFiles[0]);
      setUploadError(null); // Reset error message if a new file is selected
    },
    onDropRejected: (rejectedFiles) => {
      setUploadError(`File is too large or not a valid video format.`);
    }
  });

  const handleSubmit = async () => {
    if (!videoFile || !backendUrl) return;

    setLoading(true);
    setUploadError(null);
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append('video_file', videoFile);

    try {
      // Send the video file to the Flask back-end
      const response = await axios.post(backendUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload Progress: ${percent}%`);
          }
        }
      });

      // Handle success response
      if (response.status === 200 && response.data.message) {
        setUploadSuccess(true);
        setVideoFile(null); // Clear the selected file
      }
    } catch (error) {
      console.error('Upload failed', error);
      setUploadError('Error uploading video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };
