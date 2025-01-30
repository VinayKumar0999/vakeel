import { Navbar, Container, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

const NavigationBar = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container className='container-wrapper'>
        <Navbar.Brand href="#home">Legal Consultancy App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className='nav-bar-options'>
          <Nav className="mr-auto nav-wrapper">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/lawyers">Lawyers</Nav.Link>
            <Nav.Link href="/user/dashboard">Dashboard</Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            <Nav.Link href="/login">
              <FontAwesomeIcon icon={faUser} /> Login
            </Nav.Link>
            <Nav.Link href="/register">
              <FontAwesomeIcon icon={faLock} /> Register
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;