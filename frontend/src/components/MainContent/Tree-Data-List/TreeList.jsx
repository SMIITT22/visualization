import { useState, useEffect } from "react";
import "./TreeList.styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";

function TreeList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:3001/projects");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="tree-list-body">
      <div className="tree-list-innercontainer">
        <h2>Projects</h2>
        <ul>
          {projects.map((project, index) => (
            <li key={project._id}>
              <span className="project-index">{index + 1}. </span>
              <FontAwesomeIcon icon={faFile} className="file-icon" />
              {project.projectName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TreeList;
