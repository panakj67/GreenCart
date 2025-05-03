import mongoose from 'mongoose';


const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("Database connected");     
        })
         await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'greencart',  // Specify the correct DB here
          });
    } catch (error) {
        console.error(error.message);
    }
}

export default connectDB;