import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import constants from '../helpers/constants'
import { withRouter } from "react-router-dom";

const LoginSignup = (props) => {
    let [credentialScreenState, updateCredentialScreenState] = useState({
        showLogin: true,
        errorMessage: undefined
    })

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(response => {
            return response;
        }, error => {
            if (error.response.status === 401) {
                updateCredentialScreenState({ ...credentialScreenState, errorMessage: error.response.data.message })
            }
            return error;
        });
        return () => {
            axios.interceptors.response.eject(interceptor);
        }
    })

    const ToggleCredentialScreen = () => {
        updateCredentialScreenState({ ...credentialScreenState, showLogin: !credentialScreenState.showLogin })
    }

    const onSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const _url = credentialScreenState.showLogin ? '/auth' : '/auth/signup';
        axios.post(`${constants.server}${_url}`, {
            username: e.target.username.value,
            password: e.target.password.value
        }, { withCredentials: true }).then((response) => {
            response.status === 200 && props.history.push("/");

        })
    }

    const getMessage = () => {
        const _message = credentialScreenState.showLogin ? constants.signupQuestion : constants.loginQuestion
        const _linkText = credentialScreenState.showLogin ? constants.signupNow : constants.loginNow
        return (<Form.Label> {_message} <span onClick={ToggleCredentialScreen} className='signup'>{_linkText}</span></Form.Label>)
    }
    return (
        <section className='auth_container'>
    <h1>{credentialScreenState.showLogin?'Login':'Sign Up'}</h1>
    {credentialScreenState.errorMessage?<Alert variant='danger'>{credentialScreenState.errorMessage}</Alert>:''}
    <Form  onSubmit={onSubmit}>
      <Form.Group>
        <Form.Label>Username</Form.Label>
        <Form.Control name='username' type="text" placeholder="Username (min. 3 characters)" pattern=".{3,}"/>
      </Form.Group>

      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control name='password' type="password" placeholder="Password (min. 3 characters)" pattern=".{3,}"/>
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
      <Form.Group>
        {getMessage()}
      </Form.Group>
</Form>
</section>
    )
}

export default withRouter(LoginSignup);