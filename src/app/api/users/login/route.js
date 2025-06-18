import User from '@/app/models/userModel'
import bcrypt from 'bcrypt';
import { connect } from '@/app/dbConfig/dbConfig';

export async function POST(req) {
    try {
        const {email,password} = await req.json();
        await connect();
    
        if(!email || !password){
            return new Response(JSON.stringify({error: "Please fill all the feilds"}),{
                status: 400,
                headers: {'Content-type':'Application/json'}
            })
        }
    
        const user = await User.findOne({email});
    
        if(!user){
            return new Response(JSON.stringify({error:"User does not exsist"}),{
                status: 404,
                headers:{'Content-type':'Application/json'},
            })
        }
    
        const isMatch = await bcrypt.compare(password,user.password);
    
        if(!isMatch){
            return new Response(JSON.stringify({error:"Incorrect Password Please Enter correct password"}),{
                status: 400,
                headers: {'Content-type':'Application/json'},
            })
        }
    
        return new Response(JSON.stringify({message:"Login successful", user: user}),{
            status: 200,
            headers:{'Content-type':'Application/json'}
        });
    } catch (error) {
        return new Response(JSON.stringify({message:error}),{
            status:400,
            headers:{'Content-type':'Application/json'}
        })
    }
}