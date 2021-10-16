import React from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";

export default () => (
  <Container className="my-5">
    <Link to="/games">View Games</Link>
  </Container>
);
