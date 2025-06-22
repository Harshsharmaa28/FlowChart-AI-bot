import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export function middleware(req){
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: ['/generate']
};