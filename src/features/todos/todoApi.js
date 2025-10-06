import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";







export const todoApi=createApi({
    reducerPath:'todoApi',
    baseQuery:fetchBaseQuery({
        baseUrl:'https:dummyjson.com'
    }),


    endpoints:(builder) =>({

        addTodo : builder.mutation({
            query:(todo) =>({
                url : '/todos/add',
                method: 'POST',
                body:todo
            })
        })


    })
});
export const {useAddTodoMutation}=todoApi