import User from "../models/user.js";


export const updateCart = async (req, res) => {
    try {
        const { userId, cartItems } = req.body;
    
        await User.findByIdAndUpdate(userId, { cartItems })
        res.json({success : true, message : "Cart Updated"})

    } catch (error) {
        console.log(error);
        res.status(500).json({success : false, message: "Internal server error" });     
    }
}