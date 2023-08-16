import React  from 'react';
import CircleNode from './shapes/CircleNode';
import {  Flex } from '@chakra-ui/react';
import PentagonNode from './shapes/PentagonNode';
import DiamondNode from './shapes/DiamondNode';

function Sidebar() {
  

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  
  

  return (
    <Flex direction="column">
      <div className="description">You can drag these nodes to the canvas downwards.</div>
      {/* <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'input')} draggable>
        Input Node
      </div> */}
      <Flex gap={'10px'}>
      <CircleNode onDragStart={onDragStart} />
      <PentagonNode onDragStart={onDragStart} />
      <DiamondNode onDragStart={onDragStart} />
      </Flex>
      

    </Flex>
  );
};

export default Sidebar;