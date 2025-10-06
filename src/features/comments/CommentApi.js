import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const commentApi = createApi({
    reducerPath: 'commentApi',
    baseQuery: fetchBaseQuery({baseUrl:'https://dummyjson.com'}),


    endpoints: (builder) => ({

        getAllComments : builder.query({
            query:() => ({
                url:`/comments`,
                method: 'GET'
            })
        }),

        getComment : builder.query({
            query:(id) => ({
                url : `/comments/${id}`,
                method: 'GET'
            })
        })
    })

});

export const {useGetAllCommentsQuery,useGetCommentQuery} = commentApi