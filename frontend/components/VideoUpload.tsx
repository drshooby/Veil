import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import GridLoader from "react-spinners/GridLoader";
import { motion } from "framer-motion";

const VideoUpload = () => {
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [backendUrl, setBackendUrl] = useState<string>('');
  const [downloadLink, setDownloadLink] = useState<string>('');
  const [videoName, setVideoName] = useState<string>('veiled.mp4');
  // const text = "Who will you veil today?".split(" ");
  const text = "".split(" ");

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
      // Send the video file to the backend
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

      // Handle success response (assumes backend returns the video URL)
      if (response.status === 200) {
        setUploadSuccess(true);

        // Create a URL for the processed video file returned by the backend
        const processedVideoUrl = URL.createObjectURL(response.data);
        setDownloadLink(processedVideoUrl);
        setVideoName("veiled_" + videoFile?.name);

        setVideoFile(null); // Clear the selected file
        console.log('Video processed and ready for download');
      }
    } catch (error) {
      console.error('Upload failed', error);
      setUploadError('Error uploading video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    // window.location.reload();
    setLoading(false);
    setVideoFile(null);
    setUploadError(null);
    setUploadSuccess(false);
    setDownloadLink('');
  };

  return (
    <div className="upload-container">
      {!loading && !videoFile && !uploadSuccess && !uploadError && (
        <>
          {text.map((el, i) => (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: i / 5
              }}
              key={i}
              style={{ display: 'inline-block', marginRight: '10px' }}
            >
              {el}{" "}
            </motion.p>
          ))}
          <br /><br />
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>Drag & drop a video file, or click to upload one.</p>
          </div>
        </>
      )}

      {videoFile && !loading && !uploadSuccess && !uploadError && (
        <div className="centered-container">
          <p>Video selected: {videoFile.name}</p>
          <motion.button whileTap={{ scale: 0.8 }} onClick={handleSubmit}>SUBMIT</motion.button>
          <motion.button whileTap={{ scale: 0.8 }} onClick={handleRefresh}>BACK</motion.button>
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
          <a href={downloadLink} download={videoName}>
            <motion.button whileTap={{ scale: 0.8 }}>DOWNLOAD</motion.button>
          </a>
          <motion.button whileTap={{ scale: 0.8 }} onClick={handleRefresh}>BACK</motion.button>
        </div>
      )}

      {uploadError && (
        <div className="error-message">
          <p>{uploadError}</p>
          <motion.button whileTap={{ scale: 0.8 }} onClick={handleRefresh}>BACK</motion.button>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
