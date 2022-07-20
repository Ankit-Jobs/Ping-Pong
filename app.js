var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var socketIO = require("socket.io");
var app = express();
var compression = require("compression");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(compression());

app.get("/", (req, res) => {
  res.sendFile("login.html");
});

let players = [];
app.post("/login", (req, res) => {
  if (!players.length) {
    players[0] = [req.body.name || "Guest"];

    res.status(200).json({
      id: 0,
      room: 0,
    });
  } else if (players[players.length - 1]?.length < 2) {
    players[players.length - 1].push(req.body.name || "Guest");
    res.status(200).json({
      id: 1,
      room: players.length - 1,
    });
  } else {
    players[players.length] = [req.body.name];
    res.status(200).json({
      id: 0,
      room: players.length,
    });
  }
});
const server = require("http").createServer(app);
const io = socketIO(server);
io.on("connection", (socket) => {
  socket.on("join", (player) => {
    io.emit("players", players[player.room]?.length);
  });
  socket.on("pos", (pos) => {
    socket.broadcast.emit("posIncoming", pos);
  });
  socket.on("ballPos", (ballPos) => {
    socket.broadcast.emit("ballPos", ballPos);
  });
  socket.on("start", (m) => {
    socket.broadcast.emit("start", true);
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).json(err);
});

server.listen(process.env.PORT || 80, "0.0.0.0", () =>
  console.log("Connected to Server")
);
