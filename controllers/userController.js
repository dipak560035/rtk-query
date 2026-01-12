import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';





export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    return res.status(200).json({
      status: 'success',
      user
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
}

export const updateUser = async (req, res) => {
  const { email, username } = req.body ?? {};
  try {
    const isExist = await User.findById(req.userId);
    if (!isExist) return res.status(404).json({
      status: 'error',
      message: 'user doesn\'t exist'
    });

    isExist.username = username || isExist.username;
    isExist.email = email || isExist.email;
    await isExist.save();

    return res.status(200).json({
      status: 'success',
      message: 'profile updated successfully'
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
}



 export const loginUser = async (req, res) => {
  const { email, password,username} = req.body ?? {};

  try {
    // Check user exist by email OR username
    const isExist = email ? await User.findOne({ email }) : await User.findOne({ username });
    if (!isExist) return res.status(404).json({
      status: 'error',
      data: 'user doesn\'t exist'
    });

    // Check password
    const pass = bcrypt.compareSync(password,isExist.password);
   if (!pass) return res.status(400).json({
    status: 'error',
    data:'invalid credential'
   });

  const token = jwt.sign({
    id: isExist.id,
    role:isExist.role
  }, 'secret');
  return res.status(200).json({
    status: 'success',
    data: {
      token,
      role: isExist.role
    }
  });

  } catch (err) {
    return res.status(500).json({
      status: 'error',
      data: err.message
    });
  }
};



export const registerUser = async (req, res) => {
  const { email, password, username } = req.body ?? {};

  try {
    
   const hashPass = bcrypt.hashSync(password,10);
    await User.create({
      email,
      password:hashPass,
      username
    });

    return res.status(201).json({
      status: 'success',
      data: 'user registered successfully'
    });

  } catch (err) {
    return res.status(400).json({
      status: 'error',
      data: err.message
    });
  }
};
