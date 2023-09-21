

export const initialNodes = [
  {
    id: "1",
    position: { x: 10, y: 70 },
    data: { label: "a" },
    editable: true,
    type: "group",
    style: {  width: 1001, height: 326, backgroundColor: "#F0EAFD", border:'none'},
    draggable:false,
    
  },
  // { id: '2', position: { x: 0, y: 250 }, data: { label: 'b' } },
  // { id: '3', position: { x: 175, y: 250 }, data: { label: 'c' } },
  // { id: '4', position: { x: 350, y: 250 }, data: { label: 'd' } },
];

export const initialEdges = [
  // {
  //   id: 'e1-2',
  //   source: '1',
  //   target: '2',
  // },
  // {
  //   id: 'e1-3',
  //   source: '1',
  //   target: '3',
  //   markerEnd: {
  //     type: MarkerType.ArrowClosed,
  //     width: 20,
  //     height: 20,
  //     color: '#FF0072',
  //   },
  //   style: {
  //     strokeWidth: 2,
  //     stroke: '#FF0072',
  //   },
  // },
  // {
  //   id: 'e1-4',
  //   source: '1',
  //   target: '4',
  // },
];

const exportedData = { initialNodes, initialEdges };

export default exportedData;
