import React from 'react';
import Plot from 'react-plotly.js';
import './scatter.css'
import { MathComponent } from "mathjax-react";

const ScatterPlot = ({data,val,setVal,ind,metrics}) => {
  var eqn=data.eqn.split('X')
  eqn=eqn.join('X_')
  const trace1 = {
    x: data.X,
    y: data.trueCurve.map(point => point.y),
    mode: 'lines',
    name: 'Evolved Candidate Exression',
    line: { dash: 'solid', color: 'blue' }
  };

  const trace2 = {
    x: data.X,
    y: data.tc,
    mode: 'lines',
    name: 'Generating Function',
    marker: { color: 'orange', size: 8 }
  };

  const layout = {
    title:{text:ind+1},
    width: 600,
    height: 400,
    xaxis: { title: 'Feature (X)' },
    yaxis: { title: 'Target (y)' },
  };
  const handleInputChange=(event)=>{
    setVal((prev)=>{
        var arr=[...prev]
        arr[ind]=event.target.value
        if(arr[ind]<=2 && arr[ind]>=0)
            return arr
        return prev
    })
  }
  return (
    
    <div className="graph">
      <div className="plot">
        <Plot
        
        style={{ display:"inline",margin:"0 auto"}} 
        data={[trace2, trace1]}
        layout={layout}
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
      {metrics  && <p>Simplicity: {data.simplicity} , RSquared: {data.rsquared}</p>}
    </div>

  );
};

export default ScatterPlot;
