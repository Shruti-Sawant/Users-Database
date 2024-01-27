const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const path = require("path");
const methodOverride = require('method-override');
const { v4: uuidv4 } = require('uuid');

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: '@shruti89',
});

let getRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.userName(),
        faker.internet.email(),
        faker.internet.password(),
    ];
}

//placeholder
let q = "INSERT INTO student (id,username,email,password) VALUES ?";

let data = [];
// for(let i=0;i<100;i++){
//     data.push(getRandomUser());
// }

// try {
//     connection.query(q, [data], (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         // console.log(result.length);
//     })
// } catch (err) {
//     console.log(err);
// }

// connection.end();

app.get('/', (req, res) => {
    let q = `select count(*) from student`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            const users = result[0]["count(*)"];
            console.log(result[0]["count(*)"]);
            res.render("home.ejs", { users })
            // console.log(result.length);
        })
    } catch (err) {
        console.log(err);
        res.send("some error in db");
    }

});

//show route;
app.get('/user', (req, res) => {
    let q = `select * from student`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            // console.log(result);
            res.render("showuser.ejs", { result })
        })
    } catch (err) {
        console.log(err);
        res.send("some error in db");
    }

})

//edit route
app.get('/user/:id/edit', (req, res) => {
    let { id } = req.params;
    let q = `select * from student where id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            console.log(result);
            let user = result[0];
            res.render("edit.ejs", { user });
        })
    } catch (err) {
        console.log(err);
        res.send("some error in db");
    }
})

//update route
app.patch('/user/:id', (req, res) => {
    let { id } = req.params;
    let { password: formpassword, username: newUsername } = req.body;
    let q = `select * from student where id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            if (formpassword != user.password) {
                res.send("wrong password");
            } else {
                let q2 = `update student set username='${newUsername}' where id='${id}'`;
                connection.query(q2, (err, result) => {
                    if (err) throw err;
                    res.redirect('/user');
                });
            }

        })
    } catch (err) {
        console.log(err);
        res.send("some error in db");
    }

})

//take user info
app.get('/adduser', (req, res) => {
    let id = uuidv4();
    res.render("adduser.ejs", { id });
})

// add user
app.post('/adduser/:id', (req, res) => {
    let { username: newUsername, password: newuserpass, email: newuseremail } = req.body;
    // console.log(newUsername,newuseremail,newuserpass);

    let { id } = req.params;
    let newuser = [id, newUsername, newuseremail, newuserpass]
    data.push(newuser);
    console.log(newuser);
    try {
        connection.query(q, [data], (err, result) => {
            if (err) throw err;
            console.log(result);
            // console.log(result.length);
            res.redirect('/');
        })
    } catch (err) {
        console.log(err);
    }
})


app.get('/user/:id/deleteuser', (req, res) => {
    let {id}=req.params;
    res.render("deleteuser.ejs", { id });
});

//delete user
app.delete('/user/:id', (req, res) => {
    let { id } = req.params;
    let { password: userpassword, email: useremail } = req.body;
    let q = `select * from student where id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            console.log(result);
            // console.log(userpassword, useremail)
            let user = result[0];
             if (userpassword != user.password) {
                 res.send("wrong password");
             } else if(useremail!=user.email) {
                res.send("wrong email");
             }else{
                 let q2 = `delete from student where id='${id}'`;
                 connection.query(q2, (err, result) => {
                    if (err) throw err;
                     res.redirect('/user');
                 });
             }

        })
    } catch (err) {
        console.log(err);
        res.send("some error in db");
    }

})

app.listen("8080", () => {
    console.log("post is listening to port 8080");
});



