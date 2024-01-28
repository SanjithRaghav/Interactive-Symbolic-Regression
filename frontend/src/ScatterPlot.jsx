// ScatterPlot.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './scatter.css'

const ScatterPlot = ({ data,val,setVal,ind }) => {
  const svgRef = useRef();

  useEffect(() => {
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const width = 400
    const height =300

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scaleLinear().domain([0, 4 * Math.PI]).range([0, width]);
    const yScale = d3.scaleLinear().domain([-15, 15]).range([height, 0]);

    // Plot true curve
    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

    svg.append('path')
      .data([data.trueCurve])
      .attr('class', 'line')
      .attr('d', line)
      .style('stroke', 'blue')
      .style('stroke-dasharray', '5,5')
      .style('fill', 'none');

    // Plot synthetic data
    svg.selectAll('circle')
      .data(data.syntheticData)
      .enter().append('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 3) // Decreased circle radius
      .style('fill', 'orange')
      .style('opacity', 0.7);

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .call(d3.axisLeft(yScale));

  }, [data]);
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
    <div>
        <p className='title'>{data.eqn}</p>
        <svg className="graph" ref={svgRef}></svg>
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
