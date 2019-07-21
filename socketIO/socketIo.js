const rooms = ["Public"];

module.exports = function(server) {
  const io = require("socket.io")(server);

  io.on("connection", function(socket) {
    console.log("user connected");
    socket.emit("rooms", rooms);

    socket.on("disconnect", function() {
      console.log("user disconnected");
    });

    socket.on("add room", function(roomName) {
      rooms.push(roomName);
      io.emit("rooms", rooms);
    });

    socket.on("leave the rooms", function(room) {
      socket.leave(room);
      socket.myRoom = null;
    });

    socket.on("chat messages", function(msg) {
      if (msg.text === "") return;
      io.in(socket.myRoom).emit("chat messages", msg, socket.myRoom);
    });

    // CHANNELS
    socket.on("join to room", function(myRoom) {
      socket.join(myRoom);
      socket.myRoom = myRoom;

      let rooms = io.sockets.adapter.rooms;
      let usersInRoom = [];
      const thisUser = socket.handshake.headers.cookie
        .split("; ")[1]
        .split("=")[1];

      for (let room in rooms) {
        if (room === myRoom) {
          for (let socketInRoomID in rooms[room].sockets) {
            for (let socketID in io.sockets.sockets) {
              if (socketInRoomID === socketID) {
                io.sockets.sockets[socketID].handshake.headers.cookie
                  .split("; ")
                  .forEach(cookie => {
                    if (cookie.indexOf("userLogin") !== -1) {
                      usersInRoom.push(cookie.split("=")[1]);
                    }
                  });
              }
            }
          }
        }
      }

      io.in(socket.myRoom).emit(
        `get users in ${socket.myRoom}`,
        usersInRoom,
        thisUser
      );
    });
  });
};
