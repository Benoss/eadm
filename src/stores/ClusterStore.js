import alt from '../alt';
import clusterActions from '../actions/ClusterActions'
import ElasticClients from '../utils/EsClients'
import elasticClientActions from '../actions/ElasticClientActions'
import elasticClientStore from '../stores/ElasticClientStore'


class ClusterStore {
  constructor() {
    this.bindAction(elasticClientActions.setActiveClient, this.onActiveClient)
    this.bindAction(elasticClientActions.refreshClients, this.onRefreshClients)
    this.bindAction(clusterActions.refreshStats, this.onRefreshStats)
    this.bindAction(clusterActions.setAutoRefresh, this.onSetAutoRefresh)
    this.bindAction(clusterActions.stopAutoRefresh, this.onStopAutoRefresh)


    this.esClient = null
    this.stats = null
    this.statsDt = null
    this.pstats = null
    this.pstatsDt = null
    this.error = null
    this.refreshId = null
    this.refreshTime = 5 * 1000
  }

  _es() {
    return ElasticClients.getClient(this.esClient)
  }
  onRefreshClients() {
    this.waitFor(elasticClientStore.dispatchToken)
    if (elasticClientStore.getState().active_client !== undefined && elasticClientStore.getState().active_client !== null) {
      this.esClient = elasticClientStore.getState().active_client
    }
  }

  onSetAutoRefresh(refreshTime){
    if (refreshTime) {
      this.setState({'refreshTime': refreshTime})
    }
    if (this.refreshId) {
      this.onStopAutoRefresh()
    }
    this.setState({'refreshId': setInterval(clusterActions.refreshStats.defer, this.refreshTime)})
  }
  onStopAutoRefresh(){
    clearInterval(this.refreshId)
    this.setState({'refreshId': null})
  }

  onActiveClient() {
    this.waitFor(elasticClientStore.dispatchToken)
    this.esClient = elasticClientStore.getState().active_client
    this.onRefreshStats()
  }

  onRefreshStats() {
    if (!this._es()) {
      this.setState({'error': "No connection to host"})
    }
    else {
       this._es().indices.stats().then((body) => {
         if (this.statsDt) {
           this.setState({'pstats': this.stats})
           this.setState({'pstatsDt': this.statsDt})
         }
         else {
           this.setState({'pstats': body})
           this.setState({'pstatsDt': Date.now()})
         }
         this.setState({'stats': body})
         this.setState({'statsDt': Date.now()})
       }, (error) => {
              this.setState({'error': JSON.stringify(error, null, ' ')})
              this.setState({'stats': null})
            })
    }
  }

}

export default alt.createStore(ClusterStore)
