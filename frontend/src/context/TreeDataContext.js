import React, { createContext, useContext, useState } from "react";

const TreeDataContext = createContext();

export const useTreeData = () => useContext(TreeDataContext);

export const TreeDataProvider = ({ children }) => {
  const [treeData, setTreeData] = useState(null);

  const updateTreeData = (newData) => {
    setTreeData(newData);
  };

  return (
    <TreeDataContext.Provider value={{ treeData, updateTreeData }}>
      {children}
    </TreeDataContext.Provider>
  );
};
