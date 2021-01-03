import React, { useState, useEffect } from "react";
import { Container } from '@material-ui/core';
import styled from "styled-components";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import Button from "../utility/Button";
import InputGroup from "../utility/InputGroup";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import image1 from '../images/login-bg.jpg';
import Grid from '@material-ui/core/Grid';
import deepOrange from '@material-ui/core/colors/deepOrange';
import image from '../images/login.jpg';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Input from '@material-ui/core/Input'
import { Link } from "react-router-dom";



const useStyles = makeStyles((theme) => ({
  root:{
  padding: theme.spacing(4),
  fontFamily: 'Georgia', 
  backgroundImage: `url(${image1})`,
  backgroundSize: "cover",
  width: "100%",
  height: "100vh",
 },

  margin: {
    marginTop: theme.spacing(1),
  },
  form: {
      backgroundColor: 'white',
      padding: theme.spacing(6),
      '& > *': {
          margin: theme.spacing(1),
        },
      height: 400,
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

const StyledInputGroup = styled(InputGroup)`
  margin-bottom: 2rem;
`;

export default function Login() {
  const classes = useStyles();
  const dispatch = useDispatch();
  // hook up current path to state
  useEffect(() => {
    dispatch({
      type: "CURRENT_PATH",
      payload: "login",
    });
  });

  const [email, setEmail] = useState("sonu123@gmail.com");
  const [password, setPassword] = useState("sonu123");
  const [error, setError] = useState("");
  // redirect once logged in
  const [redirect, setRedirect] = useState(false);
  const [values, setValues] = React.useState({
    password: '',
    showPassword: false,
  });

  //form submission
  const onSubmit = (e) => {
    e.preventDefault();
    //email regex
    const emailPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    //form validation
    if (!email || !password) {
      setError("Please enter all fields.");
    } else if (!emailPattern.test(email)) {
      setError("Please enter a valid email");
    } else {
      const data = { email, password };
      axios
        .post("/users/login", data)
        .then((response) => {
          if (response.data.message) {
            setError(response.data.message);
          } else {
            dispatch({
              type: "SIGN_IN",
              payload: response.data,
            });
            setRedirect(true);
          }
        })
        .catch((error) => {
        });
    }
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return redirect ? (
    <Redirect to="/users/dashboard" />
  ) : (
    <div className={classes.root}>
    <Container maxWidth="md">
    <Grid container style={{margin: "30px 0px"}}>
    <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
    <img src={image} alt="rest_img" width="100%" height="100%"/>
    </Grid>
    <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
    <div className={classes.form}>
    <h3 style={{textAlign:"center",fontSize: '18px'}}>Login Here</h3>
    <Form className={clsx(classes.margin, classes.textField)} fullWidth onSubmit={onSubmit}>
        <Input
          style={{fontSize:'20px',padding:'2px',letterSpacing:'2px',fontweight:'100',marginBottom:'10px'}}
          className={classes.margin}
          id="input-with-icon-textfield"
          value={email}
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="sonu.verman@albenus.com"
          fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          ),
        }}
        />
        <Input
          style={{fontSize:'20px',padding:'2px',letterSpacing:'2px',fontweight:'100',marginBottom:'10px'}}
          value={password}
          label="Password"
          type={values.showPassword ? 'text' : 'password'}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          endAdornment={
            <InputAdornment position="end" >
              <IconButton
                style={{fontSize:'20px'}}
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {values.showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
        {error ? (
          <Group>
            <ErrorMessage>{error}</ErrorMessage>
          </Group>
        ) : null}
        <Group style={{paddingTop:'22px'}}>
          <Btn variant="filled"  fullWidth size="large"
          style={{backgroundColor: deepOrange[500],color: 'white',}}>Log In</Btn>
        </Group>
        <Link to='/users/ForgotPassword'><p style={{float:'right',fontSize:'15px'}}>Forgot Password</p></Link>
      </Form>
      </div>
      </Grid></Grid>
    </Container>
    </div>
  );
}
