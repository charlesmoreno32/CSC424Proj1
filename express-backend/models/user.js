import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 2)
          throw new Error("Invalid password, must be at least 2 characters.");
      },
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    token: {
      type: String,
      required: true,
      trim: true,
    }
  },
  { collection: "users_list" },
);

const User = mongoose.model("User", UserSchema);
export default User;
