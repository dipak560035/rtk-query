// const setTokensCookies = (res, accessToken, refreshToken) => {
//     const isProduction = process.env.NODE_ENV === 'production';

//     // Access Token Cookie (Short lived)
//     if (accessToken) {
//         res.cookie('accessToken', accessToken, {
//             httpOnly: true,
//             secure: isProduction,
//             sameSite: isProduction ? 'strict' : 'lax',
//             maxAge: 5 * 60 * 1000, // 5 minutes
//         });
//     }

//     // Refresh Token Cookie (Long lived)
//     if (refreshToken) {
//         res.cookie('refreshToken', refreshToken, {
//             httpOnly: true,
//             secure: isProduction,
//             sameSite: isProduction ? 'strict' : 'lax',
//             maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//         });
//     }
// };

// const clearTokensCookies = (res) => {
//     const isProduction = process.env.NODE_ENV === 'production';
//     const cookieOptions = {
//         httpOnly: true,
//         secure: isProduction,
//         sameSite: isProduction ? 'strict' : 'lax',
//     };

//     res.clearCookie('accessToken', cookieOptions);
//     res.clearCookie('refreshToken', cookieOptions);
// };

// module.exports = { setTokensCookies, clearTokensCookies };











const setTokensCookies = (res, accessToken, refreshToken) => {
  if (accessToken) {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      maxAge: 5 * 60 * 1000, // 5 min
    });
  }

  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
};

const clearTokensCookies = (res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
};

module.exports = { setTokensCookies, clearTokensCookies };
