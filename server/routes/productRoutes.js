
import express from 'express';
import { upload } from '../configs/multer.js';
import authSeller from '../middleware/authSeller.js';
import { addProduct, changeStock, productById, productList } from '../controllers/productController.js';

const router = express.Router();

router.post("/add", upload.array('images'), authSeller, addProduct);
router.get("/list", productList);
router.get("/id", authSeller, productById);
router.post("/stock", authSeller, changeStock);

export default router;