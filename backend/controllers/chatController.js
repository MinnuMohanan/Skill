const Message = require("../models/Message");

// send message
exports.sendMessage = async (req,res)=>{
  try{

    const {receiver,message} = req.body;

    const newMessage = await Message.create({
      sender:req.user.id,
      receiver,
      message
    });

    res.status(201).json(newMessage);

  }catch(error){
    res.status(500).json(error.message);
  }
};


// get messages
exports.getMessages = async (req,res)=>{
  try{

    const messages = await Message.find({
      $or:[
        {sender:req.user.id,receiver:req.params.userId},
        {sender:req.params.userId,receiver:req.user.id}
      ]
    });

    res.json(messages);

  }catch(error){
    res.status(500).json(error.message);
  }
};