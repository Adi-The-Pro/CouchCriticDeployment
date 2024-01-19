const Room = require("../Models/room");
exports.create = async (payload) => {
  const { topic, roomType, ownerId } = payload;
  const room = await Room.create({
    topic,
    roomType,
    ownerId,
    speakers: [ownerId],
  });
  return room;
};
exports.getAllRooms = async (types) => {
  //this will apply all the filters present in types one by one
  const rooms = await Room.find({ roomType: { $in: types } })
    .populate("speakers") //populate will fetch all the info from the database to which _id inside is referring to speaker 
    .populate("ownerId")
    .exec();
  return rooms;
};
exports.getRoom = async (roomId) =>{
  const room = await Room.findOne({_id: roomId});
  return room;
};