import React, { useCallback } from "react";
import "./FileDropZone.styles.css";
import { useDropzone } from "react-dropzone";
import { uploadFiles } from "../../../utils/uploadService";
import { useTreeData } from "../../../context/TreeDataContext";
const FileDropZone = () => {
  const { updateTreeData } = useTreeData();

  const onDrop = useCallback(async (acceptedFiles) => {
    console.log("what we are uploading", acceptedFiles);
    try {
      const response = await uploadFiles(acceptedFiles);
      updateTreeData(response.tree);
      console.log("upload success: ", response.tree);
      alert(response.message);
    } catch (error) {
      console.log("error during the file upload: ", error);
      alert(error.message);
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
