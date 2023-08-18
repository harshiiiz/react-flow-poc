
import React from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';



const GroupNode = () => {
  

  

  return (
    <>
     <NodeResizer minWidth={100} minHeight={30} />
    <Handle type="source" position={Position.Top} id='1'/>
    <Handle type="source" position={Position.Left} id='2'/>
    <Handle type="source" position={Position.Right} id='3'/>
    <Handle type="source" position={Position.Bottom} id='4'/>
    <div
      className="group-node"
     
      onDragOver={(event) => event.preventDefault()}
    >
      {/* ... (render child nodes) */}
    </div>
    </>
  );
};
export default GroupNode;
