
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { HeroUIProvider } from '@heroui/react'
// import { Provider } from 'react-redux'
// import { store } from './app/store.js'
// import { Toaster } from 'react-hot-toast'


// createRoot(document.getElementById('root')).render(
//   <HeroUIProvider>

//     <Provider store = {store}>

 
  
//     <App />
//     <Toaster />

//     </Provider>

//      </HeroUIProvider>

// )











import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);















