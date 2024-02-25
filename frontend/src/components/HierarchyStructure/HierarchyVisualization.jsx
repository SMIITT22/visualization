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

      const svgElement = d3
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
        .style("background", "white");

      // Define the pattern
      const defs = svgElement.append("defs");
      const pattern = defs
        .append("pattern")
        .attr("id", "square-grid-pattern")
        .attr("width", 10)
        .attr("height", 10)
        .attr("patternUnits", "userSpaceOnUse");

      pattern
        .append("line")
        .attr("x1", 0)
        .attr("y1", 5)
        .attr("x2", 10)
        .attr("y2", 5)
        .attr("stroke", "#a8b4c1")
        .attr("stroke-width", 1);

      pattern
        .append("line")
        .attr("x1", 5)
        .attr("y1", 0)
        .attr("x2", 5)
        .attr("y2", 10)
        .attr("stroke", "#a8b4c1")
        .attr("stroke-width", 1);

      // Apply the pattern as the background
      svgElement
        .append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "url(#square-grid-pattern)");

      const svg = svgElement
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      // Define the zoom behavior
      const zoom = d3
        .zoom()
        .scaleExtent([0.1, 10]) // Limits for zoom scale (min, max)
        .on("zoom", (event) => {
          svg.attr("transform", event.transform);
        });

      // Apply the zoom behavior to the svgElement
      svgElement.call(zoom);

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
        .attr("stroke-opacity", 1)
        .attr("stroke-width", 2)
        .selectAll("path")
        .data(root.links())
        .join("path")
        .attr("class", "link")
        .attr(
          "d",
          d3
            .linkHorizontal()
            .x((d) => d.y)
            .y((d) => d.x)
        );

      // Drag behavior
      const drag = d3
        .drag()
        .on("start", function (event, d) {
          d.offsetX = d.y - event.x;
          d.offsetY = d.x - event.y;
        })
        .on("drag", function (event, d) {
          const newX = event.y + d.offsetY;
          const newY = event.x + d.offsetX;
          d3.select(this).attr("transform", `translate(${newY},${newX})`);
          d.x = newX;
          d.y = newY;
          updateLinks(); // Function to update the links' positions
        })
        .on("end", function (event, d) {
          delete d.offsetX;
          delete d.offsetY;
        });

      nodes.call(drag);

      function updateLinks() {
        link.attr(
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
