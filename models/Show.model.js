const { Schema, model } = require('mongoose');

const showSchema = new Schema(
  {
    name: {
        type: String
    },
    genre: {
        type: String
    },
    rating: {
        type: Number
    },
    synopsis: {
        type: String
    },
    img: {
        type: String 
    },
    owner: {
        type: Schema.Types.ObjectId, ref: "User"
    }
  },

  {
    timestamps: true
  }
);

module.exports = model('Show', showSchema);
