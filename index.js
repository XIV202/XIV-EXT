const express = require("express"),
    {
        Server: Server
    } = require("socket.io"),
    path = require("path"),
    compression = require("compression"),
    bodyparser = require("body-parser"),
    cors = require("cors"),
    app = express();
app.use(compression()), app.use(cors()), app.use(bodyparser.urlencoded({
    extended: !1
})), app.use(bodyparser.json()), app.use(express.static(path.join(__dirname, "app"))), app.get("/join", (e, o) => o.sendFile(path.join(__dirname, "roomlink.html"))), app.post("/api", (e, o) => {
    try {
        switch (e.body.type) {
            case "rooms.exist":
                o.end(JSON.stringify({
                    value: e.body.input.room in rooms
                }))
        }
    } catch (e) {
        o.end(JSON.stringify({
            err: "Unexpected error has occured."
        }))
    }
});
const io = new Server(app.listen(process.env.PORT || 3e3));
var rooms = {},
    inrooms = {},
    usernames = {};
io.on("connection", e => {
    "use strict";
    e.on("join", (o, s, i, r, n) => {
        o in rooms ? rooms[o].pass_enabled ? i ? rooms[o].passcode == i ? (inrooms[e.id] = o, usernames[e.id] = s, e.leaveAll(), e.join(o), io.in(o).emit("recieve", {
            message: `${s} has joined`,
            id: e.id
        }), e.emit("join", o, i, r, n)) : e.emit("alert", "Invalid Password") : e.emit("alert", "This room requires a passcode - Please enter it when joining the room") : (inrooms[e.id] = o, usernames[e.id] = s, e.leaveAll(), e.join(o), io.in(o).emit("recieve", {
            message: `${s} has joined`,
            id: e.id
        }), e.emit("join", o, i, r, n)) : e.emit("alert", "That room does not exist")
    }), e.on("create", (o, s) => {
        o in rooms ? e.emit("alert", "That room already exists") : s ? (rooms[o] = {
            pass_enabled: !0,
            passcode: s
        }, e.emit("created", o, s)) : (rooms[o] = {
            pass_enabled: !1
        }, e.emit("created", o, s))
    }), e.on("disconnect", () => {
        io.in(inrooms[e.id]).emit("recieve", {
            message: `${usernames[e.id]} has left`,
            id: e.id
        }), inrooms[e.id] = "";
        var o = io.sockets.adapter.rooms.get(inrooms[e.id]);
        0 == (o ? o.size : 0) && (e.leave(inrooms[e.id]), delete rooms[inrooms[e.id]])
    }), e.on("delete", (o, s) => {
        rooms[o].pass_enabled ? rooms[o].passcode == s ? (io.in(o).emit("deleted", o), inrooms[e.id] = "", e.leave(o), delete rooms[o]) : socket.emit("alert", "Invalid passcode (Are you trying somthing fishy through the console to delete rooms that are not yours)") : (io.in(o).emit("deleted", o), inrooms[e.id] = "", e.leave(o), delete rooms[o])
    }), e.on("leave", o => {
        var s = io.sockets.adapter.rooms.get(inrooms[e.id]);
        0 == (s ? s.size : 0) && (e.leave(inrooms[e.id]), delete rooms[inrooms[e.id]]), io.in(inrooms[e.id]).emit("recieve", {
            message: `${usernames[e.id]} has left`,
            id: e.id
        }), inrooms[e.id] = "", e.emit("deleted", o), e.leave(o)
    }), e.on("send", o => {
        io.in(inrooms[e.id]).emit("recieve", {
            message: `${usernames[e.id]}: ${o.message}`,
            id: o.id
        })
    }), e.on("recieve", o => {
        e.emit("recieve", o)
    })
});
