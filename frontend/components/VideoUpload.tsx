import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const VideoUpload = () => {
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [backendUrl, setBackendUrl] = useState<string>('');
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
