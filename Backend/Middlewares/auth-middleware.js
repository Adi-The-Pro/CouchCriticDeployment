const { verifyAcccessToken } = require("../Services/token-services");
module.exports = async (req,res,next) => {
    try{
        const {accessToken} = req.cookies;
        console.log(accessToken,'auth-middleware');
        if(!accessToken){
            throw new Error();
        }
        const userData = await verifyAcccessToken(accessToken);  //this data will the data that was passed as payload while jwt sign ... it contains _id , activated
        if(!userData){
            console.log(err);
            throw new Error();
        }
        req.user = userData; //now we have attached the userData to the user object inside req which we'll use in the controller
        next();
    }
    catch(err){
        console.log(err.data);
        return res.status(401).json({message:'Invalid token'});
    }
}
