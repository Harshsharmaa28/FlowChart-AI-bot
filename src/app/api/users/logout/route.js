import { connect } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";


export async function GET(){
    await connect();
    try {
        const response = NextResponse.json({
            message: "Logout successfully",
            success: true,
        })

        response.cookies.set("token","",{
            httpOnly: true,
            expires: new Date(0),
        })
        return response;
    } catch (error) {
        return NextResponse.json({
            message: error,
            success: false,
        })
    }
}