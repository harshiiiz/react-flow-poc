import { Button, Flex } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useReactFlow } from 'reactflow';

export default function ContextMenu({ id, top, left, type, right, bottom, ...props }) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const duplicateNode = useCallback(() => {
    const node = getNode(id);
    const position = {
      x: node.position.x + 150,
      y: node.position.y + 50,
    };

    addNodes({ ...node, id: `${node.id}-copy`, position });
  }, [id, getNode, addNodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);

  return (
    <div style={{ top, left, right, bottom }} className="context-menu" {...props}>
      <Flex direction="column"  >
      <p style={{ margin: '0.5em' }}>
        <small>node: {id}</small>
      </p>
      <p>Display some info about {id}th node {type}</p>
      <Flex gap={'10px'}>  
      <Button w={"100px"} onClick={duplicateNode}> duplicate </Button>
      <Button w={"100px"} onClick={deleteNode}>delete</Button>
      </Flex>
      </Flex>
    </div>
  );
}
