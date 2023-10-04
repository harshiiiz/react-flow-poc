import { handleGroupNodeResize } from "./utils.js";

export const initialNodes = [
  {
    id: "1",
    position: { x: 10, y: 70 },

    data: {
      onResize: (height, heightChange) =>
        handleGroupNodeResize(height, heightChange),
    },
    editable: true,
    type: "group",
    style: {
      width: 1001,
      height: 326,
      backgroundColor: "#F0EAFD",
      border: "none",
    },
    draggable: false,
  },
];

export const initialEdges = [
  // {
  //   id: 'e1-2',
  //   source: '1',
  //   target: '2',
  // },
];

const exportedData = { initialNodes, initialEdges };

export default exportedData;
