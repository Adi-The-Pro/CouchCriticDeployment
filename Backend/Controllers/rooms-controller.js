const { create, getAllRooms, getRoom} = require("../Services/room-services");
const RoomDto = require('../dtos/room-dto')

//Add A New Room Data With The Existing Rooms Data 
exports.create = async (req,res) =>{
    const {topic,roomType} = req.body;
    if(!topic || !roomType){
        return res.status(400).json({message:"All Fields Are Required"});
    }
    const room = await create({
        topic,
        roomType,
        ownerId: req.user._id, //This was put in the req by the auth middleware from the cookies 
    });
    return res.json(new RoomDto(room));
}

//Fetch All The Room Data And Send It To The Frontend To Render It
exports.index = async (req,res) => {
    const rooms = await getAllRooms(['open']);
    const allRooms = rooms.map((room) => new RoomDto(room));
    return res.json(allRooms);
};

//Fetch Single Room Data
exports.show = async (req,res) =>{
    const room = await getRoom(req.params.roomId);
    return res.json(room);
};