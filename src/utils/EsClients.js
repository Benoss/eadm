import elasticsearch from "elasticsearch"
import objectEntries from '../utils/ObjectEntries'
import elasticClientActions from '../actions/ElasticClientActions'

function _get_connection_string(url, port, protocol) {
  return protocol + url + ":" + port
}

class ElasticClients {
  constructor() {
    /** @type {Object[]} */
    this.clients = {}
  }

  /**
   *
   * @param {string} name
   * @returns {elasticsearch.Client}
   */
  getClient(name) {
    if (this.clients[name] !== undefined) {
      return this.clients[name].client
    }
    else {
      return null
    }
  }

  isOnline(name) {
    if (this.clients[name] !== undefined) {
      return this.clients[name].online
    }
    else {
      return false
    }

  }

  _getClient(protocol, host, port) {
    return new elasticsearch.Client({
      host: {
        protocol: protocol.replace("://", ""),
        host: host,
        port: port,
      }
    })
  }

  addClient(args) {
    let [name, url, port, protocol] = args
    let client = null
    name = name || ''
    if (!url) {
      url = '127.0.0.1'
    }
    if (!port) {
      port = '9200'
    }
    if (!protocol) {
      protocol = 'http://'
    }
    this.clients[name] = {
      "online": false,
      "connection_string": null,
      "client": null,
      "host": url,
      "port": port,
      "protocol": protocol,
      "name": name
    }
    let connection_string = _get_connection_string(
      this.clients[name].host,
      this.clients[name].port,
      this.clients[name].protocol
    )

    this.clients[name].connection_string = connection_string

    return new Promise((resolve, reject) => {
      var _resolve = resolve
      var _reject = reject
      this._checkConnection(connection_string).then(ok => {
          client = this._getClient(protocol, url, port)
          this.clients[name].client = client
          this.clients[name].online = true
          elasticClientActions.onlineStatusChanged(name, true)
          _resolve(client)
        }, error => {
          this.clients[name].client = null
          this.clients[name].online = false
          elasticClientActions.onlineStatusChanged(name, false, error)
          _reject(error)
        }
      )
    })
  }

  checkConnections() {
    return new Promise((resolve, reject) => {
      let promises = []
      for (let [key, client_info] of objectEntries(this.clients)) {
        let p = this._checkConnection(client_info.connection_string)
        promises.push(p)
        p.then((changed) => {
          if (changed) {

            this.clients[client_info.name].client = this._getClient(
              client_info.protocol,
              client_info.host,
              client_info.port
            )
            this.clients[client_info.name].online = true
            elasticClientActions.onlineStatusChanged(name, true)
          }
          else {
            this.clients[name].client = null
            this.clients[name].online = false
            elasticClientActions.onlineStatusChanged(name, false, error)
          }
        }, (error) => {

        })
      }
      promises.map(() => {
        resolve("ok")
      })
    })
  }

  _checkConnection(connection_string, previous_online) {
    return new Promise((resolve, reject) => {
      let oXHR = new XMLHttpRequest();
      oXHR.open("GET", connection_string, true);
      oXHR.onerror = (e) => {
        reject("Error connecting to server")
      };
      oXHR.onreadystatechange = (oEvent) => {
        if (oXHR.readyState === 4) {
          if (oXHR.status === 200) {
            if (previous_online) {
              resolve(false)
            } else {
              resolve(true)
            }
          } else {
            if (oXHR.statusText == '') {
              reject("Error connecting to server, look at browser console for more info. Server is not running or CORS is not set up  in elasticsearch config")
            }
            else {
              reject("Error", oXHR.statusText)
            }
          }
        }
      };
      oXHR.send(null);
    })

  }

}

export default new ElasticClients();
