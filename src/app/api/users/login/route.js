import User from '@/models/userModel'
import bcrypt from 'bcrypt';
import { connect } from '@/dbConfig/dbConfig';
import jwt  from "jsonwebtoken";
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const {email,password} = await req.json();
        await connect();
    
        if(!email || !password){
            return NextResponse.json({
                message:"Please fill all the feilds",
                success: false,
            })
        }
    
        const user = await User.findOne({email});
    
        if(!user){
            return NextResponse.json({
                message:"User does not exsist",
                success: false,
            })
        }
    
        const isMatch = await bcrypt.compare(password,user.password);
    
        if(!isMatch){
            return NextResponse.json({
                message:"Incorrect Password Please Enter correct password",
                success:false,
            })
        }

        const tokenData ={
            id: user._id,
            username: user.username,
            email: user.email,
        }

        if (!process.env.TOKEN_SECRET) {
            return NextResponse.json({
                message:"TOKEN_SECRET is not set in environment",
                success: false,
            })
        }

        const token = await jwt.sign(tokenData,process.env.TOKEN_SECRET,{expiresIn:'5h'});
        
        const response = NextResponse.json({
            message:"Login successfully",
            success: true,
        })

        response.cookies.set("token",token,{
            httpOnly: true,
        })
        
        return response;
    } catch (error) {
        return NextResponse.json({
            message: error.message,
            success: false,
        })
    }
}