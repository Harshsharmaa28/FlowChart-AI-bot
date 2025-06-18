import User from "@/app/models/userModel";
import bcrypt from 'bcrypt';
import { connect } from "@/app/dbConfig/dbConfig";

export async function POST(req){
    const {username,email,password} = await req.json();
    await connect();

    console.log(username,email,password)

    if(!username || !email || !password){
        return new Response(JSON.stringify({error: "Please fill all the feilds"}),{
            status: 400,
            headers: {'Content-type':'Application/json'}
        })
    }

    const isUserExist = await User.findOne({email});

    if(isUserExist){
        return new Response(JSON.stringify({error:"User already Exist"}),{
            status:400,
            headers:{'Content-type':'Application/json'}
        });
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const newUser = new User({username,email,password: hashedPassword});
    await newUser.save();

    return new Response(JSON.stringify({message:"User registered Successfully"}),{
        status:200,
        headers: {'Content-type':'Application/json'}
    });

}