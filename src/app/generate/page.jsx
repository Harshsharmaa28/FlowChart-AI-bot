'use client';
import { PromptBar } from "@/components/Prompt/Prompt";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';


const generatechart = () =>{
    const router = useRouter();
    const hostURL = process.env.NEXT_PUBLIC_HOST_URL;

    const handleLogout = async () =>{
        try {
            const response = await fetch(`${hostURL}/users/logout`);

            console.log(response)
            if(response.ok){
                toast.success("Logout Successfully")
                router.push('/login')
            }
        } catch (error) {
            toast.error("Please try again server error occured")
        }
    }
    
    return (
        <div>
            <ToastContainer autoClose={1000}/>
            <div class="flex justify-end p-5 absolute w-screen">
                <button onClick={handleLogout} class="bg-black text-white p-2 sm:px-4 sm:py-2 cursor-pointer rounded hover:bg-gray-800 transition">
                    Logout
                </button>
            </div>
            <PromptBar/>
        </div>
    )
}

export default generatechart;