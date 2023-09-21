import React from "react";

import { Flex, Heading } from "@chakra-ui/react";
import ShapedNode from "./shapes/ShapedNode";
function Sidebar() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Flex gap={"30px"} justifyContent={"space-evenly"}>
      <Flex direction={"column"} gap={"6px"}>
        <ShapedNode onDragStart={onDragStart} shapeType="circle" />
        <Heading
          fontSize={"10px"}
          fontWeight={600}
          textAlign={"center"}
          fontFamily={"Inter"}
          textTransform={"uppercase"}
        >
          Trigger
        </Heading>
      </Flex>
      <Flex direction={"column"} gap={"6px"}>
        <ShapedNode onDragStart={onDragStart} shapeType="pentagon" />
        <Heading
          fontSize={"10px"}
          fontWeight={600}
          textAlign={"center"}
          fontFamily={"Inter"}
          textTransform={"uppercase"}
        >
          Delay
        </Heading>
      </Flex>
      <Flex direction={"column"} gap={"6px"}>
        <ShapedNode onDragStart={onDragStart} shapeType="rectangle" />
        <Heading
          fontSize={"10px"}
          fontWeight={600}
          textAlign={"center"}
          fontFamily={"Inter"}
          textTransform={"uppercase"}
        >
          Action
        </Heading>
      </Flex>
      <Flex direction={"column"} gap={"6px"}>
        <ShapedNode onDragStart={onDragStart} shapeType="diamond" />
        <Heading
          fontSize={"10px"}
          fontWeight={600}
          textAlign={"center"}
          fontFamily={"Inter"}
          textTransform={"uppercase"}
        >
          Decision
        </Heading>
      </Flex>
      <Flex direction={"column"} gap={"6px"}>
        <ShapedNode onDragStart={onDragStart} shapeType="inverted_pentagon" />
        <Heading
          fontSize={"10px"}
          fontWeight={600}
          textAlign={"center"}
          fontFamily={"Inter"}
          textTransform={"uppercase"}
        >
          Write
        </Heading>
      </Flex>
      <Flex direction={"column"} gap={"6px"}>
        <ShapedNode onDragStart={onDragStart} shapeType="straight_pentagon" />
        <Heading
          fontSize={"10px"}
          fontWeight={600}
          textAlign={"center"}
          fontFamily={"Inter"}
          textTransform={"uppercase"}
        >
          Read
        </Heading>
      </Flex>
      <Flex direction={"column"} gap={"6px"}>
        <ShapedNode onDragStart={onDragStart} shapeType="circle" />
        <Heading
          fontSize={"10px"}
          fontWeight={600}
          textAlign={"center"}
          fontFamily={"Inter"}
          textTransform={"uppercase"}
        >
          End
        </Heading>
      </Flex>
    </Flex>
  );
}

export default Sidebar;
