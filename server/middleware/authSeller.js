import jwt from "jsonwebtoken"

const authSeller = async (req, res, next) => {
    const { sellerToken } = req.cookies;

    if(!sellerToken){
        return res.json({success : false, message : "Not authorised"})
    }
    try {

        const decode = await jwt.verify(sellerToken, process.env.SECRET_KEY)

        
        if(decode.email === process.env.SELLER_EMAIL){
            console.log(decode)
            req.user =  {email : decode.email};
            next();
        }else return res.status(400).json({success : false, message : "Not authorised"});
       
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({success : false, message : error.message}); // also return here
    }
} 

export default authSeller;