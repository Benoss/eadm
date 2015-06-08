import React from 'react'
import boot from 'react-bootstrap'
import elasticActions from '../actions/ElasticActions'
import elasticStore from '../stores/ElasticStore'
import _ from 'lodash'
import YAML from 'js-yaml'
import AceEditor  from 'react-ace-wrapper'
import Select from 'react-select'

require('brace/mode/json');
require('brace/theme/github');

export default React.createClass({
  displayName: 'QueryView',

  getInitialState() {
    return elasticStore.getState()
  },
  componentDidMount() {
    elasticStore.listen(this.onChange)
    this.debouncedSend = _.debounce(this.debouncedSend, 200);
    this.debouncedSend()
  },
  componentWillUnmount() {
    elasticStore.unlisten(this.onChange)
  },
  onChange() {
    this.setState(this.getInitialState())
  },

  setType() {
    elasticActions.setType(this.refs.type.getValue())
    this.debouncedSend()
  },

  setIndex(newValue) {
    elasticActions.setIndex(newValue)
    this.debouncedSend()
  },

  debouncedSend() {
    this.sendQuery()
  },

  updateCode: function (newCode) {
    elasticActions.codeChanged(newCode)
    this.debouncedSend()
  },
  updateCodeYaml: function (newCode) {
    //elasticActions.codeChanged(YAML.safeLoad(newCode))
    //this.debouncedSend()
  },

  sendQuery: function () {
    elasticActions.doQuery(this.state.code)
  },
  reformat: function () {
    elasticActions.reformatCode()
  },
  render() {
    return (
      <div>
        <div>
          <boot.Col xs={5}>
            <Select
              name="form-field-name"
              value={this.state.current_index}
              options={this.state.indexesDropdown}
              onChange={this.setIndex}
              />
          </boot.Col>
          <boot.Col xs={5}>
            <boot.Input ref="type" type="text" placeholder='Type'
                        onChange={this.setType}
                        value={this.state.current_type}/>
          </boot.Col>
          <boot.Col xs={2}>
            <boot.Button onClick={this.reformat}>Reformat</boot.Button>
          </boot.Col>
        </div>
        <AceEditor
          mode="json"
          theme="github"
          onChange={this.updateCode}
          name="UNIQUE_ID_OF_DIV"
          value={this.state.code}
          />
      </div>
    )
  }
})
