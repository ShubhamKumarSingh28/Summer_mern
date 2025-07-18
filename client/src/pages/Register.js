import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card
} from "react-bootstrap";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { SET_USER } from "../redux/user/actions";
import axios from "axios";
import { serverEndpoint } from "../config/config";

function Register() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: ""
  });

  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Name is mandatory";
    if (!formData.username) newErrors.username = "Username is mandatory";
    if (!formData.password) newErrors.password = "Password is mandatory";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post(`${serverEndpoint}/auth/register`, formData, {
        withCredentials: true
      });
      dispatch({
        type: SET_USER,
        payload: response.data.user
      });
    } catch (error) {
      if (error?.response?.status === 401) {
        setErrors({ message: "User already exists with this email" });
      } else {
        setErrors({ message: "Something went wrong, please try again" });
      }
    }

    setValidated(true);
  };

  const handleGoogleSignin = async (authResponse) => {
    try {
      const response = await axios.post(`${serverEndpoint}/auth/google-auth`, {
        idToken: authResponse.credential
      }, { withCredentials: true });

      dispatch({
        type: SET_USER,
        payload: response.data.userDetails
      });
    } catch (error) {
      setErrors({ message: 'Something went wrong during Google sign-in' });
    }
  };

  return (
    <section className="ezy__signin6 light d-flex">
      <Container>
        <Row className="justify-content-between h-100">
          <Col lg={6}>
            <div
              className="ezy__signin6-bg-holder d-none d-lg-block h-100"
              style={{
                backgroundImage: "url(https://cdn.easyfrontend.com/pictures/sign-in-up/sign1.jpg)"
              }}
            />
          </Col>
          <Col lg={5} className="py-5">
            <Row className="align-items-center h-100">
              <Col xs={12}>
                <Card className="ezy__signin6-form-card">
                  <Card.Body className="p-0">
                    <h2 className="ezy__signin6-heading mb-3">Create a New Account</h2>
                    <p className="mb-4 mb-md-5">
                      <span className="mb-0 opacity-50 lh-1">Already have an account?</span>
                      <Button variant="link" className="py-0 text-dark text-decoration-none">
                        Login
                      </Button>
                    </p>

                    {errors.message && (
                      <div className="alert alert-danger">{errors.message}</div>
                    )}

                    <Form noValidate validated={validated} onSubmit={handleSubmit} className="pe-md-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter username"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          isInvalid={!!errors.username}
                        />
                        <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                      </Form.Group>

                      <Button variant="" type="submit" className="ezy__signin6-btn-submit w-100">
                        Register
                      </Button>
                    </Form>

                    <div className="position-relative ezy__signin6-or-separator">
                      <hr className="my-4 my-md-5" />
                      <span className="px-2">Or</span>
                    </div>

                    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                      <GoogleLogin onSuccess={handleGoogleSignin} onError={() => setErrors({ message: 'Google Sign-in failed' })} />
                    </GoogleOAuthProvider>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Register;
