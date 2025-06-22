import React from 'react'
import { toast } from 'react-toastify'

const logout = () => {
    const hostURL = process.env.NEXT_PUBLIC_HOST_URL
    const handleClick = async () =>{
        try {
            const response = await fetch(`${hostURL}/users/logout`)
            if(response.ok){
                toast.success("Logout Successfully")
            }
            else toast.error("Internal server Error")
        } catch (error) {
            toast.error("Server Error")
        }
    }  
    return (
        <>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded" 
        onClick={handleClick}>
            Logout
        </button>
        </>
    )
}

export default logout
