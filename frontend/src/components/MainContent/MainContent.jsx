import React from "react";
import FileDropZone from "./Drag-and-drop/FileDropZone";
import HierarchyVisualization from "../HierarchyStructure/HierarchyVisualization";
import { TreeDataProvider } from "../../context/TreeDataContext";
import TreeList from "./Tree-Data-List/TreeList";
import "./MainContent.styles.css";

const MainContent = () => {
  return (
    <TreeDataProvider>
      <div>
        <div className="main-content-body">
          <FileDropZone />
          <TreeList />
        </div>
        <div className="main-tree-body">
          <HierarchyVisualization />
        </div>
      </div>
    </TreeDataProvider>
  );
};

export default MainContent;
