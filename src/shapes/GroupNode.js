
import React, { useEffect, useState, useRef } from 'react';
import { Handle, Position, useUpdateNodeInternals, NodeResizer } from 'reactflow';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';


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
