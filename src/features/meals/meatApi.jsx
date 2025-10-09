
import {  createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const meatApi = createApi({
reducerPath : 'meatApi',
baseQuery : fetchBaseQuery({baseUrl:'https://www.themealdb.com/api/json/v1/1'}),

endpoints: (builder) =>({
    getCategories:builder.query({
        query:()=>({
            url:'/categories.php',
            method:"GET"
        })
    }),


    getFilter:builder.query({
        query:(category)=>({
            url:'/filter.php',
            params:{
                c:category
            }

        })
    }),
    getMealById:builder.query({
       query:(detail)=>({
        url:'/lookup.php',
        params:{
            i:detail
        }
       })
    })



})

});
export const {useGetCategoriesQuery,useGetFilterQuery,useGetMealByIdQuery}=meatApi;