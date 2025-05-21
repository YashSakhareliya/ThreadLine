import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { Toaster } from "react-hot-toast";
import store from "./redux/store.js"

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <Provider store = {store}>
    <BrowserRouter>
        <App />
        <Toaster/>
      </BrowserRouter>
  </Provider>
    
  </StrictMode>,
)
