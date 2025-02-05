import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from '@mui/material/Card'
import Slider from "react-slick";
import { styled } from '@mui/material/styles';

const CarouselItem = styled('div')({
  '&.slick-slide': {
    width: '100% !important',
  },
});

const data1 = [
  {
    img: 'https://www.1law.com/wp-content/uploads/2022/02/vector-illustration-of-remote-consultation-with-lawyer-scaled.jpg'
  },
  {
    img: 'https://www.1law.com/wp-content/uploads/2022/02/vector-illustration-of-remote-consultation-with-lawyer-scaled.jpg'
  },
  {
    img: 'https://www.1law.com/wp-content/uploads/2022/02/vector-illustration-of-remote-consultation-with-lawyer-scaled.jpg'
  },
  {
    img: 'https://www.1law.com/wp-content/uploads/2022/02/vector-illustration-of-remote-consultation-with-lawyer-scaled.jpg'
  },

]

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

function HeroSection() {
  return (
    <Slider {...settings}>
      {data1.map((item, index) => (
        <div key={index}>
          <CarouselItem>
            <Card sx={{ maxWidth: '100%' }}>
              <img src={item.img} style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover' }} alt="Slider Image" />
            </Card>
          </CarouselItem>

        </div>
      ))}
    </Slider>
  );
}

export default HeroSection;