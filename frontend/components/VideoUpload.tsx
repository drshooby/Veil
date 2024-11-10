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
    maxSize: 52428800, // 50 MB max size
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
        },
        responseType: 'blob',
      });

      // Handle success response
      if (response.status === 200) {
        setUploadSuccess(true);
        setVideoFile(null); // Clear the selected file

        // Create a download link for the processed video
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'veiled_' + videoFile.name);
        document.body.appendChild(link);
        link.click();
        link.remove();

        console.log('Video downloaded successfully');
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
          <p>Drag & drop a video file, or click to upload one.</p>
        </div>
      )}

      {videoFile && !loading && !uploadSuccess && !uploadError && (
        <div className="centered-container">
          <p>Video selected: {videoFile.name}</p>
          <button onClick={handleSubmit}>SUBMIT</button>
          <button onClick={handleRefresh}>BACK</button>
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
          <p>Upload successful.</p>
          <button onClick={handleRefresh}>BACK</button>
        </div>
      )}

      {uploadError && (
        <div className="error-message">
          <p>{uploadError}</p>
          <button onClick={handleRefresh}>REFRESH</button>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
