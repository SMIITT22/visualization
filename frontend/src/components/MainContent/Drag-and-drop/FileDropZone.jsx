import React, { useCallback } from "react";
import "./FileDropZone.styles.css";
import { useDropzone } from "react-dropzone";

const FileDropZone = () => {
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noKeyboard: true,
  });
  return (
    <div
      {...getRootProps()}
      className="dropzone"
    >
      <input {...getInputProps()} />
      <p>FileDropZone</p>
    </div>
  );
};

export default FileDropZone;
