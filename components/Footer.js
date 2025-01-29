import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <Container fluid className="footer">
      <Row>
        <Col md={4}>
          <h2>About Us</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            sit amet nulla auctor, vestibulum magna sed, convallis ex.
          </p>
        </Col>
        <Col md={4}>
          <h2>Quick Links</h2>
          <ul>
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Lawyers</a>
            </li>
            <li>
              <a href="#">About Us</a>
            </li>
          </ul>
        </Col>
        <Col md={4}>
          <h2>Contact Us</h2>
          <p>
            <a href="mailto:info@example.com">info@example.com</a>
          </p>
          <p>
            <a href="tel:+1234567890">+1234567890</a>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;