// import jwt from 'jsonwebtoken';



// export const checkUser =(req, res, next) => {
//     const token = req.headers.authorization;
//     try {
//     const decode = jwt.verify(token,'secret');
//     req.userId = decode.id;
//     req.role = decode.role;
//     next();
        
//     } catch (err) {
//     return res.status(401).json ({
//     status: 'error',
//     message: err.message
//    });
//     }
   
// }


// export const checkAdmin = (req,res,next)=>{
//     if(req.role === 'admin') return next ();
//     return res.status(401).json({
//         status: 'error',
//         message : 'you are not authorised'
//     });
// }










import jwt from 'jsonwebtoken';

export const checkUser = (req, res, next) => {
    // console.log("Auth header:", req.headers.authorization);
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      status: 'error',
      message: 'No token provided'
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.userId = decode.id;
    req.role = decode.role;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
};

export const checkAdmin = (req, res, next) => {
  if (req.role === 'admin') return next();

  return res.status(403).json({
    status: 'error',
    message: 'You are not authorized'
  });
};
