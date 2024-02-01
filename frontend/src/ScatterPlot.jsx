import React from 'react';
import Plot from 'react-plotly.js';
import './scatter.css'

const ScatterPlot = ({ data,val,setVal,ind }) => {
  const trace1 = {
    x: data.X,
    y: data.trueCurve.map(point => point.y),
    mode: 'lines',
    name: 'Curve',
    line: { dash: 'solid', color: 'blue' }
  };

  const trace2 = {
    x: data.X,
    y: data.syntheticData,
    mode: 'lines',
    name: 'Synthetic Data',
    marker: { color: 'orange', size: 8 }
  };

  const layout = {
    title: data.eqn,
    xaxis: { title: 'Feature (X)' },
    yaxis: { title: 'Target (y)' },
  };
  const handleInputChange=(event)=>{
    setVal((prev)=>{
        var arr=[...prev]
        arr[ind]=event.target.value
        if(arr[ind]<=5 && arr[ind]>=0)
            return arr
        return prev
    })
  }

  return (
    
    <div className="graph">
      <Plot
      data={[trace1, trace2]}
      layout={layout}
      />
      <input
        type="number"
        id="inputBox"
        value={val[ind]}
        onChange={handleInputChange}
        placeholder="Type something..."
      />
    </div>

  );
};

export default ScatterPlot;
