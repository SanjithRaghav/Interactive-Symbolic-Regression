// App.js
import React from 'react';
import { useEffect,useState } from 'react';
import ScatterPlot from './ScatterPlot';
import './App.css'
import chunk from 'lodash/chunk'
const App = () => {
  const [metrics,setMetrics]=useState(false)
  const [gen,setGen]=useState(0)
  const [val,setVal]=useState([])
  const [dispIndex,setDispIndex]=useState(0)
  const [population,setPopulation]=useState([])
  //[truecurve,syntheticdata]
  const getData=async ()=>{
    const res=await fetch("http://localhost:8000/gen")
    const data=await res.json()
    setGen(data.gen)
    const pop=data.population.map((p,j)=>{
      const syntheticData=data.dataX.map((f,i)=>{
        return {x:f,y:data.dataY[i]}
      })
      const trueCurve=data.dataX.map((f,i)=>{
        return {x:f,y:p[i]}
      })
      // return {eqn:data.expression[j],X:data.dataX,trueCurve,syntheticData:data.trueCurve,rsquared:data.rsquared[j],simplicity:data.simplicity[j]}
      return {eqn:data.expression[j],X:data.dataX,trueCurve,syntheticData:data.dataY,rsquared:data.rsquared[j],simplicity:data.simplicity[j],tc:data.trueCurve}

    })

    setVal(data.population.map((i)=>(0)))
    setPopulation(pop)
    setDispIndex(0)
  }
  const Extrapolate=async ()=>{
    const res=await fetch("http://localhost:8000/extrapolate")
    const data=await res.json()
    setGen(data.gen)
    const pop=data.population.map((p,j)=>{
      const syntheticData=data.dataX.map((f,i)=>{
        return {x:f,y:data.dataY[i]}
      })
      const trueCurve=data.dataX.map((f,i)=>{
        return {x:f,y:p[i]}
      })
      // return {eqn:data.expression[j],X:data.dataX,trueCurve,syntheticData:data.trueCurve,rsquared:data.rsquared[j],simplicity:data.simplicity[j]}
      return {eqn:data.expression[j],X:data.dataX,trueCurve,syntheticData:data.dataY,rsquared:data.rsquared[j],simplicity:data.simplicity[j],tc:data.trueCurve}
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
    setGen(data.gen)
    const pop=data.population.map((p,j)=>{
      const syntheticData=data.dataX.map((f,i)=>{
        return {x:f,y:data.dataY[i]}
      })
      const trueCurve=data.dataX.map((f,i)=>{
        return {x:f,y:p[i]}
      })
      // return {eqn:data.expression[j],X:data.dataX,trueCurve,syntheticData:data.trueCurve,rsquared:data.rsquared[j],simplicity:data.simplicity[j]}
      return {eqn:data.expression[j],X:data.dataX,trueCurve,syntheticData:data.dataY,rsquared:data.rsquared[j],simplicity:data.simplicity[j],tc:data.trueCurve}

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
        return (<ScatterPlot key={i} data={d} setVal={setVal} val={val} ind={i} metrics={metrics}/>)
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
 const Previous=()=>{
  setDispIndex((prev)=>{
    if(prev>0){
      return prev-1
    }
    return prev
  })
 }
 const handleToggle = () => {
  setMetrics((prev)=>(!prev));
};

  return (
    <div className="App">
      <h1 className='gen'>Gen:{gen}</h1>
      <div className='graphGrid'>
      {data[dispIndex]}
      </div>
      <div>
      <button className="submit" onClick={Previous}>previous</button>
      <button className="submit" onClick={Next}>next</button>
      <button className="submit" onClick={Extrapolate}>Extrapolate</button>
      <button className="submit" onClick={getData}>Normal Range</button>
      <button className="submit" onClick={handleToggle}>
        {metrics ? 'Metrincs : OFF' : 'Metrics: ON'}
      </button>
      </div>

    </div>
  );
};

export default App;
