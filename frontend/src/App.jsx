// App.js
import React from 'react';
import { useEffect,useState } from 'react';
import ScatterPlot from './ScatterPlot';
import './App.css'
import chunk from 'lodash/chunk'
const App = () => {
  const [val,setVal]=useState([])
  const [dispIndex,setDispIndex]=useState(0)
  const [population,setPopulation]=useState([])
  //[truecurve,syntheticdata]
  const getData=async ()=>{
    const res=await fetch("http://localhost:8000/gen")
    const data=await res.json()
    const pop=data.population.map((p,j)=>{
      const syntheticData=data.dataX.map((f,i)=>{
        return {x:f,y:data.dataY[i]}
      })
      const trueCurve=data.dataX.map((f,i)=>{
        return {x:f,y:p[i]}
      })
      return {eqn:data.expression[j],X:data.dataX,trueCurve,syntheticData:data.trueCurve}
    })

    setVal(data.population.map((i)=>(0)))
    setPopulation(pop)
    setDispIndex(0)
  }

  const postData=async()=>{
    const postData={"user_fitness":val}
    const res=await fetch("http://localhost:8000/exec",{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify(postData)
    })
    const data=await res.json()
    const pop=data.population.map((p,j)=>{
      const syntheticData=data.dataX.map((f,i)=>{
        return {x:f,y:data.dataY[i]}
      })
      const trueCurve=data.dataX.map((f,i)=>{
        return {x:f,y:p[i]}
      })
      return {eqn:data.expression[j],X:data.dataX,trueCurve,syntheticData:data.trueCurve}
    })

    setVal(data.population.map((i)=>(0)))
    setPopulation(pop)
    setDispIndex(0)
  }
  useEffect(()=>{
    getData()
  },[])

  const data=(chunk(
    population.map((d,i)=>{
        return (<ScatterPlot key={i} data={d} setVal={setVal} val={val} ind={i} />)
      })
    ,6)
  )
 const Next=()=>{
  if(dispIndex<data.length-1){
    setDispIndex((prev)=>(prev+1))
  }
  else{
    postData()
  }
 } 
 

  return (
    <div className="App">
      {data[dispIndex]}

      <button onClick={Next}>next</button>
    </div>
  );
};

export default App;
