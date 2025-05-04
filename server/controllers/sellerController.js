import jwt from 'jsonwebtoken'

export const sellerLogin = (req, res) => {
    const { email, password } = req.body;
    
    try {
        if(password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL){
            const token = jwt.sign({  email , iat: Math.floor(Date.now() / 1000) }, process.env.SECRET_KEY, { expiresIn : '1d'})
            res.cookie('sellerToken', token, {
                httpOnly : true,
                secure : process.env.NODE_ENV === 'production',
                sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge : 7 * 24 * 60 * 60 * 1000
            })
    
            res.status(200).json({success : true, message : "Login successful!!"});
        }
        else res.json({success : false, message : "Invalid credentials"})

    } catch (error) {
        console.error(error.message);
        res.status(500).json({success : false, message : "Internal server error."})
    }   
}


export const isSellerAuth = async (req, res) => {
    try {
        res.status(200).json({
            success : true,
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({success : false, message : error.message})
    }
}

export const sellerLogout = (req, res) => {
    try {
        res.clearCookie('sellerToken',{
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        res.status(200).json({success : true, message : "Logout successfully!!"});

    } catch (error) {
        console.error(error.message);
        res.status(500).json({success : false, message : error.message});
    }
}
