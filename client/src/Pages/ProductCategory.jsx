import React, { useContext } from 'react'
import { AppDataContext } from '../Context/AppContext'
import { useParams } from 'react-router-dom'
import { categories } from '../assets/assets'
import ProductCard from '../Components/ProductCard'

const ProductCategory = () => {
    const {products} = useContext(AppDataContext)
    const {category} = useParams()
    const searchCategoty = categories.find((item) => item.path.toLowerCase() ===
    category) 

    const filteredProducts = products.filter((product) => product.category.toLowerCase() === category)
  return (
    <div className='mt-16'>
        {searchCategoty && (
            <div className='flex flex-col items-end w-max'>
                <p className='text-2xl font-medium'>{searchCategoty.text.toUpperCase()}</p>
                <div className='w-16 h-0.5 bg-[#4fbf8b] rounded-full'></div>
            </div>
        )}
        {filteredProducts.length > 0 ? (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-8'>
                {filteredProducts.map((product, index) => (
                    <ProductCard key={(product._id)}  product={product}/>
                ))}
            </div>
        ):(
            <div className='flex items-center justify-center h-[60vh]'>
                <p className='text-2xl font-medium text-primary'>No products found in this category</p>
            </div>
        )}
    </div>
  )
}

export default ProductCategory