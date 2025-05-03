import React, { useContext } from 'react'
import Navbar from './Components/Navbar'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Home from './Pages/Home'

import Cart from './Pages/Cart'
import Login from './Components/Login'
import Seller from './Pages/Seller'
import Deals from './Pages/Deals'
import { Toaster } from 'react-hot-toast'
import Footer from './Components/Footer'
import { AppDataContext } from './Context/AppContext'
import AllProducts from './Pages/AllProducts'
import ProductCategory from './Pages/ProductCategory'
import ProductDetails from './Pages/ProductDetails'
import AddAddress from './Pages/AddAddress'
import MyOrders from './Pages/MyOrders'
import SellerLogin from './Components/seller/SellerLogin'
import SellerLayout from './Pages/seller/SellerLayout'
import AddProduct from './Pages/seller/AddProduct'
import ProductList from './Pages/seller/ProductList'
import Orders from './Pages/seller/Orders'
import Loading from './Components/Loading'

const App = () => {
  const isSellerPath = useLocation().pathname.includes('seller')
  const {showUserLogin, isSeller} = useContext(AppDataContext)


  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
        {isSellerPath ? null : <Navbar />}
        {showUserLogin ? <Login/> : null}
        
        <Toaster />

        <div className= {`${isSellerPath ?  "" : "px-6 sm:px-6 md:px-16 lg:px-24 xl:px-32"}`}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/products' element={<AllProducts />} />
              <Route path='/products/:category' element={<ProductCategory />} />
              <Route path='/products/:category/:id' element={<ProductDetails />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/add-address' element={<AddAddress />} />
              <Route path='/myorders' element={<MyOrders  />} />
              <Route path='/loader' element={<Loading  />} />
              <Route path='/seller' element={isSeller ? <SellerLayout/> : <SellerLogin />}>
                  <Route index element={isSeller ? <AddProduct/> : null}/>
                  <Route path='product-list' element={<ProductList/>}/>
                  <Route path='orders' element={<Orders/>}/>
              </Route>
              <Route path='/deals' element={<Deals />}></Route>
              
            </Routes>
        </div>
        
        {!isSellerPath && <Footer />}
        
    </div>
  )
}

export default App