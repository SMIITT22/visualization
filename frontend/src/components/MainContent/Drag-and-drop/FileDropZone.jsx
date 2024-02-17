import React, { useCallback } from "react";
import "./FileDropZone.styles.css";
import { useDropzone } from "react-dropzone";
import { uploadFiles } from "../../../utils/uploadService";

const FileDropZone = () => {
  const onDrop = useCallback(async (acceptedFiles) => {
    console.log("what we are uploading", acceptedFiles);
    try {
      const response = await uploadFiles(acceptedFiles);
      console.log("upload success: ", response);
    } catch (error) {
      console.log("error during the file upload: ", error);
    }
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
