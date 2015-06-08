import alt from '../alt';
import elasticClientActions from '../actions/ElasticClientActions'
import elasticsearch from "elasticsearch"
import objectEntries from '../utils/ObjectEntries'
import ElasticClients from '../utils/EsClients'


class ElasticClientStore {
  constructor() {
    this.bindAction(elasticClientActions.addClient, this.onAddClient)
    this.bindAction(elasticClientActions.removeClient, this.onRemoveClient)
    this.bindAction(elasticClientActions.updateClient, this.onUpdateClient)
    this.bindAction(elasticClientActions.setActiveClient, this.onSetActiveClient)
    this.bindAction(elasticClientActions.refreshClients, this.onRefreshClients)
    this.bindAction(elasticClientActions.loadListFromJson, this.onLoadListFromJson)
    this.bindAction(elasticClientActions.onlineStatusChanged, this.onOnlineStatusChanged)

    this.client_list = {}
    this.active_client = null

    this.on('init', () => {

    })
    this.on('serialize', () => {

    })

    this.on('bootstrap', () => {
      let a = this.active_client
      this.active_client = null
      for (let [key, client_def] of objectEntries(this.client_list)) {
        this._addInitialClient(client_def, a)
      }
    })
  }

  static _getDefaultObject(name, url, port, protocol) {
    return {
      "name": name,
      "protocol": protocol || "http://",
      "url": url || "127.0.0.1",
      "port": port || "9200",
      "client": null,
      "info": {version: {}},
      "health": {cluster_name: ""},
      "color": "info",
      "online": false,
      "connection_error": null
    }
  }

  _setFirstActive() {
    if (this.active_client === null || !(this.active_client in this.client_list)) {
      let found
      for (let first in this.client_list) {
        this.setState({'active_client': first})
        found = true
        break;
      }
      if (!found) {
        this.setState({'active_client': null})
      }

    }
  }

  _refreshClient(client_def) {
    if (ElasticClients.isOnline(client_def.name)) {
      this._getInfo(client_def)
      this._getHealth(client_def)
      this._setClientDefState(client_def)
    }
    else {
      client_def.color = "danger"
    }
  }

  static get_connection_string(client_def) {
    return client_def.protocol + client_def.url + ":" + client_def.port
  }


  _getInfo(client_def) {
    ElasticClients.getClient(client_def.name).info().then(body => {
      client_def.info = body
      this._setClientDefState(client_def)
    }, error => {
      client_def.color = "danger"
      this._setClientDefState(client_def)
    })
  }

  _setClientDefState(client_def) {
    let clients = this.client_list
    clients[client_def.name] = client_def
    this.setState({"client_list": clients})
  }

  _getHealth(client_def) {
    ElasticClients.getClient(client_def.name).cluster.health().then(body => {
      client_def.health = body
      if (body.status == "green") {
        client_def.color = "success"
      }
      if (body.status == "yellow") {
        client_def.color = "warning"
      }
      if (body.status == "red") {
        client_def.color = "danger"
      }
      this._setClientDefState(client_def)
    }, error => {
      console.log(error.message)
      client_def.color = "danger"
      this._setClientDefState(client_def)
    })

  }

  _addInitialClient(client_def, a) {
    ElasticClients.addClient([client_def.name, client_def.url, client_def.port, client_def.protocol]).then((ok) => {
        this._refreshClient(this.client_list[client_def.name])
        if (client_def.name == a) {
          elasticClientActions.setActiveClient.defer(a)
        }
      }, (error) => {
        if (client_def.name == a) {
          elasticClientActions.setActiveClient.defer(a)
        }

      }
    )
  }

  onOnlineStatusChanged([name, online, error]) {
    if (this.client_list[name] !== undefined) {
      this.client_list[name].online = online
      this.client_list[name].connection_error = error
      this.client_list[name].color = "danger"
      this.client_list[name].health.cluster_name = error
      this._refreshClient(this.client_list[name])
    }
  }

  onAddClient(args) {
    let [name, url, port, protocol] = args.args
    this.client_list[name] = ElasticClientStore._getDefaultObject(name, url, port, protocol)
    if (args.error) {
      this.client_list[name].online = false
      this.client_list[name].connection_error = args.error
      this.client_list[name].color = "danger"
      this.client_list[name].health.cluster_name = args.error
    }
    else {
      this._setFirstActive()
      this.onRefreshClients()
    }
    localStorage.setItem('client_list', alt.takeSnapshot('ElasticClientStore'))

  }

  onRemoveClient(clientName) {
    delete this.client_list[clientName]
    this._setFirstActive()
    localStorage.setItem('client_list', alt.takeSnapshot('ElasticClientStore'))
  }

  onUpdateClient(duration) {
    return
  }

  onSetActiveClient(name) {
    if (name === undefined) {
      this._setFirstActive()
    }
    else {
      this.setState({'active_client': name})
    }
    localStorage.setItem('client_list', alt.takeSnapshot('ElasticClientStore'))
  }

  onRefreshClients(duration) {
    for (let [key, client_def] of objectEntries(this.client_list)) {
      this.client_list[key].color = "info"
      this._refreshClient(client_def)
      this._setClientDefState(client_def)
    }
  }

  onLoadListFromJson(stored_state) {

    stored_state = localStorage.getItem('client_list');

    if (stored_state === null) {
      let client_def = ElasticClientStore._getDefaultObject("localhost")
      this.client_list["localhost"] = client_def
      this._addInitialClient(client_def)
      this.active_client = "localhost"
    }
    else {
      alt.bootstrap(stored_state)
    }
  }
}

export default alt.createStore(ElasticClientStore, 'ElasticClientStore')
