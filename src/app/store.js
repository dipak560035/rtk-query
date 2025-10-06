// import { configureStore } from "@reduxjs/toolkit";
// import { cocktailApi } from "../features/cocktails/cocktailApi";
// import { commentApi } from "../features/comments/CommentApi";
// export const store = configureStore({
//     reducer:{
//         [cocktailApi.reducerPath]: cocktailApi.reducer,
//         [commentApi.reducerPath]:commentApi.reducer
//     },

import { configureStore } from "@reduxjs/toolkit";
import { recipeApi } from "../features/recipes/recipeApi";


// //caching,invalidatin,polling

//       middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat([cocktailApi.middleware],[commentApi.middleware]),
// })




// import { configureStore } from "@reduxjs/toolkit";
// import { postApi } from "../features/posts/postApi";
// export const store = configureStore({
//     reducer:{
//         [postApi.reducerPath] : postApi.reducer
//     },
//     middleware:(getDefaultMiddleware) =>
//         getDefaultMiddleware().concat([
//             postApi.middleware ]),
// });




export const store = configureStore({
 reducer : {
    [recipeApi.reducerPath] : recipeApi.reducer
},
 //caching , invalidation, polling
 middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat([
        recipeApi.middleware
    ]),
});