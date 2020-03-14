const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
const users = require("./routes/users");
const tweets = require("./routes/tweets");


mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log("connected to mongoDB~~") )
    .catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("Hello world~~~ root page");
});

app.use('/api/users', users);
app.use('/api/tweets', tweets);

const port = process.env.PORT || 5000;

app.listen(port, () => {console.log(`Listening on port of ${port}`)});