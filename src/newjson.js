
 function simplifyAndArrange(json) {
    const nodeDict = {};
    const flows = {};
    const ungroupedNodes = [];
    console.log(json)

    for (const edge of json.edges) {
        const sourceNodeId = edge.source;
        const targetNodeId = edge.target;

        // Populate outgoing edges for the source node
        if (!nodeDict[sourceNodeId]) {
            nodeDict[sourceNodeId] = {
                id: sourceNodeId,
                label: findLabel(json.nodes, sourceNodeId),
                incomingEdges: [],
                outgoingEdges: [targetNodeId]
            };
        } else {
            nodeDict[sourceNodeId].outgoingEdges.push(targetNodeId);
        }

        // Populate incoming edges for the target node
        if (!nodeDict[targetNodeId]) {
            nodeDict[targetNodeId] = {
                id: targetNodeId,
                label: findLabel(json.nodes, targetNodeId),
                incomingEdges: [sourceNodeId],
                outgoingEdges: []
            };
        } else {
            nodeDict[targetNodeId].incomingEdges.push(sourceNodeId);
        }
    }

    // Group nodes into flows based on the parent node ID
    for (const nodeId in nodeDict) {
        const node = nodeDict[nodeId];
        const parentNodeId = json.nodes.find(n => n.id === nodeId)?.parentNode;

        if (parentNodeId) {
            if (!flows[parentNodeId]) {
                flows[parentNodeId] = {
                    flowId: parentNodeId,
                    nodes: []
                };
            }
            flows[parentNodeId].nodes.push(node);
        } else {
            ungroupedNodes.push(node); // Nodes with no parent are ungrouped
        }
    }

    // Sort flows based on the total outgoing edges in ascending order
    const sortedFlows = Object.values(flows).sort((flowA, flowB) => {
        const countA = flowA.nodes.reduce((total, node) => total + node.outgoingEdges.length, 0);
        const countB = flowB.nodes.reduce((total, node) => total + node.outgoingEdges.length, 0);
        return countA - countB;
    });
    
    ungroupedNodes.sort((nodeA, nodeB) => {
        const countA = nodeA.outgoingEdges.length;
        const countB = nodeB.outgoingEdges.length;
        return countA - countB;
    });

    // Sort nodes within each flow based on outgoing edges length
    for (const flow of sortedFlows) {
        flow.nodes.sort((a, b) => a.outgoingEdges.length - b.outgoingEdges.length);
    }
console.log(json,sortedFlows)
    return {
       
        flows: sortedFlows,
        ungroupedNodes
    };
}

function findLabel(nodes, nodeId) {
    for (const node of nodes) {
        if (node.id === nodeId) {
            return node.data.label;
        }
    }
    return "";
}


export default simplifyAndArrange