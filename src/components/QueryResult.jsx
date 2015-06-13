import React from 'react'
import boot from 'react-bootstrap'
import nav from 'react-router-bootstrap'
import JsonView from "../components/JsonView"
import TableView from "../components/TableView"
import TableAggView from "../components/TableAggView"
import YAML from 'js-yaml'


export default React.createClass({
  displayName: 'QueryResult',

  render() {
    if (this.props.error) {
      return (
        <div className={"resultError"}>
          <pre>{this.props.error}</pre>
        </div>
      )
    }
    else {
      let errorClass = 'queryResult'
      if (this.props.result && typeof this.props.result.valid !== 'undefined' && !this.props.result.valid) {
        errorClass = "queryResult resultError"
      }

      let tabRender = <div></div>
      switch (this.props.activeTab || 'raw') {
        case 'raw':
          tabRender = <pre>{JSON.stringify(this.props.result, null, ' ')}</pre>
          break;
        case 'jsonview':
          tabRender = <JsonView data={this.props.result}/>
          break;
        case 'yaml':
          tabRender = <pre>{YAML.safeDump(this.props.result)}</pre>
          break;
        case 'resultTable':
          tabRender = <TableView data={this.props.result}/>
          break;
        case 'aggTable':
          tabRender = <TableAggView data={this.props.result}/>
          break;
      }


      return (
        <div className={errorClass}>
          <boot.Nav bsStyle='tabs'>
            <nav.NavItemLink to="/query/raw">Raw</nav.NavItemLink>
            <nav.NavItemLink to="/query/jsonview">JsonView</nav.NavItemLink>
            <nav.NavItemLink to="/query/yaml">YAML</nav.NavItemLink>
            <nav.NavItemLink to="/query/resultTable">Result Table</nav.NavItemLink>
            <nav.NavItemLink to="/query/aggTable">Agg Table</nav.NavItemLink>
          </boot.Nav>
          {tabRender}
        </div>
      )
    }
  }
})
