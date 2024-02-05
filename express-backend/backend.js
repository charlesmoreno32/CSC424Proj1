import express from "express";
import https from "https";
import fs from "fs";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
/*import crypto from "crypto"*/

import {
    getUsers,
    findUserByUsername,
    findUserByToken,
    addUser,
    updateUser
} from "./models/user-services.js";

dotenv.config();

const app = express();
const port = 8000;
app.use(cors());
const sanitizeHtml = require('sanitize-html');
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

    if (typeof username !== 'string' || typeof password !== 'string' || typeof password2 !== 'string' || typeof phone !== 'string') {
        return res.status(400).send("Invalid data types");
    }

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
    const username = sanitizeHtml(req.query.username);
    const phone = sanitizeHtml(req.query.phone);
    getUsers(username, phone)
    .then((response) => {
        res.status(200).send(response);
    });
});

app.get('/cookie', authenticateToken, async (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    findUserByToken(token)
    .then((response) => {
        res.status(200).send(response);
    })
    .catch((error) => {
        console.error('Error in cookie get request', error);
        res.status(500).send("Internal error");
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