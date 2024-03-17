import { useState, useEffect } from "react";
import { useTreeData } from "../../../context/TreeDataContext";
import "./TreeList.styles.css";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";

function TreeList() {
  const [projects, setProjects] = useState([]);
  const { updateTreeData } = useTreeData();

  useEffect(() => {
    fetchProjects();
  }, [updateTreeData]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:3001/projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleProjectClick = async (projectId) => {
    console.log("clicked");
    try {
      // Fetch the project's tree data by projectId
      const response = await fetch(
        `http://localhost:3001/projects/${projectId}/tree`
      );
      const treeData = await response.json();
      console.log("clicked", treeData);
      updateTreeData(treeData.tree);
    } catch (error) {
      console.error("Error fetching tree data:", error);
    }
  };

  const deleteProject = async (projectId, event) => {
    event.stopPropagation(); // Prevent triggering click on the whole list item
    try {
      const response = await fetch(
        `http://localhost:3001/projects/${projectId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete the project");
      fetchProjects(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };
  return (
    <div className="tree-list-body">
      <div className="tree-list-innercontainer">
        <h2>Projects</h2>
        {projects.length > 0 ? (
          <ul>
            {projects.map((project, index) => (
              <li
                key={project._id}
                onClick={() => handleProjectClick(project._id)}
              >
                <span className="project-index">{index + 1}. </span>
                <InsertDriveFileIcon className="file-icon" />
                <span className="project-name">{project.projectName}</span>
                <DeleteIcon
                  className="delete-icon"
                  onClick={(event) => deleteProject(project._id, event)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-projects">You have no projects to see</div>
        )}
      </div>
    </div>
  );
}

export default TreeList;
