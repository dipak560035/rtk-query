// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import UpdatePost from "./UpdatePost";
// export const postApi = createApi({
// reducerPath:'postApi',
// baseQuery:fetchBaseQuery({baseUrl:'https://68d0be14e6c0cbeb39a25150.mockapi.io'}),

// endpoints:(builder) => ({

// getPosts:builder.query({
//     query:() => ({
//         url:'/posts',
//         method:'GET'
//     }),
//     providesTags : ['post']

// }),
//     createPost:builder.mutation({
//         query:(data) => ({
//             url:'/posts',
//             body:data,
//             method:'POST'
            
//         }),
//         invalidatesTags : ['post']
//     }),
//       removePost:builder.mutation({
//         query:(id) => ({
//             url:`/posts/${id}`,
//             method:'DELETE'
            
//         }),
//         invalidatesTags : ['post']

// }), 
//     updatePost: builder.mutation({
//       query: ({ id, data }) => ({
//         url: `/posts/${id}`,
//         body: data,
//         method: "PUT",
//       }),
//     invalidatesTags : ['post']
// })

// })
// })
// // export const {useGetPostsQuery,useGetPostsQuery,useCreatePostMutation,useRemovePostMutation,useUpdatePostMutation } = postApi;

// export const {
//   useGetPostsQuery,
//   useGetPostByIdQuery,
//   useCreatePostMutation,
//   useRemovePostMutation,
//   useUpdatePostMutation,
// } = postApi;














import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://68d0be14e6c0cbeb39a25150.mockapi.io",
  }),

  endpoints: (builder) => ({
    // 🔹 Get all posts
    getPosts: builder.query({
      query: () => ({
        url: "/posts",
        method: "GET",
      }),
      providesTags: ["post"],
    }),

    // 🔹 Get a single post by id
    getPostById: builder.query({
      query: (id) => `/posts/${id}`,
      providesTags: ["post"],
    }),

    // 🔹 Create a new post
    createPost: builder.mutation({
      query: (data) => ({
        url: "/posts",
        body: data,
        method: "POST",
      }),
      invalidatesTags: ["post"],
    }),

    // 🔹 Remove a post
    removePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["post"],
    }),

    // 🔹 Update a post
    updatePost: builder.mutation({
      query: ({ id, data }) => ({
        url: `/posts/${id}`,
        body: data,
        method: "PUT",
      }),
      invalidatesTags: ["post"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useRemovePostMutation,
  useUpdatePostMutation,
} = postApi;
