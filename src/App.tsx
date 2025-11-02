// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import React from "react"
import ArtworksTable from "./ArtworksTable"
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import "primeicons/primeicons.css"

const App: React.FC =()=>{
return(
  <div className="App">
  <ArtworksTable/>
  </div>
)
}
export default App
