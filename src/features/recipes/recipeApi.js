import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const recipeApi = createApi({
    reducerPath : 'recipeApi',
    baseQuery : fetchBaseQuery({baseUrl:'https://dummyjson.com/recipes'}),
    endpoints :(builder) => ({

        searchRecipe : builder.query({
           query: (searchTerm)  => ({
            url: '/search',
            params : {
                q : searchTerm
            },
            method: 'GET'
           })
        })

    })
});
export const {useLazySearchRecipeQuery} = recipeApi;