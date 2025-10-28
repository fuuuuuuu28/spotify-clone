import mongoose, { Mongoose } from "mongoose"

const MONGODB_URL = process.env.MONGO_URL as string;
if(!MONGODB_URL){
    throw new Error("Invalid .env")
}

// dùng biến global để cache connection (tránh tạo lại nhiều lần khi hot reload hoặc mỗi request serverless)
let cached = (global as any).mongoose as { conn: Mongoose | null; promise: Promise<Mongoose> | null};

if(!cached){
    cached = (global as any).mongoose = { conn: null, promise:null};
}

export const connectionToDatabase = async () =>{
    if(cached.conn){
        console.log("✅ Using cached MongoDB connection");
        return cached.conn;
    }
    if(!cached.promise){
        cached.promise = mongoose.connect(MONGODB_URL).then((mongoose)=>mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}