
// import { Image } from '@heroui/react'
// import { useGetCocktailsQuery } from '../cocktails/cocktailApi'








// export default function Home() {
//   const { data, isLoading, error } = useGetCocktailsQuery()

//   if (isLoading) return <h1>Loading.... </h1>
//   if (error) return <h1 className="text-red-500">{error?.data?.message || "Something went wrong"}</h1>

//   console.log(data)

//   return (
//     <div className='grid grid-cols-4 gap-5 p-5'>
//       {data?.drinks?.map((item) => (
//         <div key={item.idDrink} className='space-y-4'>
//           <h1>{item.strDrink}</h1>
//           <Image
//             src={item.strDrinkThumb}
//             alt={item.strDrink}
//             width={200}
//             height={200}
//           />
//         </div>
//       ))}
//     </div>
//   )
// }






// import { useGetAllCommentsQuery, useGetCommentQuery } from "../comments/CommentApi"
// export default function Home() {
//   const {isLoading,error,data} = useGetAllCommentsQuery()
//   const {isLoading: isLoad,data:comment} = useGetCommentQuery(1)
//   console.log(comment)
  
//   if (isLoading) return <h1>Loading...</h1>
//   if (error) return <h1>{error.data}</h1>
//   return (
//     <div>

//       {data && data.comments.map((comment) =>{
//         return(
//           <div  key={comment.id} className="">
//             <h1>{comment.body}</h1>

//           </div>
//         )
//       })}

//     </div>
//   )
// }





// import { Button } from "@heroui/react"
// import { useLazyGetCocktailsQuery } from "../cocktails/cocktailApi"

// export default function Home() {
//   const [func,{isLoading,error,data}] = useLazyGetCocktailsQuery()
//   console.log(data,isLoading)
//   return (
//     <div>

//       <Button onPress={()=>func()}>click me</Button>

//     </div>
//   )
// }





// import { useAddTodoMutation } from "../todos/todoApi"
// export default function Home() {
//   const [addTodo,{isLoading}]=useAddTodoMutation()
//   return (
//     <div>

//     </div>
//   )
// }








// import CardSkeleton from "../../components/CardSkeleton"
// import { useGetPostsQuery } from "../posts/postApi"
// export default function Home() {
//   const {isLoading,error,data} = useGetPostsQuery()
//   console.log(data)
//   if (!isLoading) return 

//    <CardSkeleton />
  
  
//   if (error) return <h1 className="text-red-500">{error.data}</h1>
//   return (
//     <div>
    
//     </div>
//   )
// }





import CardSkeleton from "../../components/CardSkeleton"
import { useGetPostsQuery } from "../posts/postApi"
import {Card, CardHeader, CardBody, Image, Button, CardFooter} from "@heroui/react";
import RemovePost from "../posts/RemovePost";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const nav = useNavigate();
  const { isLoading, error, data } = useGetPostsQuery()
 

  if (isLoading) return <div className="p-5 grid grid-cols-4 gap-5">
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
  </div>

  if (error) return <h1 className="text-red-500">{error.data}</h1>

  return (
    <div className="p-5 grid grid-cols-4 gap-5">
      {data.map((post) => {
        return <Card className="py-4">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">{post.title}</p>
        <small className="text-default-500">{post.datail}</small>



        <h4 className="font-bold text-large">{post.author}</h4>



      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src={post.image}
          width={270}
        />
      </CardBody>
      <CardFooter>
        <div className="flex gap-4 items-center">

           <Button
           onPress={() => nav (`/update-post/${post.id}`)}
           isIconOnly aria-label="Take a photo" color="warning" variant="faded">
            <i class="fa-solid fa-pen-to-square"></i>
      </Button>
      
      <RemovePost id={post.id} />
     
    </div>
      </CardFooter>
    </Card>
      })}
    </div>

  )
}
























