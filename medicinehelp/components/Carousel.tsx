import { Image } from "@chakra-ui/react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel as CarouselContainer } from "react-responsive-carousel";

type Props = {
  imagePaths: any[];
};

export const Carousel = ({ imagePaths }: Props) => {
  return (
    <CarouselContainer dynamicHeight infiniteLoop statusFormatter={() => ""} autoPlay interval={3500}>
      {imagePaths?.map((path, index) => (
        <Image maxH={800} maxW={800} key={index} src={path} alt={`Feature: ${index}`}/>
      ))}
    </CarouselContainer>
  );
};
