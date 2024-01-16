const cors = require("cors");
const express = require('express');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const users = {
    users_list: [
        {
            id: 1,
            username: "bj", 
            password: "pass424"
        }
    ]
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/users/:user', (req, res) => {
    const token = null;
    const user = req.body.username;
    const password = req.body.password;
    console.log(user)
    console.log(password)
    if(user === users.users_list[0].username && password === users.users_list[0].password) {
        setToken("2342f2f1d131rf12");
        res.status(200).send(token);
    } else {
        res.status(400).send("Login Attempt Failed. Invalid username or password")
    }

});

app.post('/users', (req, res) => {
    const userToAdd = req.body;
    const username = req.params['username'];
    const password = req.params['password'];
    const password2 = req.params['password2'];
    if(password !== password2) {
        console.log("Error: Passwords do not match")
    } else if (password.search(/[a-z]/) < 0){
        console.log("Error: Password must contain at least one lowercase letter")
    } else if (password.search(/[A-Z]/) < 0) {
        console.log("Error: Password must contain at least one uppercase letter")
    } else if (password.search(/[0-9]/) < 0) {
        console.log("Error: Password must contain at least one number")
    } else {
        console.log("Registration successful")
    }

});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});