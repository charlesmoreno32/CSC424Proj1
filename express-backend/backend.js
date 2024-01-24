import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import crypto from "crypto";
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


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/users/:user', (req, res) => {
    const token = jwt.sign(username, process.env.TOKEN_SECRET);
    const inputUser = req.body.username;
    const inputPassword = req.body.password;
    findUserByUsername(inputUser)
    .then((users) => {
        if(inputPassword != undefined && inputPassword === users[0].password) {
            const updatedUser = {username: inputUser, password: inputPassword, phone: users[0].phone, token: token}
            updateUser(updatedUser)
            .then((response => {
                res.status(200).send({token: token});
            }))
            .catch(() => {
                console.log(res.status(400).send("Invalid Formatting"));
            });
        } else {
            res.status(401).send("Login Attempt Failed. Invalid username or password");
        }
    });
});

app.post('/users', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
    const phone = req.body.phone;
    const token = jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
    const user = {username: username, password: password, phone: phone, token: token};
    console.log(token);
    if(password != password2) {
        console.log("Error: Passwords do not match");
        res.status(403).send("Error: Passwords do not match");
    } else if (password.search(/[a-z]/) < 0 || password.search(/[A-Z]/) < 0 || password.search(/[0-9]/) < 0 || password.search(/[@$!%*?&]/) < 0){
        console.log("Error: Password must contain at least one lowercase letter, one uppercase letter, one number and one special character");
        res.status(403).send("Error: Password must contain at least one lowercase letter, one uppercase letter, one number and one special character");
    } else {
        console.log(user);
        addUser(user)
        .then((response) => 
            {res.status(201).send({token: token})}
        )
        .catch(() => {
            console.log(res.status(400).send("Invalid Formatting"));
        });
    }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}

app.get('/users', (req, res) => {
    const username = req.query.username;
    const phone = req.query.phone;
    getUsers(username, phone).then((response) => {
        res.status(200).send(response);
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});