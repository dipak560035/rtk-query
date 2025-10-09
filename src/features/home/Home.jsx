import { Button } from "@heroui/react";
import { useGetCategoriesQuery, useGetFilterQuery } from "../meals/meatApi"


export default function Home() {
  const {isLoading,error,data,refetch} =useGetFilterQuery('chicken');
  if(isLoading) return <h1>Loading.....</h1>
  if(error)return <h1>{error.data}</h1>
  console.log(data);
  return (
    <div>
      <Button onPress={refetch}>Refectch</Button>
    </div>
  )
}
