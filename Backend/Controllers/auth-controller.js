const { generateOtp, sendOtpBySMS, verifyOTP } = require("../Services/otp-services");
const { hashOtp } = require("../Services/hash-services");
const { findUser, createUser } = require("../Services/user-services");
const { generateToken, storeRefreshToken, verifyRefreshToken, findRefreshToken, updateRefreshToken, removeToken } = require("../Services/token-services");
const UserDto = require('../dtos/user-dtos')

exports.sendOtp = async(req,res) => {
    const {phone} = req.body;

    if(!phone){
        return res.status(404).json({message:'Phone Field Is Required'});
    }

    //Generating Otp
    const otp = await generateOtp();
    
    //Creating Hash
    const ttl = 1000 * 60 * 2; //1sec*60*2= 120sec= 2min
    const expires = Date.now() + ttl; //This will tell the exact time at which hash will expire
    const data = `${phone}.${otp}.${expires}`;
    const hash = await hashOtp(data);
    
    //Send OTP
    try{
        // await sendOtpBySMS(phone,otp); //Sending OTP TO User On Phone Number
        res.json({//Sending Hash + Expire Time To The Frontend
            hash : `${hash}.${expires}`,
            phone : phone,
            otp,
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:'Sending Failed'});
    }

};

exports.verifyOtp = async (req, res) => {
    const {otp,hash,phone}  = req.body;
    if(!otp || !hash || !phone){//If any of the following field is not received from the forntend->error
        return res.status(400).json({message:'All fields are required'});
    }
    //As the hash we sent to the user has {hashedData(phone.otp.expires)} and {expires} separated by '.'
    const [hashOtp,expires] = hash.split('.');
    if(Date.now()>+expires){ //as Date.now() is number and expires is string
        return res.status(400).json({message:'OTP expired!'});
    }
    /*Now to verify the user we'll create a hash(phone.otp.expires) again using the data received and if that 
        hash is same as the hash received from the frontend then the user has entered correct OTP*/
    //As same data has the same hash
    const data = `${phone}.${otp}.${expires}`;
    let isValid = await verifyOTP(hashOtp,data);
    if(!isValid){
        return res.status(400).json({message:'Invalid OTP'});
    }
    //If user is valid then create that user in the database if it's not already
    let user;
    try{
        user = await findUser({phone});
        if(!user){
            user = await createUser({phone}); 
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({message:'Db Error'});
    }

    //Creating JWT Tokens -> accessToken and refreshToken
    const {accessToken,refreshToken} = await generateToken({_id:user._id, activated:false});

    //Storing the refresh token in the database inside RefreshToken Model...
    await storeRefreshToken(refreshToken,user._id);
    

    res.cookie('refreshToken', refreshToken,{ //valid for one min 
        maxAge: 1000*60*60*24*30,
        httpOnly:true,
    });

    res.cookie('accessToken', accessToken,{
        maxAge: 1000*60*60*24*30,
        httpOnly:true,
    });
    console.log(accessToken+''+refreshToken);
    const userDto =new UserDto(user);
    res.json({user:userDto,auth:true});
};

exports.refresh = async (req,res) => {
    //Get refresh token from the cookies
    const {refreshToken:refreshTokenFromCookie} = req.cookies;

    //Check if token is valid
    let userData; //This we had put inside refreshToken when we created it contains _id
    try{
        userData = await verifyRefreshToken(refreshTokenFromCookie); 
    }catch(err){
        return res.status(401).json({message:'Invalid Token1'});
    }
    
    //Check if token is in Database
    try{
        const token = await findRefreshToken(userData._id,refreshTokenFromCookie);
        if(!token){
            return res.status(401).json({message:'Token Not In Database'});
        }
    }catch(err){
        console.log(err);
        res.json(500).json({message:'Internal error'});
        return;
    }

    //Check if valid user
    const user = await findUser({_id:userData._id});
    if(!user){
        return res.status(404).json({message:'No user'});
    }

    //Generate new tokens
    const {refreshToken,accessToken} = await generateToken({_id:userData._id});

    //Update Refresh Token
    try{
        await updateRefreshToken(userData._id,refreshToken);
    }catch(err){
        return res.json(500).json({message:'Internal error'})
    }

    //Put In Cookie
    res.cookie('refreshToken', refreshToken,{
        maxAge: 1000*60*60*24*30,
        httpOnly:true,
    });

    res.cookie('accessToken', accessToken,{
        maxAge: 1000*60*60*24*30,
        httpOnly:true,
    });
    const userDto = new UserDto(user);
    res.json({user:userDto,auth:true});
}

exports.logout = async (req,res) => {
    const {refreshToken} = req.cookies;
    //delete refresh token from database
    await removeToken(refreshToken);
    
    //delete cookie
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');

    res.json({user:null,auth:false});
}