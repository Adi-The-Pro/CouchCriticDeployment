const mongoose = require('mongoose');
main().catch(err=>console.log(err));
async function main() {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('database connection established');
    }
    catch(err){
        console.log(err);
    }
}

