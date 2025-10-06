
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HeroUIProvider } from '@heroui/react'
import { Provider } from 'react-redux'
import { store } from './app/store.js'
import { Toaster } from 'react-hot-toast'


createRoot(document.getElementById('root')).render(
  <HeroUIProvider>

    <Provider store = {store}>

 
  
    <App />
    <Toaster />

    </Provider>

     </HeroUIProvider>

)
