import styles from "../../styles/Product.module.css";

import { ProductDetail } from "@/Models/ListData";
import ProductImages from "./ProductImages/ProductImages";
import ProductProfile from "./ProductProfile/ProductProfile";

const Product = (props: { productDetail: ProductDetail }) => {
  const { productDetail } = props;
  const { product } = productDetail;

  return (
    <div className={styles["grid-row-container"]}>
      <ProductImages images={product.photos} />
      <ProductProfile productDetail={productDetail} />
    </div>
  );
};

export default Product;
