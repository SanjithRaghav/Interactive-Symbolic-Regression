// ScatterPlot3D.js
import React from 'react';
import Plot from 'react-plotly.js';

const ScatterPlot3D = ({ data }) => {
  const trace1 = {
    x: data.X,
    y: data.Y,
    z: data.curve,
    type: 'surface',
    colorscale: 'Viridis',
    marker: { size: 4, color: 'orange' },
    name: 'Synthetic Data with Noise',
  };
 console.log(data.X,data.Y,data.curve)
  const trace2 = {
    x: data.X,
    y: data.Y,
    z: data.syntheticData,
    type: 'surface',
    colorscale: 'Greys',
    opacity: 0.8,
    name: 'Surface Curve',
  };

  const layout = {
    title: data.eqn,
    scene: {
      xaxis: { title: 'X Axis' },
      yaxis: { title: 'Y Axis' },
      zaxis: { title: 'Z Axis' },
    },
    width: window.innerWidth,
    height: window.innerHeight,
  };

  return (
    <Plot
      data={[trace1,trace2]}
      layout={layout}
      style={{ width: '100%', height: '100vh' }}
    />
  );
};

export default ScatterPlot3D;
