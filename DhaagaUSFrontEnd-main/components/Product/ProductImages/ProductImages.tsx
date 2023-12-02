import { useEffect, useState } from "react";
import Image from "next/image";

import styles from "../../../styles/ProductImages.module.css";
import BackButton from "@/components/Ui/BackButton/BackButton";

const ProductImages = (props: { images: string[] }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [initRender, setInitRender] = useState(true);

  const { images } = props;

  useEffect(() => {
    if (images.length > 0) {
      setImageUrl(images[0]);
      setInitRender(false);
    }
  }, []);

  const clickHandler = (url: string) => {
    setImageUrl(url);
  };

  return (
    <div className={styles["image-section-conatiner"]}>
      <div className={styles["img-nvg"]}>
        <BackButton />
        {images.map((image, index) => (
          <div
            className={`${styles["img-container"]} ${
              image === imageUrl ? styles.active : ""
            }`}
            key={image}
            onClick={clickHandler.bind(null, image)}
          >
            <Image src={image} sizes="8vw" alt="Business Image" fill />
          </div>
        ))}
      </div>
      <div
        className={`${styles["img-viewer"]} ${
          images.length === 0 ? styles["no-img"] : ""
        }`}
      >
        {images.length === 0 && <div>No image available</div>}
        {images.length > 0 && (
          <Image
            src={initRender ? images[0] : imageUrl}
            alt="Business Image"
            priority={true}
            fill
          />
        )}
      </div>
    </div>
  );
};

export default ProductImages;
