import React from 'react'
import nav from "react-router-bootstrap"
import boot from 'react-bootstrap'
import elasticStore from '../stores/ElasticStore'
import QueryResult from "../components/QueryResult"
import QueryView from "../components/QueryView"
import SplitPane from '../utils/SplitPane'

export default React.createClass({
  displayName: 'Query',

  getInitialState() {
    return elasticStore.getState()
  },
  componentDidMount() {
    elasticStore.listen(this.onChange)
  },
  componentWillUnmount() {
    elasticStore.unlisten(this.onChange)
  },
  onChange() {
    this.setState(this.getInitialState())
  },

        //<h1>
        //  Query
        //</h1>
        //<boot.Col xs={12} className="queryContainer">

        //        </boot.Col>

  render() {
    return (
      <div>
          <SplitPane orientation="horizontal">
            <QueryView  />
            <QueryResult result={this.state.last_response} error={this.state.last_error}/>
          </SplitPane>
      </div>

    )
  }
})
