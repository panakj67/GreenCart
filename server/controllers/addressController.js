import Address from "../models/Address.js";

export const addAddress = async (req, res) => {
    try {
        const { userId, address } = req.body;
        await Address.create({
            ...address,
            userId
        })
        res.status(200).json({success : true, message : " Address added successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false, message: "Internal server error" }); 
    }
}

export const getAddress = async (req, res) => {
    try {
        
        const { id } = req.user;

        const addresses = await Address.find({userId : id});
        res.json({ success : true, addresses})
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false, message: "Internal server error" }); 
    }
}