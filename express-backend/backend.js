import express from "express";
import https from "https";
import fs from "fs";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import {
    getUsers,
    findUserByUsername,
    addUser,
    updateUser
} from "./models/user-services.js";

dotenv.config();

const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());

https.createServer(
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app
).listen(port, () => {
    console.log(`Example app listening at https://localhost:${port}`);
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});

/* User Login */
app.post('/users/:user', (req, res) => {
    const inputUser = req.body.username;
    const inputPassword = req.body.password;
    const token = jwt.sign({username: inputUser}, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
    findUserByUsername(inputUser)
    .then((users) => {
        if(inputPassword != undefined && inputPassword === users[0].password) {
            const updatedUser = {username: inputUser, password: inputPassword, phone: users[0].phone, token: token}
            updateUser(updatedUser)
            .then((resp) => {
                res.status(200).send({token: token});
            })
            .catch(() => {
                console.log("Updated user error");
                res.status(400).send("Updated user error")
            });
        } else {
            res.status(401).send("Login Attempt Failed. Invalid username or password");
        }
    })
    .catch(() => {
        console.log("Find user by username error");
        res.status(400).send("Find user by username error")
    });
});

/* User Registration */
app.post('/users', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
    const phone = req.body.phone;
    const token = jwt.sign({username: username}, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
    const user = {username: username, password: password, phone: phone, token: token};
    if(password != password2) {
        console.log("Error: Passwords do not match");
        res.status(403).send("Error: Passwords do not match");
    } else if (password.search(/[a-z]/) < 0 || password.search(/[A-Z]/) < 0 || password.search(/[0-9]/) < 0 || password.search(/[@$!%*?&]/) < 0){
        console.log("Error: Password must contain at least one lowercase letter, one uppercase letter, one number and one special character");
        res.status(403).send("Error: Password must contain at least one lowercase letter, one uppercase letter, one number and one special character");
    } else {
        addUser(user)
        .then((resp) => {
            res.status(200).send({token: token});
        })
        .catch(() => {
            console.log(res.status(400).send("Invalid credentials"));
        });
    }
});

app.get('/users', authenticateToken, async (req, res) => {
    const username = req.query.username;
    const phone = req.query.phone;
    getUsers(username, phone)
    .then((response) => {
        res.status(200).send(response);
    });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
      req.user = user;
      next();
    });
  }