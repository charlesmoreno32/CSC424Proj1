import mongoose from "mongoose";
import userModel from "./user.js";
import dotenv from "dotenv";
import sanitizeHtml from "sanitize-html";

dotenv.config();

mongoose.set("debug", true);


mongoose.connect(
    "" + process.env.MONGO_URI
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

async function addUser(user) {
  try {
    if (await findUserByUsername(user.username)) return false;
    const userToAdd = new userModel(user);
    const savedUser = await userToAdd.save();
    return savedUser;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function updateUser(user) {
  try {
    if (await findUserByUsername(user.username)) return true;
    const updateDoc = {
      $set: {
        token: `${user.token}`
      }
    };
    const result = await userModel.updateOne({username: user.username}, updateDoc);
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export {
    getUsers,
    findUserByUsername,
    findUserByPhone,
    addUser,
    updateUser
};
