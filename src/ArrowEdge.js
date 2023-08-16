// ArrowEdge.js
import React from "react";
import { getBezierPath } from "reactflow";

const ArrowMarker = ({ id }) => (
  <marker
    id={id}
    markerWidth="10"
    markerHeight="10"
    refX="9"
    refY="5"
    orient="auto"
    markerUnits="userSpaceOnUse"
  >
    <path d="M0,0 L0,10 L10,5 z" fill="#ccc" />
  </marker>
);

const ArrowEdge = ({ id, sourceX, sourceY, targetX, targetY, style = {} }) => {
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const markerEnd = `url(#arrow-marker-${id})`;

  return (
    <>
      <defs>
        <ArrowMarker id={`arrow-marker-${id}`} />
      </defs>
      <path
        style={style}
        className="animated"
        d={edgePath}
        markerEnd={markerEnd}
      />
    </>
  );
};

export default ArrowEdge;
