import React, { useState } from "react";
import { Handle, Position, NodeResizer } from "reactflow";

import { Box, Textarea } from "@chakra-ui/react";
function RectangleNode({ id, onDragStart, data }) {
  const [nodeName, setNodeName] = useState(data?.label || "");
  return (
    <>
      <div
        className={`dndnode rectangle ${data?.editable ? "hoverable" : ""}`}
        onDragStart={(event) => onDragStart(event, "rectangle")}
        draggable
      >
        <NodeResizer minWidth={100} minHeight={30} />
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
            placeholder="Label"
            justifyContent={"center"}
            display={"flex"}
            w={"auto"}
            wordwrap="break-word"
            zIndex="1000"
            wordBreak={"break-all"}
            isDisabled={!data?.editable}
            color={"white"}
             paddingTop={'2.5rem'}
            overflow={"hidden"}
          />
        </Box>
      
      <div className="handle-wrapper">
      <Handle type="source" position={Position.Top} id="1" />
      <Handle type="source" position={Position.Left} id="2" />
      <Handle type="source" position={Position.Right} id="3" />
      <Handle type="source" position={Position.Bottom} id="4" />
      </div>
      </div>
    </>
  );
}

export default RectangleNode;
