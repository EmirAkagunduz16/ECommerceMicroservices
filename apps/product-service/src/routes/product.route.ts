import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "./controllers/product.controller";

const router: Router = Router();

router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/:id", getProduct);
router.get("/", getProducts);

router.get("/test", (req, res) => {
  res.json({ message: "Hello World" });
});

export default router;
