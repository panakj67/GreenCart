import React, { useContext, useEffect, useState } from 'react'
import { AppDataContext } from '../../Context/AppContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const SellerLogin = () => {
    const {isSeller, setIsSeller, axios} = useContext(AppDataContext)
    const navigate = useNavigate()
    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const submitHandler = async (e) => {
        try {
            e.preventDefault();
            const {data} = await axios.post('/api/seller/login', {email , password});
            if(data.success){
                setIsSeller(true)
                navigate('/seller')
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() =>{
        if(isSeller){
            navigate('/seller')
        }
    },[isSeller])
    
  return !isSeller && (
    <form onSubmit={submitHandler} action="" className='min-h-screen flex items-center text-sm text-gray-600'>
        <div className='flex flex-col gap-5 m-auto p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200'>
            <p className='text-2xl font-medium m-auto'><span className='text-[#4fbf8b]'>Seller </span>Login</p>

            <div className='w-ful'>
                <p>Email</p>
                 <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Enter your email'
                 className='border border-gray-200 rounded w-full p-2 mt-1 outline-[#4fbf8b]' required/>
            </div>

            <div className='w-ful'>
                <p>Password</p>
                 <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Enter your password'
                 className='border border-gray-200 rounded w-full p-2 mt-1 outline-[#4fbf8b]' required/>
            </div>

            <button className='bg-[#4fbf8b] text-white w-full py-2 rounded-md cursor-pointer hover:bg-[#44ae7c] transition'>
                Login
            </button>
        </div>
    </form>
  )
}

export default SellerLogin