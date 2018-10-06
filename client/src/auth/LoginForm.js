import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Segment,
  Message
} from 'semantic-ui-react';
import { login } from './actions';
import logoImg from '../logo.svg';

class LoginForm extends Component {

  state = { error: '' }

  submit(e) {
    e.preventDefault();
    const { email, password } = e.target.elements;
    login(email.value, password.value).then(data => {

      // Success
      const { history } = this.props;
      history.push('/');
    })

    // Fail
    .catch(error => {
      console.log(error);
      this.setState({ error });
    });
  }

  render() {
    const { error } = this.props;
    console.log(error);
    return (
      <div className='login-form'>
        {/*
          Heads up! The styles below are necessary for the correct render of this example.
          You can do same with CSS, the main idea is that all the elements up to the `Grid`
          below must have a height of 100%.
        */}
        <style>{`
          body > div,
          body > div > div,
          body > div > div > div.login-form {
            height: 100%;
          }
        `}</style>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='teal' textAlign='center'>
              <Image src={logoImg} /> Log-in to your account
            </Header>
            <Form size='large'
              error={!!error}
              onSubmit={this.submit.bind(this)}>
              <Segment stacked>
                <Form.Input
                  fluid
                  icon='user'
                  iconPosition='left'
                  placeholder='E-mail address'
                  name="email"
                />
                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                  name='password'
                />

                { error ? <Message error>{ error }</Message> : null }

                <Button type="submit" color='teal' fluid size='large'>
                  Login
                </Button>
              </Segment>
            </Form>
            
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

export default withRouter(withCookies(LoginForm));
