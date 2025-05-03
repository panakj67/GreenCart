import jwt from "jsonwebtoken"

const authUser = async (req, res, next) => {
    const { token } = req.cookies;
    
    if(!token){
        return res.status(400).json({success : false, message : "Not authorised"});
    }

    try {
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        if(decode.id){
            req.user = {id : decode.id};
            next();
        }else return res.json({success : false, message : "Not authorised"});

    } catch (error) {
        console.error(error.message);
        return res.json({success : false, message : error.message}); // also return here
    }
} 

export default authUser;