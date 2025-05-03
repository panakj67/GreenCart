import { v2 as cloudinary } from "cloudinary";
import Product from "../models/product.js";

export const addProduct = async (req, res) => {
    try {
        const { name, description, category, price, offerPrice } = req.body;
        const images = req.files;

        let imagesUrl = await Promise.all(
            images.map(async (image) => {
                let result = await cloudinary.uploader.upload(image.path, {
                    resource_type: "image"
                });
                return result.secure_url;
            })
        );

        await Product.create({
            name,
            description: description,
            category,
            price,
            offerPrice,
            image: imagesUrl,
        });

        res.status(200).json({ success: true, message: "Product added successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const productList = async ( req, res ) => {
    try {
        const products = await Product.find({})
        res.json({ success : true , products});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false, message: "Internal server error" });     
    }
}

export const productById = async ( req, res ) => {
    try {
        const { id } = req.body;
        const product = await Product.findById(id);
        res.json({ success : true , product });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false, message: "Internal server error" });     
    }
}

export const changeStock = async ( req, res ) => {
    try {
        const { id, inStock } = req.body;
        await Product.findByIdAndUpdate(id, { inStock });
        res.json({ success : true , message: "Stock updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false, message: "Internal server error" });     
    }
}