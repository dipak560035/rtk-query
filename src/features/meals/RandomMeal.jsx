// import React from "react";
// import { useGetRandomMealQuery } from "./mealsApi";
// import { Button } from "@heroui/react";

// export default function RandomMeal() {
//   const { data, isLoading, error, refetch } = useGetRandomMealQuery(undefined, { skip: false });

//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Error fetching meal.</p>;

//   const meal = data.meals[0];

//   return (
//     <div style={{ padding: 20 }}>
//       <h1> Random Meal Generator</h1>
//       <div style={{ border: "1px solid #ccc", padding: 20, maxWidth: 500 }}>
//         <h2>{meal.strMeal}</h2>
//         <img src={meal.strMealThumb} alt={meal.strMeal} width="100%" />
//         <p><strong>Category:</strong> {meal.strCategory}</p>
//         <p><strong>Area:</strong> {meal.strArea}</p>
//         <h3>Instructions:</h3>
//         <p>{meal.strInstructions}</p>
//       </div>
//       <Button color="primary"
//         style={{ marginTop: 20, padding: "10px 20px" }}
//         onClick={() => refetch()}
//       >
//         Get Another Random Meal
//       </Button>
//     </div>
//   );
// }








import { useGetRandomMealQuery } from "./mealsApi";
import { Button } from "@heroui/react";

export default function RandomMeal() {
  const { data, isLoading, error, refetch } = useGetRandomMealQuery(undefined, { skip: false });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching meal.</p>;

  const meal = data.meals[0];

  // Extract ingredients dynamically
   const ingredients = [];
//   for (let i = 1; i <= 20; i++) {
//     const ingredient = meal[`strIngredient${i}`];
//     const measure = meal[`strMeasure${i}`];
//     if (ingredient) ingredients.push(`${ingredient} - ${measure}`);
//   }

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1 style={{ marginBottom: 20 }}> Random Meal Generator</h1>

      <div style={{ border: "1px solid #ccc", padding: 20, maxWidth: 600, width: "100%" }}>
        <h2>{meal.strMeal}</h2>
        <img src={meal.strMealThumb} alt={meal.strMeal} width="100%" style={{ borderRadius: 8, marginBottom: 10 }} />
        <p><strong>Category:</strong> {meal.strCategory}</p>
        <p><strong>Area:</strong> {meal.strArea}</p>

        <h3>Ingredients:</h3>
        {/* <ul style={{
          width: "100%",
          maxHeight: "200px",
          overflowY: "auto",
          border: "1px solid #eee",
          padding: 10,
          borderRadius: 5,
          backgroundColor: "#f9f9f9",
          listStyleType: "disc",
          marginBottom: 10
        }}>
          {ingredients.map((ing, idx) => (
            <li key={idx}>{ing}</li>
          ))}
        </ul> */}

        <h3>Instructions:</h3>
        <p style={{ textAlign: "justify" }}>{meal.strInstructions}</p>
      </div>

      <Button
        color="primary"
        style={{ marginTop: 20, padding: "10px 20px" }}
        onClick={() => refetch()}
      >
        Get Another Random Meal
      </Button>
    </div>
  );
}











