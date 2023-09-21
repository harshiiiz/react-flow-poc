import { Button, Flex } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useReactFlow } from 'reactflow';

export default function ContextMenu({ id, top, left, type, right, bottom, ...props }) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
 

  const duplicateNode = useCallback(() => {
    const node = getNode(id);
    const position = {
      x: node.position.x ,
      y: node.position.y +350,
    };

    addNodes({ ...node, id: `${node.id}-copy`, position });
  }, [id, getNode, addNodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);
console.log(top,left)

  return (
    <div style={{ top, left, right, bottom }} className="context-menu" {...props}>
     
      <Flex direction="column"  >
      <p style={{ margin: '0.5em' }}>
        <small>{id}</small>
      </p>
     
      
      <Button w={"100px"} onClick={duplicateNode}> duplicate </Button>
      <Button w={"100px"} onClick={deleteNode}>delete</Button>
      
      </Flex>
    </div>
  );
}
