import React, { useContext, useEffect } from 'react'
import { AppDataContext } from '../Context/AppContext'
import { NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import toast from 'react-hot-toast'

const Navbar = () => {
  const [open, setOpen] = React.useState(false)
  const { user, setUser, axios, setShowUserLogin, setSearchQuery, searchQuery, getCartCount, getCartTotal} = useContext(AppDataContext)
  const navigate = useNavigate()

  const logout = async () => {
    try {
      const {data} = await axios.get('/api/user/logout');
      if(data.success){
        toast.success(data.message);
        setUser(null);
        navigate('/')
      }else toast.error(data.message)
    } catch (error) {
        toast.error(error.message)
    }
  }

  useEffect(()=>{
    if(searchQuery.length > 0){
      navigate('/products')
    }
  },[searchQuery])

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

            <NavLink to='/' onClick={() => setOpen(false)}>
                <img className="h-8 md:h-9" src={assets.logo} alt="logo" />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center sm:gap-8 lg:gap-5 xl:gap-8">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/products">All Product</NavLink>
                <NavLink to="/contact">Contact</NavLink>

                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input onChange={(e) => setSearchQuery(e.target.value)} className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products" />
                    <img src={assets.search_icon} alt="search" className='w-4 h-4'/>
                </div>

                <div onClick={() => navigate('/cart')} className="relative cursor-pointer">
                    <img src={assets.nav_cart_icon} alt="cart" className='w-6 opacity-80'/>
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-[#4fbf8b] w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

                { !user ?
                  (<button onClick={() => setShowUserLogin(true)} className="cursor-pointer px-8 py-2 bg-[#4fbf8b] hover:bg-[#44ae7c] transition text-white rounded-full">
                    Login
                </button>) :
                  (
                     <div className='relative group'>
                       <img src={assets.profile_icon} className='w-10 rounded' alt="pic" />
                       <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow rounded-md w-40 text-sm z-10'>
                          <li onClick={() => navigate('/myorders')} className='p-1.5 pl-3 hover:bg-green-200 cursor-pointer'>My Orders</li>
                          <li onClick={logout} className='p-1.5 pl-3 hover:bg-green-200 cursor-pointer'>Logout</li>
                       </ul>
                     </div>
                  )
                }
            </div>

            <div className='md:hidden flex items-center gap-6'>
                <div onClick={() => navigate('/cart')} className="relative cursor-pointer">
                        <img src={assets.nav_cart_icon} alt="cart" className='w-6 opacity-80'/>
                        <button className="absolute -top-2 -right-3 text-xs text-white bg-[#4fbf8b] w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

                <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu">
                {/* Menu Icon SVG */}
                    <img src={assets.menu_icon} alt="menu" />
                </button>

            </div>

            

            {/* Mobile Menu */}
            { open && (
              <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full z-100 bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
                <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
                <NavLink to="/products" onClick={() => setOpen(false)}>About</NavLink>
                {user && <NavLink to="/myorders" onClick={() => {setOpen(false)}}>My orders</NavLink>}
                <NavLink to="/contact" onClick={() => setOpen(false)}>Contact</NavLink>


                {!user ? (
                  <button onClick={() =>{
                    setShowUserLogin(true)
                    setOpen(false)
                  }
                  } className="cursor-pointer px-6 py-2 mt-2 bg-[#4fbf8b] hover:bg-[#44ae7c] transition text-white rounded-full text-sm">
                    Login
                  </button>
                ) : (
                  <button onClick={logout} className="cursor-pointer px-6 py-2 mt-2 bg-[#4fbf8b] hover:bg-[#44ae7c] transition text-white rounded-full text-sm">
                    Logout
                  </button>
                )}
                
            </div>
            )}

        </nav>
  )
}

export default Navbar