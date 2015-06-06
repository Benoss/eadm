import React from 'react'
import CodeMirror from 'react-codemirror'
import boot from 'react-bootstrap'
import elasticActions from '../actions/ElasticActions'
import elasticStore from '../stores/ElasticStore'
import _ from 'lodash'
import YAML from 'js-yaml'

require('codemirror/mode/javascript/javascript.js')

//
//require('codemirror/addon/hint/show-hint.js')
//import OriCodeMirror from 'codemirror'
//var dictionary = ["hello", "lol", "hero"];
//OriCodeMirror.commands.autocomplete = function (editor) {
//  var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
//  var start = cur.ch, end = start;
//  while (end < curLine.length && /[\w$]+/.test(curLine.charAt(end))) ++end;
//  while (start && /[\w$]+/.test(curLine.charAt(start - 1))) --start;
//  var curWord = start != end && curLine.slice(start, end);
//  var regex = new RegExp('^' + curWord, 'i');
//  var return_list = (!curWord ? [] : dictionary.filter(function (item) {
//    return item.match(regex);
//  })).sort()
//  return {
//    list: return_list,
//    from: OriCodeMirror.Pos(cur.line, start),
//    to: OriCodeMirror.Pos(cur.line, end)
//  }
//}


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


  render() {

    var options_js = {
      lineNumbers: true,
      mode: "application/json",
      extraKeys: {"Ctrl-Space": "autocomplete"}
    }

    //YAML.safeDump(JSON.parse(this.props.code))
    //        <boot.Button onClick={this.sendQuery}>Send</boot.Button>
    //      <boot.TabbedArea defaultActiveKey={1} animation={false}>
    //        <boot.TabPane eventKey={1} tab='YAML'>
    //    <CodeMirror value={this.state.code} onChange={this.updateCodeYaml} options={options_yaml}/>
    //        </boot.TabPane>
    //        <boot.TabPane eventKey={2} tab='Json'>
    //        </boot.TabPane>
    //      </boot.TabbedArea>
    return (
      <div>

        <CodeMirror value={this.state.code} onKeyEvent={this.keyUp} onChange={this.updateCode} options={options_js}/>

      </div>
    )
  }
})
