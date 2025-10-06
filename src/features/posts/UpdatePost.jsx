// import { Button, Form, Input, Textarea } from "@heroui/react";


// import { Formik } from "formik";



// import { useNavigate, useParams } from "react-router-dom";
// import { valSchema } from "./AddPost";
// import { useGetPostsQuery } from "./postApi";



// export default function UpdatePost() {
//     const {id} = useParams();
//     const{isLoading,error,data}=useGetPostsQuery(id);
//   const nav = useNavigate();
//   if(isLoading) return <h1>Loading....</h1>
//   if (error) return <h1 className="text-red-500">{error.data}</h1>
//   console.log(data);
  
//   return (
//     <div className="p-5">
//       <Formik
//       initialValues={{
//         title:'',
//         detail:'',
//         author:'',
//         image:''
//       }}



// onSubmit={async (val) => {
// //   try {
// //     const res = await AddPost(val).unwrap();
// //     console.log("✅ Success:", res);
// //     toast.success('Post Added Successfully');
// //     nav(-1);
// //   } catch (err) {
// //     console.log("❌ Error:", err);
// //     toast.error(err?.data || "Something went wrong");
// //   }
// }}

//       validationSchema={valSchema}
      

//       >
        
//         {({handleSubmit,handleChange,values,touched,errors}) =>(
//           <Form onSubmit={handleSubmit}
//           className="max-w-[500px] space-y-5 "
//           >
//   <div className="w-full">
//     <Input
//     validationBehavior="onChange"
   
//     className="w-full"
//    onChange={handleChange}
        
//    value={values.title}
        
//         label="TITLE"
//         labelPlacement="outside"
//         name="title"
//         placeholder="Enter title"
//         type="text"

//       />
//       {touched.title && errors.title && <p  className="text-red-500">
//         {errors.title}
//         </p>}
//   </div>

//    <div className="w-full">
//     <Textarea
//     validationBehavior="onChange"
//     validate={values => values.length >10 ? 'Must be 10 character or less': undefined}
//     className="w-full"
//    onChange={handleChange}
        
//    value={values.detail}
        
//         label="Detail"
//         labelPlacement="outside"
//         name="detail"
//         placeholder="Enter Detail"
//         type="text"

//       />
//       {touched.detail && errors.detail && <p  className="text-red-500">
//         {errors.detail}
//         </p>}
//   </div>

//    <div className="w-full">
//     <Input
//     validationBehavior="onChange"
   
//     className="w-full"
//    onChange={handleChange}
        
//    value={values.author}
        
//         label="Author"
//         labelPlacement="outside"
//         name="author"
//         placeholder="Enter author"
//         type="text"

//       />
//       {touched.author && errors.author && <p  className="text-red-500">
//         {errors.author}
//         </p>}
//   </div>

//    <div className="w-full">
//     <Input
//     validationBehavior="onChange"
   
//     className="w-full"
//    onChange={handleChange}
        
//    value={values.image}
        
//         label="Image"
//         labelPlacement="outside"
//         name="image"
//         placeholder="Enter image"
//         type="text"

//       />
//       {touched.image && errors.image && <p  className="text-red-500">
//         {errors.image}
//         </p>}
//   </div>
//       {/* <Button
//       isLoading={isLoading}
//       type="submit" color="primary">Submit</Button> */}
//           </Form>
//         )}
//       </Formik>
//     </div>
//   )
// }









import { Button, Form, Input, Textarea } from "@heroui/react";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { valSchema } from "./AddPost";
import { useGetPostByIdQuery, useUpdatePostMutation } from "./postApi";
import toast from "react-hot-toast";

export default function UpdatePost() {
  const { id } = useParams();
  const { isLoading, error, data } = useGetPostByIdQuery(id);
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const nav = useNavigate();

  if (isLoading) return <h1>Loading....</h1>;
  if (error) return <h1 className="text-red-500">{error.data}</h1>;

  return (
    <div className="p-5">
      <Formik
        initialValues={{
          title: data?.title || "",
          detail: data?.detail || "",
          author: data?.author || "",
          image: data?.image || "",
        }}
        enableReinitialize
        validationSchema={valSchema}
        onSubmit={async (values) => {
          try {
            await updatePost({ id, data: values }).unwrap();
            toast.success("Post Updated Successfully");
            nav(-1);
          } catch (err) {
            console.error("❌ Error:", err);
            toast.error(err?.data || "Something went wrong");
          }
        }}
      >
        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Form onSubmit={handleSubmit} className="max-w-[500px] space-y-5">
            {/* Title */}
            <Input
              name="title"
              label="Title"
              labelPlacement="outside"
              onChange={handleChange}
              value={values.title}
              placeholder="Enter title"
            />
            {touched.title && errors.title && (
              <p className="text-red-500">{errors.title}</p>
            )}

            {/* Detail */}
            <Textarea
              name="detail"
              label="Detail"
              labelPlacement="outside"
              onChange={handleChange}
              value={values.detail}
              placeholder="Enter detail"
            />
            {touched.detail && errors.detail && (
              <p className="text-red-500">{errors.detail}</p>
            )}

            {/* Author */}
            <Input
              name="author"
              label="Author"
              labelPlacement="outside"
              onChange={handleChange}
              value={values.author}
              placeholder="Enter author"
            />
            {touched.author && errors.author && (
              <p className="text-red-500">{errors.author}</p>
            )}

            {/* Image */}
            <Input
              name="image"
              label="Image"
              labelPlacement="outside"
              onChange={handleChange}
              value={values.image}
              placeholder="Enter image URL"
            />
            {touched.image && errors.image && (
              <p className="text-red-500">{errors.image}</p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              color="primary"
              isLoading={isUpdating}
            >
              Update Post
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
