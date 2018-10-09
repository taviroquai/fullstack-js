import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'semantic-ui-react';
import loc from '../../locales/en/translations';

class TopMenuItem extends Component {

  render() {
    return (
      <React.Fragment>

        <Menu.Item as={Link} to='/'>
          <Icon name="chart line" className="mob-only" />
          <span className="desk-only">{loc.dashboard}</span>
        </Menu.Item>

      </React.Fragment>
    )
  }
}

export default TopMenuItem;
