import React, { useEffect, useState } from "react";
import axios from "axios"
const Fib = () => {
    const [values, setValues] = useState()
    const [index, setIndexes] = useState()
    const [valToCalc, setValToCalc] = useState()
    const fetchValue = async () => {
        const {data} = await axios.get("/api/values/current")
        console.log(data)
        setValues(data)
    }

    const fetchindexes = async () => {
        const {data} = await axios.get("/api/values/all")
        console.log(data)
        setIndexes(data)
    }
    
    const sendValues = async () => {
        await axios.post("/api/values", {index: valToCalc})
        console.log(data)
    }
    
    useEffect(() => {

        fetchValue()

        fetchindexes()

    },[])


    return (
        <>
            <div>

            <label> Index </label>
            <input onChange={(e) => setValToCalc(e.target.value)}/>
            <button onClick={sendValues}> Send value </button>
            </div>

            <h3> index I have seen </h3>
            {Array.isArray(index) && index.length > 0 && index.map((data, idx) => (
                <span key={idx}> {data} </span>
            ))}

            <h3> calculated Values </h3>
            {Array.isArray(values) && values.length > 0 && values.map((data, idx) => (
                <div key={idx}> {data} </div>
            ))}
        </>
    )
}

export default Fib;