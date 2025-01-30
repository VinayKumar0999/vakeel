import Carousel from 'react-bootstrap/Carousel';
import Card from 'react-bootstrap/Card';

const data = [
  {
    img: 'https://3veta.com/wp-content/uploads/2020/12/6.-Providing-online-consultations-for-lawyers-2.png',
    title: "",
    description: "",
  }, {
    img: 'https://www.vkeel.com/blog/wp-content/uploads/2020/02/Legal-Advice-Advocate-In-Delhi.jpg'
  },
  {
    img: 'https://www.gulfadvocates.com/wp-content/uploads/2020/05/Knowing-When-to-Seek-Legal-Advice.jpg'
  }, {
    img: 'https://www.1law.com/wp-content/uploads/2022/02/vector-illustration-of-remote-consultation-with-lawyer-scaled.jpg'
  }, {
    img: 'https://media.licdn.com/dms/image/D5612AQEDrfZYx44AJg/article-cover_image-shrink_720_1280/0/1690771649024?e=2147483647&v=beta&t=RKYTOtB81FhLjRQcITlGfrWB9eAGUSS2Qx5SE574jf4'
  }
]

function HeroSection() {
  return (
    <Carousel>
      {data?.map((item, index) => {
        return (
          <Carousel.Item key={index} interval={2000}>
            {/* <img
              className="d-block w-100"
              src={item?.img}
              alt={`Slide ${index}`}
            /> */}
            <Carousel.Caption>
              <Card style={{ width: '100%', height: '200px' }}>
                <Card.Body>
                  <Card.Title>Card Title</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                  <Card.Text>
                    Some quick example text to build on the card title and make up the
                    bulk of the card's content.
                  </Card.Text>
                  <Card.Link href="#">Card Link</Card.Link>
                  <Card.Link href="#">Another Link</Card.Link>
                </Card.Body>
              </Card>
            </Carousel.Caption>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
}

export default HeroSection;