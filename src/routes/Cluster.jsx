import React from 'react'
import nav from "react-router-bootstrap"
import clusterStore from '../stores/ClusterStore'
import clusterActions from '../actions/ClusterActions'
import ClusterStats from '../components/ClusterStats'

export default React.createClass({
  displayName: 'Cluster',


  getInitialState() {
    return clusterStore.getState()

  },
  componentDidMount() {
    clusterStore.listen(this.onChange)
  },
  componentWillUnmount() {
    clusterStore.unlisten(this.onChange)
  },
  onChange() {
    this.setState(this.getInitialState())
  },

  render() {
    if (!this.state.esClient) {
      return (<div>{this.state.error}</div>)
    }
    else {
      if (!this.state.stats) {
        return (<div>Refreshing stats ...</div>)
      }
      else {
        return (
          <div>
            <ClusterStats
              stats={this.state.stats}
              pstats={this.state.pstats}
              statsDt={this.state.statsDt}
              pstatsDt={this.state.pstatsDt}
              />
          </div>

        )
      }

    }
  }
})
