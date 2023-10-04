// EdgeContextMenu.js

import React from "react";
import { Button } from '@chakra-ui/react';
export default function EdgeContextMenu({ id,top, left, right, bottom, onDelete, ...props }) {
  return (
    <div style={{ top, left, right, bottom }} className={'edge-context-menu'} {...props}>
      <Button onClick={onDelete}>x</Button>
    </div>
  );
}


