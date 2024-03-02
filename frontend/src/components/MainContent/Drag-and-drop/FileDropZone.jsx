import React, { useCallback, useState } from "react";
import "./FileDropZone.styles.css";
import { useDropzone } from "react-dropzone";
import { uploadFiles } from "../../../utils/uploadService";
import { useTreeData } from "../../../context/TreeDataContext";

const FileDropZone = () => {
  const { updateTreeData } = useTreeData();
  const [rootComponentName, setRootComponentName] = useState("");

  const onDrop = useCallback(
    async (acceptedFiles) => {
      console.log("what we are uploading", acceptedFiles);
      const rootName = prompt(
        "Enter the root component file name, e.g., App.js:"
      );
      setRootComponentName(rootName);
      // Check if all files are within the 'src' directory
      const allFilesInSrc = acceptedFiles.every((file) =>
        file.path.includes("/src/")
      );

      if (!allFilesInSrc) {
        alert(
          "Please make sure all files are from the 'src' directory of your project."
        );
        return; // Exit the function if not all files are from 'src'
      }

      // Proceed with files only from the 'src' directory
      const filteredFiles = acceptedFiles.filter(
        (file) => !file.path.includes("/node_modules/")
      );

      try {
        const response = await uploadFiles(filteredFiles, rootName);
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
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>FileDropZone</p>
      </div>
    </div>
  );
};

export default FileDropZone;
