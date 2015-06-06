import React from 'react'
import Inspector from 'react-json-inspector';


function isExpended(keypath, value) {
  return true;
}

export default React.createClass({
  displayName: 'JsonView',

  isExpanded()  {

  },

  render() {
    return (
      <div>
        <Inspector data={this.props.data} isExpanded={isExpended}/>
      </div>

    )
  }
})
