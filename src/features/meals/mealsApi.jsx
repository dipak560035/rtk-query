import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const mealsApi = createApi({
  reducerPath: 'mealsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://www.themealdb.com/api/json/v1/1/',
  }),
  endpoints: (builder) => ({
    getRandomMeal: builder.query({
      query: () => `random.php`,
    }),
  }),
});

export const { useGetRandomMealQuery } = mealsApi;
