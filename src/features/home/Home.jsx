import { Button, Input, Card, CardBody, CardHeader, Image } from "@heroui/react";
import { useLazyGetSearchFirstLetterQuery } from "../meals/meatApi";
import { useState } from "react";

export default function Home() {
  const [letter, setLetter] = useState("");
  const [searchMeals, { isLoading, error, data }] = useLazyGetSearchFirstLetterQuery();

  const handleSearch = () => {
    if (!letter) return alert("Please enter a letter (a-z)");
    searchMeals(letter);
  };

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-semibold"> Search Meals by First Letter</h1>

      <div className="flex gap-3 items-center">
        <Input
          label="Enter a letter"
          placeholder="e.g. a"
          value={letter}
          onChange={(e) => setLetter(e.target.value)}
          maxLength={1}
        />
        <Button color="primary" onPress={handleSearch}>
          Search
        </Button>
      </div>

      {isLoading && <h2>Loading meals...</h2>}
      {error && <h2>Error: {error.data}</h2>}

      {data?.meals && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
          {data.meals.map((meal) => (
            <Card key={meal.idMeal} className="shadow-lg">
              <CardHeader className="text-lg font-bold">{meal.strMeal}</CardHeader>
              <CardBody>
                <Image
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  width={250}
                  height={250}
                  className="rounded-lg"
                />
                <p className="mt-2 text-sm text-gray-600">
                  Category: {meal.strCategory || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Area: {meal.strArea || "N/A"}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && data?.meals === null && (
        <h2 className="text-red-500">No meals found for letter "{letter}"</h2>
      )}
    </div>
  );
}








// import { Button } from "@heroui/react";
// import { useGetCategoriesQuery, useGetFilterQuery, useGetMealByIdQuery, useGetSearchFirstLetterQuery } from "../meals/meatApi"


// export default function Home() {
//   const {isLoading,error,data,refetch} =useGetSearchFirstLetterQuery();
//   if(isLoading) return <h1>Loading.....</h1>
//   if(error)return <h1>{error.data}</h1>
//   console.log(data);
//   return (
//     <div>
//       <Button onPress={refetch}>Refectch</Button>
//     </div>
//   )
// }
