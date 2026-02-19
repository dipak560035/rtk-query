// const mongoose = require('mongoose');

// const tokenSchema = new mongoose.Schema(
//     {
//         userId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User',
//             required: true,
//         },
//         token: {
//             type: String,
//             required: true,
//         },
//     },
//     {
//         timestamps: true,
//     }
// );

// const Token = mongoose.model('Token', tokenSchema);

// module.exports = Token;






const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Token",
  tableName: "tokens",

  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    token: {
      type: "varchar",
      nullable: false,
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
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: true,
      nullable: false,
      onDelete: "CASCADE",
    },
  },
});
