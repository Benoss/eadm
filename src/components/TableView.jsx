import React from 'react'
import reactable from 'reactable'
import flat from 'flat'

export default React.createClass({
  displayName: 'TableView',

  flat: function(array_object, depth) {
    let mapped = array_object.map(flat)
    return mapped
  },

  render() {
    let table_style = "table table-condensed table-striped table-hover"

    if (!this.props.data.valid && this.props.data.explanations) {
      return (
        <div>
          <reactable.Table className={table_style} data={this.props.data.explanations}/>
        </div>
      )
    }
    else if (this.props.data.hits && this.props.data.hits.hits) {
      return (
        <div>
          <reactable.Table className={table_style} data={this.flat(this.props.data.hits.hits)}/>
        </div>
      )
    }
    else {
      return (<div>
         <reactable.Table className={table_style} data={[{'empty':''}]}/>
      </div>)
    }
  }
})
