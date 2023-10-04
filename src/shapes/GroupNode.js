import { Box, Input } from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { NodeResizeControl, Handle, Position } from "reactflow";
const controlStyle = {
  background: "transparent",
  border: "none",
};

const GroupNode = ({ data }) => {
  const [nodeName, setNodeName] = useState(data?.label || "");
  const handleResize = useCallback(
    (width, height) => {
      const prevHeight = 326;
      const heightChange = height.height - prevHeight;
      data.onResize(height, heightChange);
      // console.log(height, prevHeight, heightChange,height.y);
      return heightChange;
    },
    [data]
  );

  return (
    <>
      <Box position="relative">
        <Input
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
          onBlur={() => {
            // Update the label in the data object when input loses focus
            data.label = nodeName;
          }}
          size="xs"
          variant="unstyled"
          placeholder="Flow Name"
          display={"flex"}
          fontFamily={"Gotham HTF Book"}
          justifyContent={"center"}
          w={"auto"}
          zIndex="1000"
          
          color={"black"}
          overflow={"hidden"}
        />
      </Box>
      <NodeResizeControl
        style={controlStyle}
        minWidth={100}
        minHeight={50}
        onResizeEnd={handleResize}
      >
        <ResizeIcon />
      </NodeResizeControl>
      <Handle type="source" position={Position.Right} id="1" />

      <Handle type="source" position={Position.Left} id="4" />
    </>
  );
};
function ResizeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="#9747FF"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ position: "absolute", right: 5, bottom: 5 }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <polyline points="16 20 20 20 20 16" />
      <line x1="14" y1="14" x2="20" y2="20" />
      <polyline points="8 4 4 4 4 8" />
      <line x1="4" y1="4" x2="10" y2="10" />
    </svg>
  );
}
export default GroupNode;
