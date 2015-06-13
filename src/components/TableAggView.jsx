import React from 'react'
import reactable from 'reactable'
import flat from 'flat'
import boot from 'react-bootstrap'

export default React.createClass({
  displayName: 'TableAggView',

  flat: function(array_object, depth) {
    let mapped = array_object.map(flat)
    return mapped
  },

  render() {
    let table_style = "table table-condensed table-striped table-hover"
    if (this.props.data.aggregations) {
      return (
       <div>
         <boot.TabbedArea defaultActiveKey={Object.keys(this.props.data.aggregations)[0]} animation={false}>
         {Object.keys(this.props.data.aggregations).map(function (key) {
           var item = this.props.data.aggregations[key]
           return (
             <boot.TabPane key={key} eventKey={key} tab={key}>
              <reactable.Table className={table_style} data={this.flat(item.buckets)}/>
              </boot.TabPane>
           )
         }, this)}
          </boot.TabbedArea>
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
