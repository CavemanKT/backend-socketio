const io = require("socket.io")(8000, {
    cors: {
        origin: ['http://localhost:3000']
    }
})


let rooms = {}
io.on("connection", socket => {
    socket.on('message', data => {
        console.log(data.username)
        if (data.room == '') {
            socket.broadcast.emit('receive-message', data)
        } else {  // only this case for now because you already join room by the time you need to speak
            socket.to(data.room).emit('receive-message', data)
            console.log("send to room with message: ", data)
        }
        console.log(data)
    })
    socket.on('join-room', (data, cb) => {
        if (socket.room) { // if join another room , leave the room
            socket.leave(socket.room)
            rooms[socket.room]--
            if (rooms[socket.room] == 0) {
                delete rooms[socket.room]
            }
        }
        socket.join(data.room)
        socket.room = data.room
        socket.username = data.username
        console.log("socket.room = ", socket.room)
        console.log("socket.username = ", socket.username)


        // create room and admin
        if (!rooms[data.room]) {
            rooms[data.room] = {
                admin: { username: socket.id },
                users: {}
            }
        }

        rooms[data.room].users[socket.id] = data.username   // romms have 3 room ,each room has 3 users, each user has an socket.id->username



        console.log("backend-line 48:", rooms);
        // io.emit('rooms', rooms)



        console.log("backend-line join-room 21:", data.room);
        let initMsg = `Welcome ${data.username} to the discussion - ${data.room}`
        let initUsername = 'bot'
        let initRoom = data.room
        cb(initMsg)
        let initData = { msg: initMsg, username: initUsername, room: initRoom }
        socket.to(data.room).emit("broadcast-who-joins", initData)
    })

    socket.on('leave', () => {
        if (socket.room) {
            socket.leave(socket.room)
            rooms[socket.room]--
            if (rooms[socket.room] === 0) {
                delete rooms[socket.room]
            }
            // io.emit('rooms',rooms)
            console.log(`User ${socket.username} left room ${socket.room}`);
            socket.room = null
        }
    })

    socket.on('disconnect', (data) => {
        console.log("socket.username: ", socket.username);
        if (socket.room) {
            socket.leave(socket.room)
            rooms[socket.room]--
            console.log("disconnect......and there are..", rooms);
            if (rooms[socket.room] === 0) {
                delete rooms[socket.room]
            }
            // io.emit('rooms', room)
        }
        console.log(`User disconnected`, socket.id)
    })


})