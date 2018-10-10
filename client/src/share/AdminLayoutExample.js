import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Container, Image, List, Menu, Segment } from 'semantic-ui-react';

import TopMenuLeft from '../modules/topmenuleft';
import TopMenuRight from '../modules/topmenuright';
import logoImg from '../assets/logo.svg';
import { I18n } from 'react-i18next';

class Layout extends Component {

  render() {
    const { children } = this.props;
    return (
      <I18n ns="translations">
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
                <TopMenuLeft />

                <Menu.Item position='right'>

                  <TopMenuRight />

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
      </I18n>
    )
  }
}

export default withRouter(Layout);
