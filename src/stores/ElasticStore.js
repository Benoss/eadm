import alt from '../alt';
import elasticActions from '../actions/ElasticActions'
import elasticClientActions from '../actions/ElasticClientActions'
import elasticClientStore from '../stores/ElasticClientStore'
import ElasticClients from '../utils/EsClients'
import elasticsearch from "elasticsearch"

class ElasticStore {
  constructor() {
    this.bindAction(elasticActions.doQuery, this.onDoQuery)
    this.bindAction(elasticActions.codeChanged, this.onCodeChanged)
    this.bindAction(elasticClientActions.setActiveClient, this.onActiveClient)
    this.bindAction(elasticClientActions.refreshClients, this.onRefreshClients)

    /** @type {elasticsearch.Client} */
    this.esClient = null
    this.code = "{\n" +
      "\"query\":{\n" +
      " \"mmatch_all\" : { }}\n" +
      "}\n"

    this.last_response = {}
    this.last_error = null
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

  onActiveClient() {
    this.waitFor(elasticClientStore.dispatchToken)
    this.esClient = elasticClientStore.getState().active_client
  }

  onCodeChanged(newCode) {
    this.setState({'code': newCode})
  }

  onDoQuery() {
    if (!this._es()) {
      return false
    }
    let code = ""
    try {
      code = JSON.parse(this.code)
      this.setState({'last_error': null})
    } catch (e) {
      this.setState({'last_error': "Json parse error:\n " + e})
    }
    if (this.last_error === null) {
      this._es().indices.validateQuery({'source': this.code, 'explain': true}).then((body) => {
        if (body.valid) {
          this._es().search({
            'body': code
          }).then((body) => {
            this.setState({'last_response': body})
          }, (error) => {
            this.setState({'last_error': JSON.stringify(error, null, ' ')})
            this.setState({'last_response': {}})
          })
        }
        else {
          this.setState({'last_response': body})
          this.setState({'last_error': null})
        }

      }, (error) => {
        this.setState({'last_error': JSON.stringify(error, null, ' ')})
      })


    }
  }
}

export default alt.createStore(ElasticStore)
