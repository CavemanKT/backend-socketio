const io = require("socket.io")(8000, {
    cors: {
        origin: ['http://localhost:3000']
    }
})

io.on("connection", socket => {
    // console.log(socket.id);
    socket.on('message', data => {
        console.log(data.username);

        if (data.room == '') {
            socket.broadcast.emit('receive-message', data)

        } else {
            socket.to(data.room).emit('receive-message', data)
            console.log("send to room with message: ", data);
        }
        console.log(data)
    })
    socket.on('join-room', (room, cb) => {
        socket.join(room.room)
        console.log("backend-line join-room 21:", room.room);
        cb(`Welcome ${room.username}to the discussion - ${room.room}`)
    })
})