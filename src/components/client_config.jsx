import React from 'react'
import elasticClientActions from '../actions/ElasticClientActions'
import elasticClientStore from '../stores/ElasticClientStore'
import objectEntries from '../utils/ObjectEntries'
import boot from 'react-bootstrap'

export default React.createClass({
  displayName: 'ClientConfigComponent',
  getInitialState() {
    return elasticClientStore.getState()
  },

  componentDidMount() {
    elasticClientStore.listen(this.onChange)
    elasticClientActions.refreshClients()
  },

  componentWillUnmount() {
    elasticClientStore.unlisten(this.onChange)
  },

  onChange() {
    this.setState(this.getInitialState())
  },

  validateName() {
    this.setState({
      name: this.refs.name.getValue()
    });
  },
  validationName() {
    let name = this.state.name || ''
    if (name === '') {
      return 'error'
    }
    for (let client_id in this.state.client_list) {
      if (client_id == name) {
        return 'error'
      }
    }
    return 'success'
  },
  addHost() {
    elasticClientActions.addClient([
      (() => {
        if (!this.refs.name.getValue())
        {return (Math.random() + 1).toString(36).substring(7)}
        else
        {return this.refs.name.getValue()}
      })(),
      (() => {
        if (!this.refs.url.getValue())
        {return '127.0.0.1'}
        else
        {return this.refs.url.getValue()}
      })(),
      (() => {
        if (!this.refs.port.getValue())
        {return '9200'}
        else
        {return this.refs.port.getValue()}
      })(),
      (() => {
        if (!this.refs.protocol.getValue())
        {return 'http://'}
        else
        {return this.refs.protocol.getValue()}
      })()
    ])
  },
  removeHost(item){
    this.refs.protocol.refs.input.getDOMNode().value= item.protocol
    this.refs.url.refs.input.getDOMNode().value= item.url
    this.refs.port.refs.input.getDOMNode().value= item.port
    this.refs.name.refs.input.getDOMNode().value= item.name
    elasticClientActions.removeClient(item.name)
  },

  isActive(item){
    return (item.name == this.state.active_client)
  },
  setActive(item){
    elasticClientActions.setActiveClient(item.name)
  },

  render() {
    return (
      <div>
        <form>
          <boot.Col xs={3}>
            <boot.Input ref="name" type='text' addonBefore='Name' placeholder='Enter unique name'
              onChange={this.validateName}
              bsStyle={this.validationName()} />
          </boot.Col>
          <boot.Col xs={2}>
            <boot.Input ref="protocol" type='text' addonBefore='Protocol' placeholder='http://' />
          </boot.Col>
          <boot.Col xs={3}>
            <boot.Input ref="url" type='text' addonBefore='Url' placeholder='127.0.0.1' />
          </boot.Col>
          <boot.Col xs={2}>
            <boot.Input ref="port" type='text' addonBefore='Port' placeholder='9200' />
          </boot.Col>
          <boot.Col xs={1}>
            <boot.ButtonInput bsStyle='primary' onClick={this.addHost}>Add Client</boot.ButtonInput>
          </boot.Col>
        </form>
        <boot.Table striped bordered condensed hover>
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th>Name</th>
              <th>Url</th>
              <th>Cluster</th>
              <th>Version</th>

            </tr>
          </thead>
          <tbody>
          {Object.keys(this.state.client_list).map(function (key) {
            var item = this.state.client_list[key]
            return (
              <tr className={item.color} key={key}>
                <td>
                  <boot.Button onClick={this.removeHost.bind(null, item)}><boot.Glyphicon className="text-danger" glyph='remove' /></boot.Button>
                </td>
                <td>
                  <boot.Button onClick={this.setActive.bind(null, item)}><boot.Glyphicon className="text-success" glyph='ok' /></boot.Button>
                </td>
                <td>{item.name}</td>
                <td>{ elasticClientStore.get_connection_string(item)} </td>
                <td  >{item.health.cluster_name}</td>
                <td>v:{item.info.version.number}</td>
              </tr>
            )
          }, this)}
          </tbody>
        </boot.Table>
        Active: {this.state.active_client}
      </div>
    )
  }
})
