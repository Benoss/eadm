import React from 'react'
import boot from 'react-bootstrap'
import elasticActions from '../actions/ElasticActions'
import elasticStore from '../stores/ElasticStore'
import _ from 'lodash'
import YAML from 'js-yaml'
import AceEditor  from 'react-ace-wrapper'
import Select from 'react-select'

require('brace/mode/json');
require('brace/mode/yaml');
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
    elasticActions.codeChangedYaml(newCode)
    this.debouncedSend()
  },

  sendQuery: function () {
    elasticActions.doQuery()
  },
  reformat: function () {
    elasticActions.reformatCode()
  },
  handleSelect(key) {
    this.setState({key})
    if (key == 1) {
      elasticActions.yamlTabSelected()
    }
    else if (key == 2) {
      elasticActions.jsonTabSelected()
    }
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
        <boot.Col xs={12}>
          <boot.TabbedArea defaultActiveKey={1}
                           animation={false}
                           onSelect={this.handleSelect}
                           activeKey={this.state.key}>

            <boot.TabPane eventKey={1} tab='Yaml'>
              <AceEditor
                mode="YAML"
                theme="github"
                onChange={this.updateCodeYaml}
                name="YAML_DIV"
                value={this.state.codeYaml}

                />
            </boot.TabPane>
            <boot.TabPane eventKey={2} tab='Json'>
              <AceEditor
                mode="json"
                theme="github"
                onChange={this.updateCode}
                name="JSON_DIV"
                value={this.state.code}
                />
            </boot.TabPane>
          </boot.TabbedArea>
        </boot.Col>
      </div>
    )
  }
})
