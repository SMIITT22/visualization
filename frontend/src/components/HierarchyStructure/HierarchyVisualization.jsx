import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./HierarchyStructure.styles.css";
import { useTreeData } from "../../context/TreeDataContext";

const HierarchyVisualization = () => {
  const { treeData } = useTreeData();

  const d3Container = useRef(null);

  useEffect(() => {
    if (treeData && d3Container.current) {
      const margin = { top: 20, right: 90, bottom: 30, left: 90 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      // Clear the container each time the data changes
      d3.select(d3Container.current).selectAll("*").remove();

      const svg = d3
        .select(d3Container.current)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr(
          "viewBox",
          `0 0 ${width + margin.left + margin.right} ${
            height + margin.top + margin.bottom
          }`
        )
        .style("background", "lightgrey")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      const root = d3.hierarchy(treeData, (d) => d.children);
      root.x0 = height / 2;
      root.y0 = 0;

      const treeLayout = d3.tree().size([height, width]);
      treeLayout(root);

      // Nodes
      const nodes = svg
        .selectAll(".node")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => "translate(" + d.y + "," + d.x + ")");

      nodes.append("circle").attr("r", 10).style("fill", "#555");

      nodes
        .append("text")
        .attr("dy", ".35em")
        .attr("x", (d) => (d.children ? -13 : 13))
        .style("text-anchor", (d) => (d.children ? "end" : "start"))
        .text((d) => d.data.name);

      // Links
      const link = svg
        .append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5)
        .selectAll()
        .data(root.links())
        .join("path")
        .attr(
          "d",
          d3
            .linkHorizontal()
            .x((d) => d.y)
            .y((d) => d.x)
        );

      // Drag behavior definition
      const drag = d3
        .drag()
        .on("start", function (event, d) {
          // Calculate the offset on drag start
          d.offsetX = d.y - event.x;
          d.offsetY = d.x - event.y;
        })
        .on("drag", function (event, d) {
          // Apply the offset to the new position to prevent the jump
          const newX = event.y + d.offsetY;
          const newY = event.x + d.offsetX;

          // Update the node's position
          d3.select(this).attr("transform", `translate(${newY},${newX})`);
          d.x = newX;
          d.y = newY;

          // Update links
          updateLinks();
        })
        .on("end", function (event, d) {
          // Remove the offset properties if you don't need them anymore
          delete d.offsetX;
          delete d.offsetY;
        });

      // Apply drag behavior to nodes
      nodes.call(drag);

      // Function to update links
      function updateLinks() {
        link
          .data(root.links())
          .join("path")
          .attr(
            "d",
            d3
              .linkHorizontal()
              .x((d) => d.y)
              .y((d) => d.x)
          );
      }
    }
  }, [treeData]); // Redraw tree when data changes

  return treeData ? (
    <div className="main-structure-body">
      <div className=".main-structure-body-text">
        <strong>Here is your tree structure</strong>
      </div>
      <div ref={d3Container}></div>
    </div>
  ) : (
    <div className="main-structure-empty-state">
      <div className="main-structure-text">
        <h4>No data available for visualization.</h4>
      </div>
    </div>
  );
};

export default HierarchyVisualization;
