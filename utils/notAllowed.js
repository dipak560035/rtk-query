export  const notAllowed = (req,res) => {
    return res.status(405).json({
      status:'Error',
      data:'method not allowed'
    })
  };