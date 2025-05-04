
import express from 'express';
import connectDB from './configs/db.js';
import 'dotenv/config.js'
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoutes.js';
import sellerRouter from './routes/sellerRoutes.js'
import cors from 'cors';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js'
import addressRouter from './routes/addressRoutes.js'
import orderRouter from './routes/orderRoutes.js'
import { stripeWebhooks } from './controllers/orderController.js';


const app = express();

await connectDB();
await connectCloudinary();

const allowedOrigins = [
    process.env.FRONTEND_URL
]


app.post('/stripe', express.raw({type : 'application/json'}), stripeWebhooks)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());  
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.get("/", (req, res) => {
    res.send("API is working");
})
app.use("/api/user", userRouter)
app.use("/api/seller", sellerRouter)
app.use("/api/product", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/address", addressRouter)
app.use("/api/order", orderRouter)


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});