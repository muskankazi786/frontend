import { Carousel } from "react-bootstrap";

const ProductImagesCarousel = (props: { images: string[] }) => {
  const { images } = props;

  return (
    <Carousel className="d-block d-md-none">
      {images.map((image) => (
        <Carousel.Item key={image}>
          <img
            className="d-block w-100"
            src={image}
            alt="First slide"
            style={{ height: 400, objectFit: "cover", borderRadius: 16 }}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductImagesCarousel;
