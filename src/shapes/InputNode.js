// CircleNode.js
import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { Box, Textarea } from "@chakra-ui/react";

function InputNode({ id, onDragStart, data }) {
  const [nodeName, setNodeName] = useState(data?.label || "");
  return (
    <>
      <div
        className="dndnode inputnode"
        onDragStart={(event) => onDragStart(event, "input")}
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
            placeholder="Label"
            position="absolute"
            left="40%"
            top="70%"
            transform="translate(-50%, -50%)"
            w={"80px"}
            wordwrap="break-word"
            zIndex="1000"
            wordBreak={"break-all"}
            isDisabled={!data?.editable}
            color={"black"}
            paddingTop={"2.8rem"}
            overflow={"hidden"}
          />
        </Box>
        {/* {data?.label} */}
      </div>
      <Handle type="source" position={Position.Left} id="2" />
      <Handle type="source" position={Position.Right} id="3" />
    </>
  );
}

export default InputNode;
