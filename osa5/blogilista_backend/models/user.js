const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    minlength: [3, "Username should be minimum 3 characters"],
    required: [true, "Username is required"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

userSchema.set("toJSON", {
  versionKey: false,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.passwordHash;
  },
});

module.exports = mongoose.model("User", userSchema);
