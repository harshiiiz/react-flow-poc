import React, { useCallback, useEffect, useState, useRef } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  Panel,
  Background,
  MiniMap,
  Position,
} from "reactflow";

import "reactflow/dist/style.css";
import Sidebar from "./Sidebar.js";

import ContextMenu from "./ContextMenu";
import { initialNodes, initialEdges } from "./nodes-edges";
import CircleNode from "./shapes/CircleNode.js";
import PentagonNode from "./shapes/PentagonNode.js";
import DiamondNode from "./shapes/DiamondNode";
import { Button, Flex, Image, Heading } from "@chakra-ui/react";
import GroupNode from "./shapes/GroupNode.js";
import RectangleNode from "./shapes/RectangleNode";
import ParallelogramNode from "./shapes/ParallelogramNode";
import simplifyAndArrange from "./newjson.js";
import InputNode from "./shapes/InputNode.js";
import OutputNode from "./shapes/OutputNode.js";
import EdgeContextMenu from "./EdgeContextMenu";
import InvertedPentagonNode from "./shapes/InvertedPentagonNode.js";
import StraightPentagonNode from "./shapes/StraightPentagonNode.js";
import DownloadIcon from "./Images/DownloadIcon.js";
import GenerateIcon from "./Images/GenerateIcon.js";
import PlusIcon from "./Images/PlusIcon.js";
import Line from "./Images/Line.js";
const nodeTypes = {
  circle: CircleNode,
  pentagon: PentagonNode,
  diamond: DiamondNode,
  group: GroupNode,
  rectangle: RectangleNode,
  parallelogram: ParallelogramNode,
  input: InputNode,
  output: OutputNode,
  inverted_pentagon: InvertedPentagonNode,
  straight_pentagon: StraightPentagonNode,
};

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const reactFlowWrapper = useRef(null);
  const [menu, setMenu] = useState(null);
  const [edgemenu, setEdgeMenu] = useState(null);
  const lastNodePosition = useRef({ x: 0, y: 0 });
  let id = 0;
  const onConnect = useCallback(
    (params) => {
      const edgeWithArrow = {
        ...params,
        type: "step",
        markerEnd: { type: "arrowclosed", color: "black" },
        label: "Label",
        showLabel: false,
        labelPosition: {
          x: (params.sourceX + params.targetX) / 2,
          y: (params.sourceY + params.targetY) / 2,
        },
      };
      // Check if source and target nodes are groups
      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);
      if (
        sourceNode &&
        targetNode &&
        sourceNode.type === "group" &&
        targetNode.type === "group"
      ) {
        // When connecting two group nodes, set the parentGroup in the edge
        edgeWithArrow.data = {
          ...edgeWithArrow.data,
          parentNode: sourceNode.id,
        };
      }

      setEdges((eds) => addEdge(edgeWithArrow, eds));
    },
    [setEdges, nodes]
  );
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      const getId = () => `node_${+new Date()}`;
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // Check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Check if the dropped position is inside any existing group node
      let targetGroupNode = null;
      nodes.forEach((nds) => {
        if (nds.type === "group" && isPositionInsideNode(position, nds)) {
          targetGroupNode = nds;
        }
      });

      if (targetGroupNode) {
        // Node dropped inside an existing group node
        const newNode = {
          id: getId(),
          type,
          position,
          fontSize: 12,
          data: {
            label: type === "input" ? "input" : "title",
            editable: true,
          },
          style: {
            borderRadius: type === "circle" ? "50%" : "0",
            zIndex: 2000,
          },
          extent: "parent",
        };

        // Set the parent to the target group node and adjust position
        newNode.parentNode = targetGroupNode.id;
        newNode.position = {
          x: newNode.position.x - targetGroupNode.position.x,
          y: newNode.position.y - targetGroupNode.position.y,
        };

        setNodes((nds) => [...nds, newNode]);
      }
    },
    [reactFlowInstance, setNodes, nodes]
  );

  // Function to check if a position is inside a node
  function isPositionInsideNode(position, node) {
    return (
      position.x >= node.position.x &&
      position.x <= node.position.x + node.style.width &&
      position.y >= node.position.y &&
      position.y <= node.position.y + node.style.height
    );
  }

  const onNodeContextMenu = useCallback(
    (event, node) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = reactFlowWrapper.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width - 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
      });
    },
    [setMenu]
  );
  const onEdgeContextMenu = useCallback(
    (event, edge) => {
      // Prevent native context menu from showing
      event.preventDefault();
      const pane = reactFlowWrapper.current.getBoundingClientRect();

      // Show the context menu for the edge
      setEdgeMenu({
        id: edge.id,
        type: "edge",
        top: event.clientY - 20,
        left: event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
      });
    },
    [setEdgeMenu]
  );
  const onEdgeClick = useCallback(
    (event, edge) => {
      const updatedEdges = edges.map((e) =>
        e.id === edge.id ? { ...e, isEditingLabel: true } : e
      );
      setEdges(updatedEdges);
    },
    [edges, setEdges]
  );

  const onLabelInputChange = useCallback(
    (event, edge) => {
      const updatedEdges = edges.map((e) =>
        e.id === edge.id ? { ...e, label: event.target.value } : e
      );
      setEdges(updatedEdges);
    },
    [edges, setEdges]
  );

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => {
    setMenu(null);
    setEdgeMenu(null);
  }, [setMenu, setEdgeMenu]);

  useEffect(() => {
    console.log(nodes, edges);
  }, [nodes, edges]);

  // const handleDragEnd = useCallback(
  //   (event, node) => {
  //     let groupNode = node;

  //     if (node.type === "group") return;

  //     nodes.forEach((nds) => {
  //       if (nds.type === "group") {
  //         //checks if the position of the group node overlaps with the position of the current node.
  //         //If there is an overlap, it assigns the current group node to the groupNode variable.
  //         if (
  //           nds.position.x <= node.position.x &&
  //           nds.position.x + parseInt(nds.style?.width?.toString() || "0") >=
  //             node.position.x &&
  //           nds.position.y <= node.position.y &&
  //           nds.position.y + parseInt(nds.style?.height?.toString() || "0") >=
  //             node.position.y
  //         ) {
  //           groupNode = nds;
  //         }
  //       }
  //     });

  //     if (groupNode.id !== node.id) {
  //       setNodes((prevNodes) => {
  //         return prevNodes.map((nds) => {
  //           if (nds.id === node.id) {
  //             nds.parentNode = groupNode?.id;
  //             nds.position = {
  //               x: node.positionAbsolute?.x - groupNode.position.x,
  //               y: node.positionAbsolute?.y - groupNode.position.y,
  //             };
  //           }
  //           return nds;
  //         });
  //       });
  //     } else {
  //       setNodes((prevNodes) => {
  //         return prevNodes.map((nds) => {
  //           if (nds.id === node.id) {
  //             nds.parentNode = undefined;
  //             nds.position = node.positionAbsolute;
  //           }
  //           return nds;
  //         });
  //       });
  //     }
  //   },
  //   [nodes, setNodes]
  // );
  // const flowKey = "example-flow";
  // const onSave = useCallback(() => {
  //   console.log("save", reactFlowInstance);
  //   if (reactFlowInstance) {
  //     const flow = reactFlowInstance.toObject();
  //     console.log(flow, reactFlowInstance);
  //     localStorage.setItem(flowKey, JSON.stringify(flow));
  //   }
  // }, [reactFlowInstance]);
  // const onRestore = useCallback(() => {
  //   const restoreFlow = async () => {
  //     const flow = JSON.parse(localStorage.getItem(flowKey));
  //     console.log(flow);

  //     if (flow) {
  //       setNodes(flow.nodes || []);
  //       setEdges(flow.edges || []);
  //     }
  //   };

  //   restoreFlow();
  // }, [setNodes, setEdges]);

  const onDownloadJson = () => {
    const flow = reactFlowInstance.toObject();
    const simplifiedData = simplifyAndArrange(flow);
    console.log(flow, simplifiedData);
    const data = JSON.stringify(simplifiedData);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "newjson.json";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const addNode = useCallback(
    (type = "default", parentGroup) => {
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

      const position = reactFlowInstance?.project({
        x: reactFlowBounds.left + reactFlowBounds.width / 2,
        y: reactFlowBounds.top + reactFlowBounds.height / 2,
      });
      console.log(lastNodePosition, reactFlowBounds);
      lastNodePosition.current = position;
      setNodes((els) => {
        let newNode = {
          type,
          id: `node_${+new Date()}`,
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          editable: true,
          draggable: false,
          // position: position,
          position: {
            x: 10,
            y: lastNodePosition.current.y + 100,
          },
          data: {
            label: "Parent " + id,
          },
        };

        if (type === "group") {
          const lastGroupNode = els
            .filter((node) => node.type === "group")
            .reduce((prev, curr) =>
              curr.position.y > prev.position.y ? curr : prev
            );

          // Calculate the new position for the group node with a gap of 10px
          newNode.position.y =
            lastGroupNode.position.y + lastGroupNode.style.height + 40;

          Object.assign(newNode, {
            type,
            // data: { ...newNode.data, onResize: (size) => {
            //   // Update the size of the GroupNode here
            //   setNodes((prevNodes) => {
            //     return prevNodes.map((nds) => {
            //       if (nds.id === newNode.id) {
            //         nds.style = {
            //           ...nds.style,
            //           width: size.width,
            //           height: size.height,
            //         };
            //       }
            //       return nds;
            //     });
            //   });},
            // },
            style: {
              width: 1001,
              height: 326,
              border: "none",
              backgroundColor: "#F0EAFD",
            },
            parentNode: parentGroup,
          });

          lastNodePosition.current.x += 120;
          lastNodePosition.current.y += 100;
        }
        console.log(els);
        return [...els, newNode];
      });
    },

    [setNodes, reactFlowInstance, id]
  );
  const onDeleteEdge = (edgeId) => {
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== edgeId));
    setEdgeMenu(null); // Close the context menu
  };

  const defaultEdgeOptions = {
    zIndex: 10000,
  };
  return (
    <>
      <ReactFlowProvider>
        <div style={{ width: "100%", height: "100vh" }} ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeContextMenu={onNodeContextMenu}
            onPaneClick={onPaneClick}
            onEdgeClick={onEdgeClick}
            connectionMode="loose"
            defaultEdgeOptions={defaultEdgeOptions}
            elevateNodesOnSelect={true}
            onEdgeContextMenu={onEdgeContextMenu}
          >
            {edges.map((edge) => (
              <React.Fragment key={`label-${edge.id}`}>
                <div
                  onClick={(event) => {
                    onEdgeClick(event, edge);
                  }}
                  style={{
                    position: "absolute",
                    top: edge.labelPosition.y,
                    left: edge.labelPosition.x,
                    backgroundColor: "white",
                    padding: "4px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {edge.isEditingLabel ? (
                    <input
                      type="text"
                      value={edge.label}
                      onChange={(event) => onLabelInputChange(event, edge)}
                      onBlur={() => {
                        const updatedEdges = edges.map((e) =>
                          e.id === edge.id ? { ...e, isEditingLabel: false } : e
                        );
                        setEdges(updatedEdges);
                      }}
                      autoFocus
                      style={{
                        display: "block",
                        top: "500px", // Show input field when editing
                      }}
                    />
                  ) : (
                    // Conditional rendering of label text or input field
                    <span
                      onClick={(event) => {
                        onEdgeClick(event, edge);
                      }}
                      style={{
                        display: edge.showLabel ? "inline-block" : "none", // Hide when not editing
                      }}
                    >
                      {edge.label}
                    </span>
                  )}
                </div>
              </React.Fragment>
            ))}
            <Background />
            {menu && (
              <ContextMenu
                onClick={onPaneClick}
                onClose={() => setMenu(null)}
                {...menu}
              />
            )}
            {edgemenu && edgemenu.type === "edge" && (
              <EdgeContextMenu
                id={edgemenu.id}
                top={edgemenu.top}
                left={edgemenu.left}
                onDelete={() => onDeleteEdge(edgemenu.id)}
                onClose={() => setEdgeMenu(null)}
              />
            )}
            <MiniMap zoomable pannable />
            <Panel position="top-left">
              <Flex justifyContent={"space-between"} p={"12px"}>
                <Flex justifyContent={"center"} alignItems={"center"}>
                  <Image
                    w={"36px"}
                    h={"36px"}
                    src="https://bit.ly/dan-abramov"
                    alt="logo"
                  />
                  <Heading fontSize={"16px"} ml={"12px"} fontWeight={500}>
                    BLE Speaker
                  </Heading>
                  <Button
                    ml={"24px"}
                    bg={"#fff"}
                    border={"1px solid #D9D9D9"}
                    borderRadius={"4px"}
                  >
                    STM 4324324
                  </Button>
                </Flex>

                <Flex gap={2} justifyContent={"center"} alignItems={"center"}>
                  {/* <Button
                    className="draggable-button"
                    onClick={() => addNode("input")}
                    w={"100px"}
                  >
                    Switch
                  </Button>
                  <Button
                    className="draggable-button"
                    onClick={() => addNode("output")}
                    w={"100px"}
                  >
                    Led
                  </Button> */}
                  {/* <Button onClick={onSave} w={"100px"}>
                    save
                  </Button>
                  <Button onClick={onRestore} w={"100px"}>
                    restore
                  </Button> */}
                  <Button
                    leftIcon={<DownloadIcon />}
                    onClick={onDownloadJson}
                    p={"6px 12px 6px 8px"}
                    backgroundColor={"#DDD5ED"}
                    color={"#5906AF"}
                  >
                    DOWNLOAD JSON
                  </Button>
                  <Button
                    leftIcon={<GenerateIcon />}
                    color={"#fff"}
                    p={"6px 12px 6px 8px"}
                    backgroundColor={"#5906AF"}
                    fontSize={"14px"}
                  >
                    GENERATE FIRMWARE
                  </Button>
                  {/* <Button w={"150px"}>
                    <DownloadButton />{" "} 
                  </Button> */}
                </Flex>
              </Flex>
            </Panel>
            <Panel position="bottom-left">
              <Flex justifyContent={"center"} borderRadius={"12px"} p={"16px"}>
                <Sidebar />
                <Flex
                  justifyContent={"center"}
                  alignItems={"center"}
                  ml={"32px"}
                  gap={"32px"}
                >
                  <div w="1px" h="44px">
                    {" "}
                    <Line />
                  </div>
                  <Button
                    className="draggable-button"
                    onClick={() => addNode("group")}
                    p={"10px 16px 10px 12px"}
                    fontSize={"14px"}
                    color={"#5906AF"}
                    backgroundColor={"#DDD5ED"}
                    leftIcon={<PlusIcon />}
                  >
                    ADD FLOW
                  </Button>
                </Flex>
              </Flex>
            </Panel>
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </>
  );
}

export default Flow;
