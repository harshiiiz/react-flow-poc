// CircleNode.js
import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Box,  Textarea } from '@chakra-ui/react';

function CircleNode({ id, onDragStart, data }) {
 
  const [nodeName, setNodeName] = useState(data?.label||"");
  return (
    <>
    <Handle type="target" position={Position.Left}  id='1'/>
    <Handle type="target" position={Position.Top}  id='2'/>
    <div className="dndnode circle" onDragStart={(event) => onDragStart(event, 'circle')} draggable>
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
            top="70%"
            transform="translate(-50%, -50%)"
           w={'80px'}
           wordwrap="break-word"
            zIndex="1000"
            wordBreak={"break-all"}
            isDisabled={!data?.editable}
            color={'white'}
            paddingTop={'1.8rem'}
          />
        </Box>
    {/* {data?.label} */}
    </div>
    <Handle type="source" position={Position.Right} id='3'/>
    <Handle type="source" position={Position.Bottom} id='4'/>
    
  </>
  );
}

export default CircleNode;
