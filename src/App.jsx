// import { createBrowserRouter, RouterProvider } from "react-router-dom"
// import RootLayout from "./components/RootLayout"
// import Home from "./features/home/Home"




// export default function App() {
//   const router = createBrowserRouter([

//     {
//       path: '/',
//       element : <RootLayout />,
//       children : [
//         {
//           index:true,
//           element:<Home />
//         },
       
//       ]
//     }

//   ])
//   return <RouterProvider router={router} />
// }












import RandomMeal from "./features/meals/RandomMeal";

export default function App() {
  return (
    <div>
      <RandomMeal />
    </div>
  );
}






