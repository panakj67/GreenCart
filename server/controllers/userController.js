
import User from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Register User

export const  register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if(existingUser){
            return res.json({
                success : false,
                message: "User already exists",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let user = user.create({
            name,
            email,
            password : hashedPassword
        })

        const token = await jwt.sign({ id : newUser._id}, process.env.SECRET_KEY,  { expiresIn: "1d" });
        res.cookie('token' , token, {
            httpOnly : true,
            secure : true,
            sameSite : 'strict',
            maxAge : 7 * 24 * 60 * 60 * 1000
        });

        return res.json({success : true, message : "Successfully registered!!", user});

    } catch (error) {
        console.error(error.message);
        return res.json({success : false, message : error.message});
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        const user = await User.findOne({ email });
    
        if(!user){
            return res.json({success : false, message : "User does not exists."})
        }
    
        const match = await bcrypt.compare(password , user.password);
        if(!match){
            return res.json({success : false, message : "Invalid email or password."});
        }
        
        const token = await jwt.sign({ id : user._id}, process.env.SECRET_KEY,  { expiresIn: "1d" });
        res.cookie('token' , token, {
            httpOnly : true,
            secure : true,
            sameSite : 'strict',
            maxAge : 7 * 24 * 60 * 60 * 1000
        });
    
        return res.json({success : true, message : "Login successful", user})
    } catch (error) {
        console.error(error.message)
        return res.json({success : false, message : error.message})
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie('token',{
            httpOnly : true,
            secure : true,
            sameSite : 'strict'
        })
        res.json({success : true,message : "Logout successfully!!"});

    } catch (error) {
        console.error(error.message);
        res.json({success : false, message : error.message})
    }
}


export const isAuth = async (req, res) => {
    try {
        const {id} = req.user;

        const existingUser = await User.findById(id).select("-password");
        return res.json({
            success : true,
            user : existingUser
        })

    } catch (error) {
        console.error(error.message);
        res.json({success : false, message : error.message})
    }
}