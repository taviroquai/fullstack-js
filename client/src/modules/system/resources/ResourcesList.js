import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Header,
  Table,
  Message,
  Button,
  Icon,
  Input,
  Loader
} from 'semantic-ui-react';
import Layout from '../../../share/AdminLayoutExample';
import { getResources } from './actions';
import { NamespacesConsumer } from 'react-i18next';
import Store, { withStore } from 'react-observable-store';

Store.add('sysresourceslist', {
  sysresourceslist: {
    loading: false,
    total: 0,
    query: '',
    resources: [],
    errors: null
  }
});

// Helpers
const put = (data) => Store.update('sysresourceslist', data);

class ResourcesList extends Component {

  reload() {
    const { query } = this.props;
    put({ loading: true});
    getResources({ query }).then((resources, total) => {
      put({
        loading: false,
        errors: null,
        resources,
        total
       });
    }).catch(errors => {
      put({ loading: false, errors, resources: [] });
    });
  }

  componentDidMount() {
    const { resources } = this.props;
    if (!resources.length) this.reload();
  }

  onSearch(query) {
    put({ query });
  }

  render() {
    const { loading, errors, resources, query } = this.props;
    let filtered = resources;

    // Filter by resource
    if (query) {
      const regex = new RegExp(query, 'ig');
      filtered = filtered.filter(r => regex.test(r));
    }

    return (
      <NamespacesConsumer ns="translations">
        { (t, { i18n }) => (
          <Layout>
            <Header as='h1'>{t('resources')}</Header>

            { errors && <Message error size='mini'
              icon='exclamation triangle'
              list={errors.map(e => t(e.message))}
            /> }

            { resources && (
              <Table size='small'>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>
                      {t('system_keyword')}
                      <Input style={{fontSize: '.8rem', float: 'right'}}
                        placeholder={t('search')}
                        value={query}
                        loading={loading}
                        onChange={e => this.onSearch(e.target.value)}
                      />
                    </Table.HeaderCell>
                    <Table.HeaderCell width={1}>
                      { loading ? (
                        <Loader size='mini' active inline='centered' />
                      ) : (
                        <Button color='orange' icon
                          size='mini'
                          title={t('refresh')}
                          onClick={e => this.reload()}>
                          <Icon name="redo" />
                        </Button>
                      ) }
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  { filtered.map((resource, i) => (
                    <Table.Row key={i}>
                      <Table.Cell>{resource}</Table.Cell>
                      <Table.Cell width={1}>
                        <Button.Group size='mini'>
                          <Button primary icon
                            size='mini'
                            disabled={loading}
                            as={Link} to={'/system/resources/edit/'+resource}>
                            <Icon name="list" />
                          </Button>
                        </Button.Group>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>

              </Table>
            )}

          </Layout>
        )}
      </NamespacesConsumer>
    )
  }
}

export default withStore('sysresourceslist', ResourcesList);
