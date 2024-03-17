import React, { useCallback, useState } from "react";
import "./FileDropZone.styles.css";
import { useDropzone } from "react-dropzone";
import { uploadZip } from "../../../utils/uploadService"; // This function needs to be implemented
import { useTreeData } from "../../../context/TreeDataContext";
import ProjectDetailsDialog from "./ProjectDetailsDialog";

const FileDropZone = () => {
  const { updateTreeData } = useTreeData();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = useCallback(([zipFile]) => {
    // Expecting a single zip file
    setSelectedFile(zipFile);
    setDialogOpen(true);
  }, []);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogSubmit = async (projectName, rootComponent) => {
    try {
      const formData = new FormData();
      formData.append("srcZip", selectedFile);
      formData.append("projectName", projectName);
      formData.append("rootComponent", rootComponent);

      const response = await uploadZip(formData);
      updateTreeData(response.tree);
      alert(response.message);
    } catch (error) {
      console.error("error during the file upload: ", error);
      alert(error.message);
    } finally {
      handleDialogClose();
    }
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noKeyboard: true,
    multiple: false,
    accept: "application/zip",
  });

  return (
    <div className="main-dropzone-body">
      <div className="dropzone-upper-text">
        <p>
          Upload your .zip folder by using the DropZone!
          <br />
          <strong>
            Make sure you upload .zip src folder and your root component should
            be in index.js file.
          </strong>
        </p>
      </div>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>
          Drag 'n' drop your project zip file here, or click to select the file
        </p>
      </div>
      <ProjectDetailsDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
      />
    </div>
  );
};

export default FileDropZone;
