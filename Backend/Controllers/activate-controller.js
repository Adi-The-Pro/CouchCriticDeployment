const Jimp = require('jimp');
const path = require('path');
const { findUser } = require('../Services/user-services');
const UserDto = require('../dtos/user-dtos');

exports.activate = async (req,res) => {//middleware added something in user field
    // Activation logic
    const { name, avatar } = req.body;
    if (!name || !avatar) {
      res.status(400).json({ message: 'All fields are required!' });
    }

    ////Image Base-64 is created from a Base64 file after removing the particular prefix 
    const buffer = Buffer.from(
        avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
        'base64'
    );

    //Creating a random path for this image
    const imagePath = `${Date.now()}-${Math.round(
        Math.random() * 1e9
    )}.png`;

    try {
      const jimResp = await Jimp.read(buffer);
      jimResp
        .resize(150, Jimp.AUTO)
        .write(path.resolve(__dirname, `../storage/${imagePath}`));
      
      // Update user
      const userId = req.user._id;
      try {
        const user = await findUser({ _id: userId });
        if (!user) {
          res.status(404).json({ message: 'User not found!' });
        }
        user.activated = true;
        user.name = name;
        user.avatar = `/storage/${imagePath}`;
        await user.save();
        return res.json({ user: new UserDto(user), auth: true });
      } catch (err) {
        console.error('SW:', err);
        return res.status(500).json({ message: 'Something went wrong!' });
      }
    } catch (err) {
      console.error('Image processing error:', err);
      res.status(500).json({ message: 'Could not process the image' });
    }
}