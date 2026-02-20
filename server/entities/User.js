
// const mongoose = require('mongoose');
// const bcrypt = require('../node_modules/bcryptjs/umd');

// const userSchema = mongoose.Schema(
//     {
//         name: {
//             type: String,
//             required: true,
//         },
//         email: {
//             type: String,
//             required: true,
//             unique: true,
//             lowercase: true,
//             trim: true,
//         },
//         password: {
//             type: String,
//             required: true,
//         },
//         profilePic: {
//             type: String,
//             default: "",
//         },
//         resetPasswordToken: String,
//         resetPasswordExpires: Date,
//     },
//     {
//         timestamps: true,
//     }
// );

// // Encrypt password using bcrypt
// userSchema.pre('save', async function () {
//     // Only hash password if modified
//     if (!this.isModified('password')) {
//         return;
//     }

//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
// });

// // Match user entered password to hashed password in database
// userSchema.methods.matchPassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

// const User = mongoose.model('User', userSchema);

// module.exports = User;




const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",

  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    name: {
      type: "varchar",
      nullable: false,
    },

    email: {
      type: "varchar",
      unique: true,
      nullable: false,
    },

    password: {
      type: "varchar",
      nullable: false,
    },

    profilePic: {
      type: "varchar",
      default: "",
    },

    resetPasswordToken: {
      type: "varchar",
      nullable: true,
    },

    resetPasswordExpires: {
      type: "timestamp",
      nullable: true,
    },

    createdAt: {
      type: "timestamp",
      createDate: true,
    },

    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },

  relations: {
    tokens: {
      type: "one-to-many",
      target: "Token",
      inverseSide: "user",
    },
  },
});
