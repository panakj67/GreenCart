import mongoose from 'mongoose'

const sellerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 }
      }
    ]
})

const seller = mongoose.models.seller || mongoose.model('Seller', sellerSchema)

export default seller;