 import mongoose from "mongoose";



 const productSchema = new mongoose.Schema({
 title : {
    type : String,
    unique:true,
    required:true
 },
 detail:{
    type:String,
    required:true
 },
 price : {
    type: Number,
    required:true
 },
  Rating : {
    type: Number,
    required:false
 },
 
 image: {
   type: String,
   required: true
 },
 category : {
   type : String,
    enum: ['food','clothes','tech','jewelley'],
    required: true
 },
 brand : {
   type : String,
   enum: ['addidas','samsung','tanishq','kgc'],
    required: true
},
 }, { timestamps: true });

 const Product = mongoose.model('Product',productSchema);

 export default Product;