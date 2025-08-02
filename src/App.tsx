// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RoastingMachine from "./pages/RoastingBot";
import { Toaster } from "sonner";
import './App.css'

function App() {
  return (
    <Router>
       <Toaster />
      <Routes>
      <Route path="/" element={<RoastingMachine />} />    
      </Routes>
    </Router>

  );
}

export default App
