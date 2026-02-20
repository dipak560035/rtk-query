// const User = require("../models/User");
// const Token = require("../models/Token");
// const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");

// const signup = async (userData) => {
//     const { name, email, password, profilePic } = userData;

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//         throw new Error("User already exists");
//     }

//     const user = await User.create({
//         name,
//         email,
//         password,
//         profilePic
//     });

//     const accessToken = generateAccessToken(user._id);
//     const refreshToken = generateRefreshToken(user._id);

//     await Token.create({ userId: user._id, token: refreshToken });

//     return { user, accessToken, refreshToken };
// };

// const signin = async (email, password) => {
//     const user = await User.findOne({ email });

//     if (!user || !(await user.matchPassword(password))) {
//         throw new Error("Invalid email or password");
//     }

//     const accessToken = generateAccessToken(user._id);
//     const refreshToken = generateRefreshToken(user._id);

//     // Save refreshToken in DB
//     await Token.findOneAndUpdate(
//         { userId: user._id },
//         { token: refreshToken },
//         { upsert: true, returnDocument: "after" }
//     );

//     return { user, accessToken, refreshToken };
// };

// const getUserById = async (userId) => {
//     const user = await User.findById(userId);
//     if (!user) {
//         throw new Error("User not found");
//     }
//     return user;
// };  
// module.exports = {
//     signup,
//     signin,
//     getUserById
// };



const bcrypt = require("bcryptjs");

const AppDataSource = require("../data-source"); //typeorm data source,db connection

const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");

const userRepo = () => AppDataSource.getRepository("User");

const tokenRepo = () => AppDataSource.getRepository("Token");
//database table handlers for User and Token entities


// SIGNUP
const signup = async (userData) => {
    const { name, email, password, profilePic } = userData;
    

    const userExists = await userRepo().findOne({
        where: { email }
    });
    // instead of SELECT * FROM User

    if (userExists) {
        throw new Error("User already exists");
    }

    // hash password manually 
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepo().save({
        name,
        email,
        password: hashedPassword,
        profilePic
        //INSERT INTO user ......
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await tokenRepo().save({
        token: refreshToken,
        user: user
    });

    return { user, accessToken, refreshToken };
};


// SIGNIN
const signin = async (email, password) => {

    const user = await userRepo().findOne({
        where: { email },
        relations: ["tokens"] 
    });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // mimic Mongo upsert
    let existingToken = await tokenRepo().findOne({
        where: { user: { id: user.id } },
        relations: ["user"]
    });

    if (existingToken) {
        existingToken.token = refreshToken;
        await tokenRepo().save(existingToken);
    } else {
        await tokenRepo().save({
            token: refreshToken,
            user: user
        });
    }

    return { user, accessToken, refreshToken };
};


// GET USER
const getUserById = async (userId) => {

    const user = await userRepo().findOne({
        where: { id: userId }
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};


module.exports = {
    signup,
    signin,
    getUserById
};
