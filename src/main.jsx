import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// font global pentru tot site-ul
import './styles/global.css'

// (opțional) restul stilurilor proiectului
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
