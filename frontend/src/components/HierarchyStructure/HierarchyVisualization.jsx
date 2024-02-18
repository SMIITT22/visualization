import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
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
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
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
      const links = svg
        .selectAll(".link")
        .data(root.links())
        .enter()
        .append("path")
        .attr("class", "link")
        .attr(
          "d",
          d3
            .linkHorizontal()
            .x((d) => d.y)
            .y((d) => d.x)
        );
    }
  }, [treeData]); // Redraw tree when data changes

  return <div ref={d3Container}></div>;
};

export default HierarchyVisualization;
