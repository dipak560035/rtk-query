import { createBrowserRouter, RouterProvider } from "react-router-dom"
import RootLayout from "./components/RootLayout"
import Home from "./features/home/Home"
import AddPost from "./features/posts/AddPost"
import UpdatePost from "./features/posts/UpdatePost"



export default function App() {
  const router = createBrowserRouter([

    {
      path: '/',
      element : <RootLayout />,
      children : [
        {
          index:true,
          element:<Home />
        },
        {
          path: '/add-post',
        element: <AddPost />
        },
         {
          path: "/update-post/:id", // 👈 route added
          element: <UpdatePost />,
        },
      ]
    }

  ])
  return <RouterProvider router={router} />
}
