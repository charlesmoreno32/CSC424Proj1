import express from "express";
import https from "https";
import fs from "fs";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
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

/************************* Google Auth *************************/

app.post("/request", async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://localhost:3000");
    res.header("Referrer-Policy", "no-referrer-when-downgrade"); // needed for http
    const redirectUrl = "https://127.0.0.1:8000/oath";
    const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirectUrl
  );

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/userinfo.profile openid",
    prompt: "consent",
  });
  console.log(authorizeUrl);
  res.send({ url: authorizeUrl });
});

async function getUserData(access_token) {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
    );
    const data = await response.json();
    console.log("data", data);
    return data
  }
  
app.get("/oath", async function (req, res, next) {
    const code = req.query.code;
    try {
        const redirectUrl = "https://127.0.0.1:8000/oath";
        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirectUrl
        );
        const result = await oAuth2Client.getToken(code);
        await oAuth2Client.setCredentials(result.tokens);
        const user = oAuth2Client.credentials;
        const data = await getUserData(user.access_token);
        console.log(user);

        // call your code to generate a new JWT from your backend, don't reuse Googles
        const token = jwt.sign({username: `${data.sub}${data.name}`}, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
        res.redirect(303, (`https://localhost:3000/landing?token=${token}`));
  
    } catch (err) {
        console.log("Error with signin with Google", err);
        res.redirect(303, "https://localhost:3000/");
    }
  
});

/************************* My Endpoints *************************/

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
    .catch((err) => {
        console.log(err);
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

app.get('/token', authenticateToken, async (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    findUserByToken(token)
    .then((response) => {
        res.status(200).send(response);
    })
    .catch((error) => {
        console.log(res.status(400).send(error));
    });
});

/* Authenticate Google Token*/
app.get('/token=:token', (req, res) => {
    const token = req.params['token'];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        req.user = user;
        res.status(200).send({token: token});
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