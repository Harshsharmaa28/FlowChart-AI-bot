import mongoose, { mongo } from "mongoose";


export async function connect(){
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const connection = mongoose.connection;

        console.log("MongoDB connected successfully")

        connection.on('error',(err) => {
            console.log('MongoDB not connected some error occured !')
        })

    } catch (error) {
        console.log('something went wrong',error)
    }
}