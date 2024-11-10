import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import GridLoader from "react-spinners/GridLoader";

const VideoUpload = () => {
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [backendUrl, setBackendUrl] = useState<string>('');

  // Dynamically set the backend URL only on the client side
  useEffect(() => {
    if (window.location.hostname === 'localhost') {
      setBackendUrl('http://localhost:8080/upload');
    } else if (typeof window !== 'undefined') {
      setBackendUrl(`${window.location.origin}/upload`);
    } else {
      console.error('Window object not found');
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

  return (
    <div className="upload-container">
      {!loading && !videoFile && !uploadSuccess && !uploadError && (
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>Drag & drop a video file, or click to select one</p>
        </div>
      )}

      {videoFile && !loading && !uploadSuccess && !uploadError && (
        <div>
          <p>Video Selected: {videoFile.name}</p>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}

      {loading && (
        <>
          <GridLoader
            color="#c1d6db"
            loading={loading}
            margin={10}
            size={20}
            speedMultiplier={1}
          />
          <p>Processing...</p>
        </>
      )}

      {uploadSuccess && (
        <div className="success-message">
          <p>Upload successful! Your video has been submitted.</p>
        </div>
      )}

      {uploadError && (
        <div className="error-message">
          <p>{uploadError}</p>
          <button onClick={handleRefresh}>Refresh Page</button>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
