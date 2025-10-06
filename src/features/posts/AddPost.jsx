import { Button, Form, Input, Textarea } from "@heroui/react";


import { Formik } from "formik";
import * as Yup from 'yup';
import { useCreatePostMutation } from "./postApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const valSchema = Yup.object({
  title:Yup.string().required(),
   detail:Yup.string().required(),
    author:Yup.string().required(),
     image:Yup.string().url().required(),
})

export default function AddPost() {
  const nav = useNavigate();
  const [AddPost,{isLoading}] = useCreatePostMutation(); 
  return (
    <div className="p-5">
      <Formik
      initialValues={{
        title:'',
        detail:'',
        author:'',
        image:''
      }}
// onSubmit={async (val) => {
//   try {
//     // Call API (mutation hook from RTK Query most likely)
//     await AddPost(val).unwrap();

//     // If successful, show success toast
//     toast.success('Post Added Successfully');
//   } catch (err) {
//     // If error occurs, show error toast
//     toast.error(err.data);
//   }
// }}


onSubmit={async (val) => {
  try {
    const res = await AddPost(val).unwrap();
    console.log("✅ Success:", res);
    toast.success('Post Added Successfully');
    nav(-1);
  } catch (err) {
    console.log("❌ Error:", err);
    toast.error(err?.data || "Something went wrong");
  }
}}

      validationSchema={valSchema}
      

      >
        
        {({handleSubmit,handleChange,values,touched,errors}) =>(
          <Form onSubmit={handleSubmit}
          className="max-w-[500px] space-y-5 "
          >
  <div className="w-full">
    <Input
    validationBehavior="onChange"
   
    className="w-full"
   onChange={handleChange}
        
   value={values.title}
        
        label="TITLE"
        labelPlacement="outside"
        name="title"
        placeholder="Enter title"
        type="text"

      />
      {touched.title && errors.title && <p  className="text-red-500">
        {errors.title}
        </p>}
  </div>

   <div className="w-full">
    <Textarea
    validationBehavior="onChange"
    validate={values => values.length >10 ? 'Must be 10 character or less': undefined}
    className="w-full"
   onChange={handleChange}
        
   value={values.detail}
        
        label="Detail"
        labelPlacement="outside"
        name="detail"
        placeholder="Enter Detail"
        type="text"

      />
      {touched.detail && errors.detail && <p  className="text-red-500">
        {errors.detail}
        </p>}
  </div>

   <div className="w-full">
    <Input
    validationBehavior="onChange"
   
    className="w-full"
   onChange={handleChange}
        
   value={values.author}
        
        label="Author"
        labelPlacement="outside"
        name="author"
        placeholder="Enter author"
        type="text"

      />
      {touched.author && errors.author && <p  className="text-red-500">
        {errors.author}
        </p>}
  </div>

   <div className="w-full">
    <Input
    validationBehavior="onChange"
   
    className="w-full"
   onChange={handleChange}
        
   value={values.image}
        
        label="Image"
        labelPlacement="outside"
        name="image"
        placeholder="Enter image"
        type="text"

      />
      {touched.image && errors.image && <p  className="text-red-500">
        {errors.image}
        </p>}
  </div>
      <Button
      isLoading={isLoading}
      type="submit" color="primary">Submit</Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
