import React, { useCallback } from "react";
import "./FileDropZone.styles.css";
import { useDropzone } from "react-dropzone";
import { uploadFiles } from "../../../utils/uploadService";
import { useTreeData } from "../../../context/TreeDataContext";
const FileDropZone = () => {
  const { updateTreeData } = useTreeData();

  const onDrop = useCallback(
    async (acceptedFiles) => {
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
    },
    [updateTreeData]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noKeyboard: true,
  });
  return (
    <div className="main-dropzone-body">
      <div className="dropzone-upper-text">
        <p>
          Upload your folder by using the DropZone!
          <br />
          <strong>
            Make sure you upload src folder and your root component should be in
            index.js file.
          </strong>
        </p>
      </div>
      <div
        {...getRootProps()}
        className="dropzone"
      >
        <input {...getInputProps()} />
        <p>FileDropZone</p>
      </div>
    </div>
  );
};

export default FileDropZone;
