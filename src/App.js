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
import TextUpdaterNode from "./TextUpdaterNode.js";
import "reactflow/dist/style.css";
import Sidebar from "./Sidebar.js";
import ResizableNodeSelected from "./ResizableNodeSelected";
import ColorSelectorNode from "./ColorSelectorNode";
import ContextMenu from "./ContextMenu";
import { initialNodes, initialEdges } from "./nodes-edges";
import CircleNode from "./shapes/CircleNode.js";
import PentagonNode from "./shapes/PentagonNode.js";
import DiamondNode from "./shapes/DiamondNode";
import {  Button, Flex,  Tooltip,  } from "@chakra-ui/react";
import GroupNode from "./shapes/GroupNode.js";
const nodeTypes = {
  textUpdater: TextUpdaterNode,
  ResizableNodeSelected,
  selectorNode: ColorSelectorNode,
  circle: CircleNode,
  pentagon: PentagonNode,
  diamond: DiamondNode,
  group: GroupNode,
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
        markerEnd: { type: "arrowclosed", color: "black" },
        label: "Label Text",
        showLabel: false,
        labelPosition: {
          x: (params.sourceX + params.targetX) / 2,
          y: (params.sourceY + params.targetY) / 2,
        },
      };

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
      const getId = () => `${id++}`;
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
      if (type === "circle") {
        newNode = {
          id: getId(),
          type: "circle", // Use the correct type based on your nodeTypes
          position,
          fontSize: 12,
          data: {
            label: "title",
            placeholder: "Enter Node Name",
            editable: true,
          },
          style: {
            borderRadius: "50%",
            // ... (other style properties)
          },
        };
      } else if (type === "rectangle") {
        newNode = {
          id: getId(),
          type: "rectangle", // Use the correct type based on your nodeTypes
          position,
          fontSize: 12,
          data: { label: "Rectangle node" },
          style: {
            // ... (style properties for rectangle)
          },
        };
      } else if (type === "pentagon") {
        newNode = {
          id: getId(),
          type: "pentagon", // Use the correct type based on your nodeTypes
          position,
          fontSize: 12,
          data: { label: "title", editable: true },
          style: {
            // ... (style properties for rectangle)
          },
        };
      } else if (type === "diamond") {
        newNode = {
          id: getId(),
          type: "diamond", // Use the correct type based on your nodeTypes
          position,
          fontSize: 12,
          data: { label: "title", editable: true },
          style: {
            // ... (style properties for rectangle)
          },
        };
      } else if (type === "group") {
        newNode = {
          id: getId(),
          type: "group", // Use the correct type based on your nodeTypes
          position,
          fontSize: 12,
          data: { label: "Group node", nodes: [], edges: [] },
          style: {
            // ... (style properties for rectangle)
          },
        };
      }
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance,setNodes,id]
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
    console.log(nodes, edges);
  }, [nodes, edges]);

  const handleDragEnd = useCallback(
    (event, node) => {
      let groupNode = node;

      if (node.type === "group") return;

      nodes.forEach((nds) => {
        if (nds.type === "group") {
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

  
  const addNode = useCallback(
    (type = "default") => {
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
          id: Math.floor(Math.random() * 100).toString(),
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          // position: position,
          position: {
            x: lastNodePosition.current.x,
            y: lastNodePosition.current.y,
          },
          data: {
            label: "Node " + lastNodePosition.current.y / 50,
            unit: "bla bla",
            type: "flow chart",
            description: "This node is auto generated.",
          },
        };
        if (type === "group") {
          Object.assign(newNode, {
            type,
            //data: { ...newNode.data, onResize: setHeightWithOfGroup(newNode.id) },
            style: {
              width: 500,
              height: 300,
            },
          });
          lastNodePosition.current.x += 120;
          lastNodePosition.current.y += 100;
        }
        return [...els, newNode];
      });
    },
    [setNodes, reactFlowInstance]
  );

  return (
    <>
      <div style={{ width: "100%", height: "75vh" }} ref={reactFlowWrapper}>
      <ReactFlowProvider>
      <Flex direction="column" >
              <Sidebar />
              <Tooltip label="Click me" aria-label="Click me tooltip">
              <Button
                
                className="draggable-button"
                onClick={() => addNode("group")}
                
                w={"100px"}
               
              >
                Group Node
              </Button>
              </Tooltip>
              {/* <button className="btn-add" onClick={onClick}>
              Add Node
            </button> */}
              {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
            </Flex>
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
        >
          {edges.map((edge) => (
            <React.Fragment key={`label-${edge.id}`}>
              <div
                onClick={(event) => {
                  event.stopPropagation();
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
                      event.stopPropagation();
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
            
          </Panel>
        </ReactFlow>
        
          
        </ReactFlowProvider>
      </div>
    </>
  );
}



export default Flow;
