const socketio = require("socket.io");

const initSocket = (server)=>{

  const io = socketio(server,{
    cors:{
      origin:"*"
    }
  });

  io.on("connection",(socket)=>{

    console.log("User connected");

    socket.on("sendMessage",(data)=>{
      io.emit("receiveMessage",data);
    });

    socket.on("disconnect",()=>{
      console.log("User disconnected");
    });

  });

};

module.exports = initSocket;