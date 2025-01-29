import { Container, Row, Col, Image } from 'react-bootstrap';

const LawyerProfile = ({ lawyer }) => {
  return (
    <Container fluid className="lawyer-profile">
      <Row>
        <Col md={4}>
          <Image src={lawyer.image} alt={lawyer.name} />
        </Col>
        <Col md={8}>
          <h2>{lawyer.name}</h2>
          <p>{lawyer.specialization}</p>
          <p>{lawyer.bio}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default LawyerProfile;