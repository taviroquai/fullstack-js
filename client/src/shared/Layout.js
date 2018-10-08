import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {
  Container,
  Dropdown,
  Image,
  List,
  Menu,
  Segment,
  Button
} from 'semantic-ui-react';
import { getUser } from '../auth/actions';
import logoImg from '../logo.svg';

class Layout extends Component {

  render() {
    const { children } = this.props;
    const logged = getUser();
    return (
      <div>
        <Menu fixed='top' inverted>
          <Container>
            <Menu.Item as={Link} header to='/'>
              <Image size='mini'
                src={logoImg}
                style={{ marginRight: '1.5em' }}
              />
              Brand
            </Menu.Item>

            <Menu.Item position='right'>
              <Dropdown item simple text={'System'}>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to='/users'>Users</Dropdown.Item>
                  <Dropdown.Item as={Link} to='/roles'>Roles</Dropdown.Item>
                  <Dropdown.Item as={Link} to='/resources'>Resources</Dropdown.Item>
                  <Dropdown.Item as={Link} to='/permissions'>Permissions</Dropdown.Item>
                  <Dropdown.Item as={Link} to='/hooks'>Hooks</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              { !logged ? (
                <Button as={Link} to='/login'>
                  Log in
                </Button>
              ) : (
                <Dropdown item simple text={logged.username}>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to='/logout'>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}

            </Menu.Item>
          </Container>
        </Menu>

        <Container text style={{
          marginTop: '7em',
          minHeight: (window.innerHeight-340) + 'px'
        }}>
          { children }
        </Container>

        <Segment inverted vertical style={{ margin: '5em 0em 0em', padding: '5em 0em' }}>
          <Container textAlign='center'>
            <Image centered size='mini' src={logoImg} />
            <List horizontal inverted divided link>
              <List.Item as='a' href='#'>
                Site Map
              </List.Item>
              <List.Item as='a' href='#'>
                Contact Us
              </List.Item>
              <List.Item as='a' href='#'>
                Terms and Conditions
              </List.Item>
              <List.Item as='a' href='#'>
                Privacy Policy
              </List.Item>
            </List>
          </Container>
        </Segment>
      </div>
    )
  }
}

export default withRouter(Layout);