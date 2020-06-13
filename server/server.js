const express = require('express');
const api = require('./routes/index');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../build")));
}

app.use('/api', api);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.listen(PORT, () => console.log('API server is running'));

// prevents Heroku falling into sleep.
const http = require("http");

setInterval(function () {
    http.get("http://voice-pitch-youtube.herokuapp.com/");
}, 600000);