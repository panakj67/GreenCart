import { request, response } from "express";
import Order from "../models/Order.js";
import User from "../models/user.js"
import Product from "../models/product.js";
import stripe from 'stripe'

export const placeOrderCOD = async ( req, res ) => {
    try {
        const { items, address } = req.body;
        const userId = req.user.id;

        if(!address || items.length == 0){
            res.json({success : false, message : "Invalid data"})
        }

        let amount = await items.reduce( async (acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        }, 0)

        // Add Tax charges 2%
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType : "COD"
        })

        return res.json({success : true, message : "Order Placed Successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false, message: "Internal server error" }); 
    }
} 

export const placeOrderStripe = async ( req, res ) => {
    try {
        const { items, address } = req.body;
        const userId = req.user.id;

        const {origin} =  req.headers;

        if(!address || items.length == 0){
            res.json({success : false, message : "Invalid data"})
        }

        let productData = [];

        let amount = await items.reduce( async (acc, item) => {
            const product = await Product.findById(item.product);
            
            productData.push({
                name : product.name,
                price : product.offerPrice,
                quantity : item.quantity
            })
            return (await acc) + product.offerPrice * item.quantity;
        }, 0)

        // Add Tax charges 2%
        amount += Math.floor(amount * 0.02);

        // Add this check before creating the Stripe session
        if (amount < 50) {
            return res.json({
              success: false,
              message: "Minimum order value for online payment must be ₹50"
            });
        }
          

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType : "Online"
        })

        // Stripe gateway initialse
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
        //Create line items for stripe
        const line_items = productData.map((item) => {
            return{
                price_data : {
                    currency : 'inr',
                    product_data : {
                        name : item.name
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02) * 100
                },
                quantity : item.quantity,
            }
        })
        //create session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode : "payment",
            success_url: `${origin}/loader?next=myorders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId : order._id.toString(),
                userId
            }
        })

        return res.json({success : true, url : session.url });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success : false, message: "Internal server error" }); 
    }
} 

// Stripe webhooks to verify payments Action : /stripe
export const stripeWebhooks = async (req, res) =>{
    //Stripe gateway initialise
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error("❌ Webhook signature error:", error.message);
        res.status(400).send(`Webhook Error : ${error.message}`)
    }

    // handle the event

    switch (event.type) {
        case "payment_intent.succeeded":{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Getting session metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent : paymentIntentId,
            });

            const { orderId, userId } = session.data[0].metadata;
            // Mark payment as paid
            await Order.findByIdAndUpdate(orderId, {isPaid : true})
            //clear user cart
            await User.findByIdAndUpdate(userId, {cartItems : {}})
            break;
        } 
        
        case "payment_intent.payment_failed":{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Getting session metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent : paymentIntentId,
            });

            const { orderId } = session.data[0].metadata;
            await Order.findByIdAndDelete(orderId);
            console.log("❌ Payment failed. Order deleted.");
            break;
        }
            
    
        default:
            console.error(`Unhandled event type ${event.type}`);
        }
        return res.json({recieved : true});   
    }



export const getUserOrders = async (req, res) => {
    try {
        const userId  = req.user.id;
        const orders = await Order.find({
            userId,
            $or : [{paymentType : "COD"}, {isPaid : true}]
        }).populate("items.product address").sort({createdAt : -1});

        return res.json({success : true, orders})

    } catch (error) {
        return res.json({success : false, message : error.message});
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or : [{paymentType : "COD"}, {isPaid : true}]
        }).populate("items.product address").sort({createdAt : -1});

        return res.json({success : true, orders})

    } catch (error) {
        return res.json({success : false, message : error.message});
    }
}