import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import Button from "../utility/Button";
import { makeStyles } from '@material-ui/core/styles';
import image from '../images/login-bg.jpg';
import { Container, TextField } from '@material-ui/core';
import { Link } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  root:{
  padding: theme.spacing(4),
  fontFamily: 'Georgia', 
  backgroundImage: `url(${image})`,
  backgroundSize: "cover",
  width: "100%",
  height: "100-vh",
 },

  form: {
      backgroundColor: 'white',
      boxShadow: " 6px 4px 26px -6px rgba(0, 0, 0, 0.66)",
      padding: 50,
      '& > *': {
          margin: theme.spacing(1),
        },

  },

}));

const Form = styled.form`
 
`;
const Group = styled.div`
  width: 100%;
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
`;
const Btn = styled(Button)`
  width: 100%;
`;

const ErrorMessage = styled.p`
  font-size: 1.6rem;
  font-weight: 700;
  color: red;
`;

export default function CreateUser() {
  const classes = useStyles()
  // hook up current path to state
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: "CURRENT_PATH",
      payload: "create",
    });
  });

  //input fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  // redirect for login once succesful creation
  const [redirect, setRedirect] = useState(false);

  const onSubmit = (e) => {
    //regex email and phone validation
    const emailPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    const phonePattern = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/;
    e.preventDefault();
    setError("");
    // form validation
    if (!name || !email || !restaurant || !phone || !password || !password ) {
      setError("Please enter all fields");
    } else if (!emailPattern.test(email)) {
      setError("Please enter a valid email");
    } else if (password !== rePassword) {
      setError("Passwords must match");
    } else {
      const data = {
        name,
        email,
        restaurant,
        phone,
        password,
      };
      setError("");
      axios.post("/users/create", data).then((response) => {
        if (response.data.message) {
          //error
          setError(response.data.message);
        } else {
          setRedirect(true);
        }
      });
    }
  };

  return redirect ? (
    <Redirect to="/users/login" />
  ) : (
    <div className={classes.root}>
    <Container maxWidth="sm">
    <div className={classes.form}>
      <Form  onSubmit={onSubmit}>
      <h3 style={{textAlign:"center", marginBottom:"30px",fontSize:'22px',fontFamily:'Georgia'}}>Create New Account</h3>
      <h6 style={{fontSize:'15px',fontFamily:'Georgia'}}>Personal Information</h6>   
      <TextField
              id="standard-basic"
              style={{ marginBottom: "2rem" }}
              label="Name"
              value={name}
              type="text"
              placeholder="John Doe"
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <TextField
              id="standard-basic"
              style={{ marginBottom: "2rem",fontSize:'30px' }}
              label="Email"
              value={email}
              placeholder="johndoe@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              fullWidth
            />
            <TextField
              style={{ marginBottom: "2rem"}}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              fullWidth
            />
            <TextField
              style={{ marginBottom: "2rem" }}
              label="Re-enter Password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              type="password"
              fullWidth
            />
          <h6 style={{fontSize:'15px',fontFamily:'Georgia'}}>Buisness Information</h6>
            <TextField
              style={{ marginBottom: "2rem" }}
              label="Restaurant Name"
              value={restaurant}
              placeholder="In N Out"
              onChange={(e) => setRestaurant(e.target.value)}
              type="text"
              fullWidth
            />
            <TextField
              style={{ marginBottom: "2rem" }}
              label="Phone Number"
              value={phone}
              placeholder="123-456-7890"
              onChange={(e) => setPhone(e.target.value)}
              type="text"
              fullWidth
            />
        {error ? (
          <Group>
            <ErrorMessage>{error}</ErrorMessage>
          </Group>
        ) : null}
        <Group>
          <Btn variant="filled" >Create Account</Btn>
        </Group>
      </Form>
      </div>
    </Container>
    </div>
  );
}
