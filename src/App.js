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
import { Button, Flex, Tooltip } from "@chakra-ui/react";
import GroupNode from "./shapes/GroupNode.js";
import RectangleNode from "./shapes/RectangleNode";
import ParallelogramNode from "./shapes/ParallelogramNode";
import simplifiedAndArranged, {simplifyAndArrange} from "./newjson.js";

const nodeTypes = {
  circle: CircleNode,
  pentagon: PentagonNode,
  diamond: DiamondNode,
  group: GroupNode,
  rectangle: RectangleNode,
  parallelogram: ParallelogramNode,
};

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const reactFlowWrapper = useRef(null);
  const [menu, setMenu] = useState(null);

  const lastNodePosition = useRef({ x: 0, y: 0 });
  let id = 0;
  const onConnect = useCallback(
    (params) => {
      const edgeWithArrow = {
        ...params,
        type: "step",
        markerEnd: { type: "arrowclosed", color: "black" },
        label: "Text",
        showLabel: false,
        labelPosition: {
          x: (params.sourceX + params.targetX) / 2,
          y: (params.sourceY + params.targetY) / 2,
        },
      };
      // Check if source and target nodes are groups
      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);
      console.log("yes", sourceNode, targetNode);
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
    [setEdges]
  );
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      const getId = () => `randomnode_${+new Date()}`;
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      let newNode;
      
      if (
        type === "circle" ||
        type === "rectangle" ||
        type === "pentagon" ||
        type === "diamond" ||
        type === "parallelogram"
      ) {
        // Create a regular node
        newNode = {
          id: getId(),
          type,
          position,
          fontSize: 12,
          data: {
            label: "title",
            placeholder: "Enter Node Name",
            editable: true,
          },
          style: {
            borderRadius: type === "circle" ? "50%" : "0",
            
          },
        };
      }

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes, id]
  );

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
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  useEffect(() => {
    console.log(nodes, edges, simplifiedAndArranged);
  }, [nodes, edges]);

  const handleDragEnd = useCallback(
    (event, node) => {
      let groupNode = node;

      if (node.type === "group") return;

      nodes.forEach((nds) => {
        if (nds.type === "group") {
          //checks if the position of the group node overlaps with the position of the current node. 
          //If there is an overlap, it assigns the current group node to the groupNode variable.
          if (
            nds.position.x <= node.position.x &&
            nds.position.x + parseInt(nds.style?.width?.toString() || "0") >=
              node.position.x &&
            nds.position.y <= node.position.y &&
            nds.position.y + parseInt(nds.style?.height?.toString() || "0") >=
              node.position.y
          ) {
            groupNode = nds;
          }
        }
      });

      if (groupNode.id !== node.id) {
        setNodes((prevNodes) => {
          return prevNodes.map((nds) => {
            if (nds.id === node.id) {
              nds.parentNode = groupNode?.id;
              nds.position = {
                x: node.positionAbsolute?.x - groupNode.position.x,
                y: node.positionAbsolute?.y - groupNode.position.y,
              };
            
            }
            return nds;
          });
        });
      } else {
        setNodes((prevNodes) => {
          return prevNodes.map((nds) => {
            if (nds.id === node.id) {
              nds.parentNode = undefined;
              nds.position = node.positionAbsolute;
            
            }
            return nds;
          });
        });
      }
    },
    [nodes, setNodes]
  );
  const flowKey = "example-flow";
  const onSave = useCallback(() => {
    console.log("save", reactFlowInstance);
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      console.log(flow, reactFlowInstance);
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [reactFlowInstance]);
  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));
      console.log(flow);

      if (flow) {
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
      }
    };

    restoreFlow();
  }, [setNodes, setEdges]);

  const onDownloadJson = () => {
    const flow = reactFlowInstance.toObject();
    const simplifiedData = simplifyAndArrange(flow);
    console.log(flow)
    const data = JSON.stringify(simplifiedAndArranged);
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
      lastNodePosition.current = position;
      console.log(reactFlowInstance?.getViewport(), lastNodePosition.current);

      setNodes((els) => {
        let newNode = {
          type,
          id: `randomnode_${+new Date()}`,
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          editable: true,
          // position: position,
          position: {
            x: lastNodePosition.current.x,
            y: lastNodePosition.current.y,
          },
          data: {
            label: "Parent " + id,
          },
        };
        if (type === "group") {
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
              width: 500,
              height: 300,
              zIndex: 10
            },
            parentNode: parentGroup,
          });
          lastNodePosition.current.x += 120;
          lastNodePosition.current.y += 100;
        }
        return [...els, newNode];
      });
    },
    [setNodes, reactFlowInstance]
  );
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
            onNodeDoubleClick={onNodeContextMenu}
            onPaneClick={onPaneClick}
            onEdgeClick={onEdgeClick}
            onNodeDragStop={handleDragEnd}
            connectionMode="loose"
            defaultEdgeOptions={defaultEdgeOptions}
            elevateNodesOnSelect={true}
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
                        display: "block", // Show input field when editing
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
            <MiniMap />
            <Panel>
              <Flex direction="column" gap={2}>
                <Sidebar />
                <Flex gap={2}>
                  <Tooltip label="Click me" aria-label="Click me tooltip">
                    <Button
                      className="draggable-button"
                      onClick={() => addNode("group")}
                      w={"100px"}
                    >
                      Group Node
                    </Button>
                  </Tooltip>

                  <Button onClick={onSave} w={"100px"}>
                    save
                  </Button>
                  <Button onClick={onRestore} w={"100px"}>
                    restore
                  </Button>
                  <Button onClick={onDownloadJson} w={"150px"}>
                    Download JSON
                  </Button>
                </Flex>
                {/* <button className="btn-add" onClick={onClick}>
              Add Node
            </button> */}
                {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
              </Flex>
            </Panel>
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </>
  );
}

export default Flow;
