import React from 'react';
import Plot from 'react-plotly.js';
import './scatter.css'
import { MathComponent } from "mathjax-react";

const ScatterPlot3D = ({data,val,setVal,ind }) => {
  var eqn=data.eqn.split('X')
  eqn=eqn.join('X_')
  const trace1 = {
    x: data.X,
    y: data.Y,
    z: data.curve,
    showscale:false,
    type: 'surface',
    colorscale: 'Viridis',
    marker: { size: 4, color: 'orange' },
    name: 'Synthetic Data with Noise',
  };
 console.log(data.curve)
  const trace2 = {
    x: data.X,
    y: data.Y,
    z: data.syntheticData,
    showscale:false,
    type: 'surface',
    colorscale: 'Greys',
    opacity: 0.8,
    name: 'Surface Curve',
  };

  const layout = {
    title:{text:ind+1},
    width: 500,
    height: 400,
    scene: {
      xaxis: { title: 'X Axis' },
      yaxis: { title: 'Y Axis' },
      zaxis: { title: 'Z Axis' },
    },
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
      <div className="plot">
      <Plot
      data={[trace1,trace2]}
      layout={layout}
      style={{ display:"inline",margin:"0 auto"}} 
      />
      </div>
      <div className='equation'>
       <MathComponent tex={eqn}  />
      </div>
      <input
        className='inputBox'
        type="number"
        id="inputBox"
        value={val[ind]}
        onChange={handleInputChange}
        placeholder="Type something..."
      />
    </div>
    
  );
};

export default ScatterPlot3D;
