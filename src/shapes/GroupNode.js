
import React from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';



const GroupNode = ({ children}) => {
  

  

  return (
    <>
     <NodeResizer minWidth={100} minHeight={30} />
    <Handle type="source" position={Position.Top} id='1'/>
    <Handle type="source" position={Position.Left} id='2'/>
    <Handle type="source" position={Position.Right} id='3'/>
    <Handle type="source" position={Position.Bottom} id='4'/>
   
    </>
  );
};
export default GroupNode;
