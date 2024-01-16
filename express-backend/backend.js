import express from "express";
import cors from "cors";
import {
    getUsers,
    findUserByUsername,
    addUser
} from "./models/user-services.js";


const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/users/:user', (req, res) => {
    var token = null;
    const inputUser = req.body.username;
    const inputPassword = req.body.password;
    findUserByUsername(inputUser)
    .then((users) => {
        if(inputPassword === users[0].password) {
            console.log(users[0].password);
            token = {"token" : "2342f2f1d131rf12"};
            res.status(200).send(token);
        } else {
            res.status(400).send("Login Attempt Failed. Invalid username or password");
        }
    });
});

app.post('/users', (req, res) => {
    const userToAdd = req.body;
    const username = req.params['username'];
    const password = req.body.password;
    const password2 = req.body.password2;
    const phone = req.body.phone;
    if(password !== password2) {
        alert("Error: Passwords do not match")
        console.log("Error: Passwords do not match");
        res.status(400).send("Error: Passwords do not match");
    } else if (password.search(/[a-z]/) < 0 || password.search(/[A-Z]/) < 0 || password.search(/[0-9]/) < 0){
        alert("Error: Password must contain at least one lowercase letter, one uppercase letter and one number")
        console.log("Error: Password must contain at least one lowercase letter, one uppercase letter and one number");
        res.status(400).send("Error: Password must contain at least one lowercase letter, one uppercase letter and one number");
    } else {
        addUser({username: username, password: password, phone: phone})
        .then((response) => res.status(201).send(response))
        .catch(() => {
            console.log(res.status(400).send("Invalid Formatting"));
        });
    }
});

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