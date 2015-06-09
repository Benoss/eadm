import alt from '../alt';
import elasticActions from '../actions/ElasticActions'
import elasticClientActions from '../actions/ElasticClientActions'
import elasticClientStore from '../stores/ElasticClientStore'
import ElasticClients from '../utils/EsClients'
import elasticsearch from "elasticsearch"
import ElasticActions from '../actions/ElasticActions'
import YAML from 'js-yaml'

class ElasticStore {
  constructor() {
    this.bindAction(elasticActions.doQuery, this.onDoQuery)
    this.bindAction(elasticActions.codeChanged, this.onCodeChanged)
    this.bindAction(elasticClientActions.setActiveClient, this.onActiveClient)
    this.bindAction(elasticClientActions.refreshClients, this.onRefreshClients)
    this.bindAction(elasticActions.reformatCode, this.onReformatCode)
    this.bindAction(elasticActions.refreshIndexes, this.onRefreshIndexes)
    this.bindAction(elasticActions.setType, this.onSetType)
    this.bindAction(elasticActions.setIndex, this.onSetIndex)
    this.bindAction(elasticActions.refreshTypes, this.onRefreshTypes)
    this.bindAction(elasticActions.codeChangedYaml, this.onCodeChangedYaml)
    this.bindAction(elasticActions.jsonTabSelected, this.onJsonTabSelected)
    this.bindAction(elasticActions.yamlTabSelected, this.onYamlTabSelected)

    /** @type {elasticsearch.Client} */
    this.esClient = null
    this.code = '' //JSON.stringify({'query': {'match_all': {}}}, null, ' ')
    this.codeYaml = "query:\n    match_all: {}"

    this.last_response = {}
    this.last_error = null
    this.current_index = ''
    this.current_type = ''
    this.indexes = []
    this.aliases = []
    this.types = []
    this.indexesDropdown = []
  }

  _es() {
    return ElasticClients.getClient(this.esClient)
  }

  onReformatCode() {
    let code = ""
    try {
      code = JSON.parse(this.code)
      this.setState({'code': JSON.stringify(code, null, ' ')})
      this.setState({'last_error': null})
    } catch (e) {
      this.setState({'last_error': "Json parse error:\n " + e})
    }
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
    this.setState({'codeYaml': null})
  }

  onJsonTabSelected(){
    if (!this.code && this.codeYaml) {
      this.setState({'code': JSON.stringify(YAML.safeLoad(this.codeYaml), null, ' ')})
    }
  }

    onYamlTabSelected(){
    if (!this.codeYaml && this.code) {
      this.setState({'codeYaml': YAML.safeDump(JSON.parse(this.code))})
    }
  }


  onCodeChangedYaml(newCode) {
    this.setState({'codeYaml': newCode})
    this.setState({'code': null})
  }

  _populateIndexAndType(params) {
    if (this.current_index) {
      params['index'] = this.current_index
    }
    if (this.current_type) {
      params['type'] = this.current_type
    }
    return params
  }

  onDoQuery() {
    if (!this._es()) {
      return false
    }
    let code = ""
      if (this.code) {
        try {
          code = JSON.parse(this.code)
          this.setState({'last_error': null})
          code = this.code
        } catch (e) {
          this.setState({'last_error': "Json parse error:\n " + e})
        }
    }
    else if (this.codeYaml){
       try {
          code = JSON.stringify(YAML.safeLoad(this.codeYaml))
          this.setState({'last_error': null})
        } catch (e) {
          this.setState({'last_error': "Yaml parse error:\n " + e})
        }
      }
    else {
        this.setState({'last_error': 'Empty Query'})
        this.setState({'codeYaml': ''})
        this.setState({'code': ''})
      }
    if (this.last_error === null) {
      let validate_params = {'source': code, 'explain': true}
      validate_params = this._populateIndexAndType(validate_params)
      this._es().indices.validateQuery(validate_params).then((body) => {
        if (body.valid) {
          let search_params = {'body': code}
          search_params = this._populateIndexAndType(search_params)
          this._es().search(search_params).then((body) => {
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

  onRefreshIndexes() {
    if (!this._es()) {
      return false
    }
    let indexes = []
    let aliases = []
    let indexesDropdown = []
    this._es().indices.getAliases().then((body) => {
      _.forEach(body, (value, key) => {
        indexes.push(key)
        for (let alias in value.aliases) {
          aliases.push(alias)
        }
      })
      aliases.sort()
      aliases = _.uniq(aliases, true)
      _.forEach(aliases, (alias) => {
        indexesDropdown.push({value: alias, label: alias + " - Alias"})
      })
      indexes.sort()
      indexes = _.uniq(indexes, true)
      _.forEach(indexes, (index) => {
        indexesDropdown.push({value: index, label: index + " - Index"})
      })
      this.setState({'indexes': indexes})
      this.setState({'aliases': aliases})
      this.setState({'indexesDropdown': indexesDropdown})
      this.emitChange()
    })
  }

  onSetIndex(name) {
    this.setState({'current_index': name})
  }

  onRefreshTypes() {

  }

  onSetType(name) {
    this.setState({'current_type': name})
  }
}

export default alt.createStore(ElasticStore)
