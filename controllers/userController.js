import User from "../models/User.js";


export const loginUser = (req, res) => {
  res.status(200).json({
    message: 'Login route working ✅',
  });
};

export const registerUser = async (req, res) => {
  const {email,password,username} = req.body ?? {};
try {
  await User.create({
    email,
    password,
    username,
  });
  
} catch (err) {
  return res.status(400).json({
    status:'error',
    data:err.message
  });
  
}
};
