const io = require("socket.io")(8000, {
    cors: {
        origin: ['http://localhost:3000']
    }
})


let users = []
io.on("connection", socket => {
    socket.on('message', data => {
        console.log(data.username);
        if (data.room == '') {
            socket.broadcast.emit('receive-message', data)
        } else {  // only this case for now because you already join room by the time you need to speak
            socket.to(data.room).emit('receive-message', data)
            console.log("send to room with message: ", data);
        }
        console.log(data)
    })
    socket.on('join-room', (data, cb) => {
        socket.join(data.room)
        users.push(data)
        console.log("backend-line join-room 21:", data.room);
        cb(`Welcome ${data.username} to the discussion - ${data.room}`)
        socket.to(data.room).emit("broadcast-who-joins", data)
    })
})