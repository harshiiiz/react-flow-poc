import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

import { Box,  Textarea } from '@chakra-ui/react';
function ParallelogramNode({ id, onDragStart,data }) {
  const [nodeName, setNodeName] = useState(data?.label||"");
  return (
    <>
    <div className="dndnode parallelogram" onDragStart={(event) => onDragStart(event, 'parallelogram')} draggable>
    <Box position="relative">
          <Textarea
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            onBlur={() => {
              // Update the label in the data object when input loses focus
              data.label = nodeName;
            }}
            size="xs"
            variant="unstyled"
            textAlign="center"
            position="absolute"
            left="50%"
            top="120%"
            transform="translate(-50%, -50%)"
           w={'80px'}
           wordwrap="break-word"
            zIndex="1000"
            wordBreak={"break-all"}
            isDisabled={!data?.editable}
            color={'white'}
            paddingTop={'6rem'}
          />
        </Box>
      
    </div>
    <Handle type="source" position={Position.Top} id='1'/>
    <Handle type="source" position={Position.Left} id='2'/>
    <Handle type="source" position={Position.Right} id='3'/>
    <Handle type="source" position={Position.Bottom} id='4'/>
    </>
  );
}

export default ParallelogramNode;
