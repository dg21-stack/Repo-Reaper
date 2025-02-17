import { SigmaContainer, useLoadGraph } from '@react-sigma/core';
import '@react-sigma/core/lib/style.css';
import { MultiDirectedGraph } from 'graphology';
import { CSSProperties, FC, useEffect } from 'react';

const MyGraph: FC = () => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    // Create the graph
    const graph = new MultiDirectedGraph();
    graph.addNode('A', { x: 0, y: 0, label: 'commit hashdahaj', size: 10 });
    graph.addNode('B', { x: 0, y: 1, label: 'Commit #hashdaf', size: 10 });
    graph.addNode('C', { x: 1, y: 1, label: 'Commit #hasdhfasd', size: 10 });
    graph.addEdgeWithKey('rel1', 'A', 'B', { label: 'REL_1' });
    graph.addEdgeWithKey('rel2', 'A', 'C', { label: 'REL_2' });
    loadGraph(graph);
  }, [loadGraph]);

  return null;
};

export const LoadGraphWithHook: FC<{ style?: CSSProperties }> = ({ style }) => {
  return (
    <SigmaContainer style={style} >
      <MyGraph />
    </SigmaContainer>
  );
};