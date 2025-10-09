import { useGetCategoriesQuery } from "../meals/meatApi"


export default function Home() {
  const {isLoading,error,data} =useGetCategoriesQuery();
  if(isLoading) return <h1>Loading.....</h1>
  if(error)return <h1>{error.data}</h1>
  console.log(data);
  return (
    <div></div>
  )
}
