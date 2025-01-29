import { Container, Row, Col, Button } from 'react-bootstrap';

const HeroSection = () => {
  return (
    <Container fluid className="hero-section">
      <Row>
        <Col md={6}>
          <h1>Get Expert Legal Advice</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            sit amet nulla auctor, vestibulum magna sed, convallis ex.
          </p>
          <Button variant="primary" size="lg">
            Get Started
          </Button>
        </Col>
        <Col md={6}>
          <img src="hero-image.jpg" alt="Hero Image" />
        </Col>
      </Row>
    </Container>
  );
};

export default HeroSection;