import React from 'react'
import boot from 'react-bootstrap'
import nav from 'react-router-bootstrap'
import elasticClientActions from '../actions/ElasticClientActions'
import elasticClientStore from '../stores/ElasticClientStore'
import ElasticClients from '../utils/EsClients'

export default React.createClass({
  displayName: 'Header',
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
  setActive(item){
    elasticClientActions.setActiveClient(item.name)
  },
  isActive(item){
    return this.state.active_client == item.name
},
  handleSelect(selectedKey) {
    return
  },
  render() {
    let dropDownClass = ''
    let active_client = this.state.client_list[this.state.active_client]
    if (active_client) {
      switch (active_client.color) {
        case 'danger':
          dropDownClass = 'redBackground'
          break;
        case 'warning':
          dropDownClass = 'yellowBackground'
          break;
        case 'success':
          dropDownClass = 'greenBackground'
          break;
        case 'info':
          dropDownClass = 'bluedBackground'
          break;
      }
    }
    return (
      <boot.Navbar staticTop brand='EADM' className="header">
        <boot.Nav>
          <nav.NavItemLink eventKey={1} to="home">Home</nav.NavItemLink>
          <nav.NavItemLink eventKey={2} to="query">Query</nav.NavItemLink>
          <nav.NavItemLink eventKey={4} to="stats">Stats</nav.NavItemLink>
        </boot.Nav>
        <boot.Nav right>
          <boot.DropdownButton className={dropDownClass} eventKey={3} title={this.state.active_client || 'Config Cluster'}>
          {Object.keys(this.state.client_list).map(function (key) {
            var item = this.state.client_list[key]
            return (
            <boot.MenuItem onSelect={this.handleSelect} eventKey={key} key={key} active={this.state.active_client == item.name} onClick={this.setActive.bind(null, item)}>{item.name}</boot.MenuItem>
            )
           }, this)}
            <boot.MenuItem divider/>
            <nav.MenuItemLink to="config"> Cluster Config</nav.MenuItemLink>
          </boot.DropdownButton>

        </boot.Nav>
      </boot.Navbar>
    )
  }
})
