// CircleNode.js
import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { Box, Textarea } from "@chakra-ui/react";

function CircleNode({ id, onDragStart, data }) {
  const [nodeName, setNodeName] = useState(data?.label || "");
  return (
    <>
     
      <div
        className={`dndnode circle ${data?.editable ? "hoverable" : ""}`}
        onDragStart={(event) => onDragStart(event, "circle")}
        draggable
      >
       
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
            w={"auto"}
            wordwrap="break-word"
            zIndex="1000"
            wordBreak={"break-all"}
            isDisabled={!data?.editable}
            color={"white"}
           pt={"1.8rem"}
            overflow={"hidden"}
          />
        </Box>
        <div className="handle-wrapper">
          <Handle type="source" position={Position.Top} id="a" />
          <Handle type="source" position={Position.Left} id="b" />
          <Handle type="source" position={Position.Right} id="c" />
          <Handle type="source" position={Position.Bottom} id="d" />
        </div>
        {/* {data?.label} */}
      </div>
      
    </>
  );
}

export default CircleNode;
