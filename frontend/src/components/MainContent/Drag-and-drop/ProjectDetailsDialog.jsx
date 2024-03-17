import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

const ProjectDetailsDialog = ({ open, onClose, onSubmit }) => {
  const [projectName, setProjectName] = useState("");
  const [rootComponent, setRootComponent] = useState("");

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(projectName, rootComponent);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Enter Project Details</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="projectName"
          label="Project Name"
          type="text"
          fullWidth
          variant="outlined"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <TextField
          margin="dense"
          id="rootComponent"
          label="Root Component File Name"
          type="text"
          fullWidth
          variant="outlined"
          value={rootComponent}
          onChange={(e) => setRootComponent(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectDetailsDialog;
