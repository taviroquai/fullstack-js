import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Container, Image, List, Menu, Segment } from 'semantic-ui-react';
import ModuleLoader from '../ModuleLoader';

import logoImg from '../assets/logo.svg';
import { NamespacesConsumer } from 'react-i18next';

class Layout extends Component {

  render() {
    const { children } = this.props;
    return (
      <NamespacesConsumer ns="translations">
        { (t, { i18n }) => (
          <div>
            <Menu fixed='top' inverted>
              <Container>
                <Menu.Item as={Link} header to='/'>
                  <Image size='mini'
                    src={logoImg}
                    style={{ marginRight: '1.5em' }}
                  />
                  <span className="desk-only">{t('brand')}</span>
                </Menu.Item>

                { ModuleLoader("TopMenuLeft") }
                <Menu.Item position='right'>
                  { ModuleLoader("TopMenuRight") }
                </Menu.Item>

              </Container>
            </Menu>

            <Container text style={{
              marginTop: '7em',
              minHeight: (window.innerHeight-340) + 'px'
            }}>
              { children }
            </Container>

            <Menu fixed='bottom' inverted>
              <Segment inverted style={{ width: '100%' }}>
                <Container textAlign='center'>
                  <Image centered size='mini' src={logoImg} />
                  <List horizontal inverted divided link>
                    <List.Item as='a' href='#'>
                      {t('copyright')} { (new Date()).getFullYear() }
                    </List.Item>
                  </List>
                </Container>
              </Segment>
            </Menu>

          </div>
        )}
      </NamespacesConsumer>
    )
  }
}

export default withRouter(Layout);
