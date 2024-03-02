import React, { useCallback } from "react";
import "./FileDropZone.styles.css";
import { useDropzone } from "react-dropzone";
import { uploadZip } from "../../../utils/uploadService"; // This function needs to be implemented
import { useTreeData } from "../../../context/TreeDataContext";

const FileDropZone = () => {
  const { updateTreeData } = useTreeData();

  const onDrop = useCallback(
    async ([zipFile]) => {
      // Expecting a single zip file
      try {
        const formData = new FormData();
        formData.append("srcZip", zipFile); // Ensure this matches the backend field name

        const response = await uploadZip(formData); // Implement this function to send the formData
        updateTreeData(response.tree);
        alert(response.message);
      } catch (error) {
        console.error("error during the file upload: ", error);
        alert(error.message);
      }
    },
    [updateTreeData]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noKeyboard: true,
    multiple: false, // Ensure only a single file can be uploaded
    accept: "application/zip", // Correct MIME type for zip files
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
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>
          Drag 'n' drop your project zip file here, or click to select the file
        </p>
      </div>
    </div>
  );
};

export default FileDropZone;
