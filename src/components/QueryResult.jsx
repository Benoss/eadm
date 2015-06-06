import React from 'react'
import boot from 'react-bootstrap'
import JsonView from "../components/JsonView"
import TableView from "../components/TableView"
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

      return (
        <div className={errorClass} >
          <boot.TabbedArea defaultActiveKey={1} animation={false}>
            <boot.TabPane eventKey={1} tab='Raw' >
              <pre>{JSON.stringify(this.props.result, null, ' ')}</pre>
            </boot.TabPane>
            <boot.TabPane eventKey={2} tab='JsonView'>
              <JsonView data={this.props.result}/>
            </boot.TabPane>
            <boot.TabPane eventKey={3} tab='YAML'>
              <pre>{YAML.safeDump(this.props.result)}</pre>
            </boot.TabPane>
            <boot.TabPane eventKey={4} tab='Table'>
              <TableView data={this.props.result} />
            </boot.TabPane>
          </boot.TabbedArea>
        </div>
      )
    }
  }
})
