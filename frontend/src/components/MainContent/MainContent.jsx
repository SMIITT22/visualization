import React from "react";
import FileDropZone from "./Drag-and-drop/FileDropZone";
import HierarchyVisualization from "../HierarchyStructure/HierarchyVisualization";
import { TreeDataProvider } from "../../context/TreeDataContext";

const MainContent = () => {
  return (
    <TreeDataProvider>
      <div>
        FileDropZone
        <FileDropZone />
        Tree
        <HierarchyVisualization />
      </div>
    </TreeDataProvider>
  );
};

export default MainContent;
