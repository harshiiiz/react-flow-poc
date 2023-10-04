import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

import { Box,  Textarea } from '@chakra-ui/react';
function StraightPentagonNode({ id, onDragStart,data }) {
  const [nodeName, setNodeName] = useState(data?.label||"");
  return (
    <>
    <div className="dndnode straight_pentagon" onDragStart={(event) => onDragStart(event, 'pentagon')} draggable>
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
            display={"flex"}
            justifyContent={"center"}
           w={'auto'}
           wordwrap="break-word"
            zIndex="1000"
            wordBreak={"break-all"}
            isDisabled={!data?.editable}
            color={'white'}
           overflow={"hidden"}
           pt={"2.2rem"}
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

export default StraightPentagonNode;
