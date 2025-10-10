import { BrowserRouter, Route, Routes } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import Home from "./features/home/Home";




export default function App() {
  return (
    <BrowserRouter>
    
  <Routes>
<Route 
path="/"
element={<RootLayout />}>
   <Route index element={<Home />} />

</Route>
</Routes>
    </BrowserRouter>
    
  
  
  
  )
}
