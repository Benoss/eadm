import alt from '../alt';
import ElasticClients from '../utils/EsClients'
import ElasticActions from '../actions/ElasticActions'

class ElasticClientActions {
  constructor() {
    this.generateActions('updateClient') //
    this.generateActions('loadListFromJson') // Default will read from local storage
  }

  setActiveClient(name){
    this.dispatch(name)
    ElasticActions.doQuery()
  }


  removeClient(name){
    this.dispatch(name)
  }

  onlineStatusChanged(name, online, error) {
    this.dispatch([name, online, error])
  }

  refreshClients() {
    ElasticClients.checkConnections().then( (ok) => {
        this.dispatch()
      }, (error) => {
        this.dispatch(error)
      }
    )
  }

  addClient(args) {
    ElasticClients.addClient(args).then( (ok) => {
        this.dispatch({'args':args, 'error':false})
      }, (error) => {
        this.dispatch({'args':args, 'error':error})
      }
    )
  }
}

export default alt.createActions(ElasticClientActions)

