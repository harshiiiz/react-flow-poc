import React, { useState } from "react";
import ReactFlow, { useReactFlow } from "reactflow";

const GroupNode = ({ id, data, setNodes }) => {
  const [nodes, setLocalNodes] = useState(data.nodes); // Local state for child nodes
  const { transform } = useReactFlow();

  

  

  return (
    <div
      className="group-node"
     
      onDragOver={(event) => event.preventDefault()}
    >
      {/* ... (render child nodes) */}
    </div>
  );
};
export default GroupNode;
