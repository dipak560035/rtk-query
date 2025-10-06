// import { Form, Input } from "@heroui/react";
// import { Formik } from "formik";
// import { useLazySearchRecipeQuery } from "../recipes/recipeApi";
// import toast from "react-hot-toast";
// export default function Home() {
//   const [searchRecipe,{isLoading,error,data}] = useLazySearchRecipeQuery();
//   console.log(data);
//   return (
//     <div className="p-5">
//       <Formik 
//       initialValues={{
//         search : ''
//       }}
//       onSubmit={async(val, {resetForm} ) => {
//         try{
//             await searchRecipe (val.search)
//             resetForm();
//         } catch (err) {
//           toast.error(error.message)
//         }
//       }}
//       >
//         {({handleChange,handleSubmit,values,errors,touched})=>(
          
//           <Form 
//            onSubmit = {handleSubmit}
//           className="max-w-[400px]">
           
//             <Input 
//             name="search"
//             value={values.search}
//              onChange={handleChange}
//             placeholder="Search" />
           

//           </Form>
//         )}
//       </Formik>
//       {isLoading && <h1>Loading...</h1>}
//       {data && Array.isArray(data.recipe) && data.recipes.length > 0
//         ? data.recipe.map((recipes) => (
//             <div key={recipe.id}>
//               <h1>{recipe.name}</h1>
//               <img src={recipe.image} alt="" />
//             </div>
//           ))
//         : <h1>No recipes found</h1>
//       }
//     </div>
//   )
// }




import { Input, Button } from "@heroui/react";
import { Formik } from "formik";
import { useLazySearchRecipeQuery } from "../recipes/recipeApi";
import toast from "react-hot-toast";

export default function Home() {
  const [searchRecipe, { isLoading, error, data }] = useLazySearchRecipeQuery();

  return (
    <div className="p-5">
      <Formik
        initialValues={{ search: "" }}
        onSubmit={async (val) => {
          try {
            await searchRecipe(val.search).unwrap();
          } catch (err) {
            toast.error(err?.message || "Search failed");  
          }
        }}
      >
        {({ handleChange, handleSubmit, values }) => (
          <form
            onSubmit={handleSubmit}
            className="max-w-[400px] flex gap-2 items-center mb-5"
          >
            <Input
              name="search"
              value={values.search}
              onChange={handleChange}
              placeholder="Search recipes..."
            />
            <Button type="submit" isLoading={isLoading}>
              Search
            </Button>
          </form>
        )}
      </Formik>

      {isLoading && <h1>Loading...</h1>}

      {error && <h1 className="text-red-500">Error: {error.error}</h1>}

      {data?.recipes?.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {data.recipes.map((recipe) => (
            <div key={recipe.id} className="border p-3 rounded-lg shadow">
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-40 object-cover rounded-md"
              />
              <h2 className="font-semibold mt-2">{recipe.name}</h2>
            </div>
          ))}
        </div>
      ) : (
        data && <h1>No recipes found</h1>
      )}
    </div>
  );
}



















