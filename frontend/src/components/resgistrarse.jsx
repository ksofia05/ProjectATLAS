import { useEffect } from "react"
import React from 'react'

const resgistrarse = () => {
 useEffect(()=>{
    window.location.href = "http://127.0.0.1:8000/autenticacion/register/"
 })
}

export default resgistrarse
