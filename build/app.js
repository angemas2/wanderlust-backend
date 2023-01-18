"use strict";
require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var debug = require("debug")("backend:server");
var http = require("http");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var viewpointsRouter = require("./routes/viewpoints");
var itinerariesRouter = require("./routes/itineraries");
var profilesRouter = require("./routes/profiles");
var activitiesRouter = require("./routes/activities");
var app = express();
const cors = require("cors");
app.use(cors());
const fileUpload = require("express-fileupload");
app.use(fileUpload());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/viewpoints", viewpointsRouter);
app.use("/itineraries", itinerariesRouter);
app.use("/profiles", profilesRouter);
app.use("/activities", activitiesRouter);
var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);
var server = http.createServer(app);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}
function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
}
module.exports = app;
