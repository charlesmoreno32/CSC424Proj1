import mongoose from "mongoose";
import userModel from "./user.js";
import dotenv from "dotenv";
import sanitizeHtml from "sanitize-html";

dotenv.config();

mongoose.set("debug", true);


mongoose.connect(
    process.env.MONGO_URI,
    {
      useNewUrlParser: true, //useFindAndModify: false,
      useUnifiedTopology: true,
    }
).catch((error) => console.log(error));

function getUsers(username, phone) {
    let promise;
    if (username) {
      promise = findUserByUsername(username);
    } else if (phone) {
      promise = findUserByPhone(phone);
    } else {
      promise = userModel.find();
    }
    return promise;
  }

function findUserByUsername(username) {
    return userModel.find({ username: username });
}

function findUserByPhone(phone) {
    return userModel.find({ phone: phone });
}

function addUser(user) {
  const newUser = {
    username: sanitizeHtml(user.username),
    password: sanitizeHtml(user.password),
    phone: sanitizeHtml(user.phone)
  };
  const userToAdd = new userModel(newUser);
  const promise = userToAdd.save();
  return promise;
}

export {
    getUsers,
    findUserByUsername,
    findUserByPhone,
    addUser
};
