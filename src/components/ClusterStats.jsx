import React from 'react'
import boot from 'react-bootstrap'
import num from 'numbro'
import clusterActions from '../actions/ClusterActions'
import getPropertyByPath from '../utils/getPropertyByPath'

export default React.createClass({
  displayName: 'ClusterStats',

  componentDidMount() {
    clusterActions.setAutoRefresh(5 * 1000)
  },
  componentWillUnmount() {
    clusterActions.stopAutoRefresh()
  },

  format_count(number){
    return num(number).format('0.[0]a')
  },
  format_size(number){
    return num(number).format('0.[0]b')
  },


  get_per_sec(new_val, old_val) {
    if (this.props.pstatsDt) {
      let timeDiff = (this.props.statsDt - this.props.pstatsDt) / 1000
      let valDiff = new_val - old_val
      return valDiff / timeDiff
    }
    else {
      return 0
    }

  },
  _get_totals(indice){
    if (indice == "_all") {
      return [this.props.stats._all.total, this.props.pstats._all.total]
    }
    else {
      return [this.props.stats.indices[indice].total, this.props.pstats.indices[indice].total]
    }
  },

  generate_tr(indice, stats_path, name, formater) {
    let [total, oldtotal] = this._get_totals(indice)
    let newStat = getPropertyByPath(total, stats_path)
    let oldStat = getPropertyByPath(oldtotal, stats_path)
    formater = formater || this.format_count
    return (
      <tr key={name}>
        <td className='col-xs-6'>{name}</td>
        <td>{formater(newStat)}</td>
        <td>{formater(this.get_per_sec(newStat, oldStat))}</td>
      </tr>
    )
  },

  generate_rows(indice) {
    let trs = []
    trs.push(this.generate_tr(indice, "docs.count", "Total Docs"))
    trs.push(this.generate_tr(indice, "indexing.index_total", "Total Indexed"))
    trs.push(this.generate_tr(indice, "search.query_total", "Total Search"))
    trs.push(this.generate_tr(indice, 'store.size_in_bytes', "Total Sizes", this.format_size))
    trs.push(this.generate_tr(indice, "get.total", "Total Gets"))
    trs.push(this.generate_tr(indice, "percolate.total", "Total Percolate"))
    return trs
  },

  generate_table(name, indice) {
    let trs = this.generate_rows(indice)
    return (
      <boot.Table striped bordered condensed hover>
        <thead>
        <tr>
          <th>{name}</th>
          <th>Current</th>
          <th>Per sec</th>
        </tr>
        </thead>
        <tbody>
        {
          trs.map((tr, i) => {
            return tr
          })
        }
        </tbody>
      </boot.Table>
    )
  },

  refresh() {
    clusterActions.refreshStats()
  },


  render() {

    let all_table = this.generate_table("All", "_all")

    let other_tables = []
    for (let index_name in this.props.stats.indices) {
      other_tables.push(<boot.Col xs={12} key={index_name}>{this.generate_table(index_name, index_name)}</boot.Col>)
    }

    return (
      <div>
        <boot.Col xs={12}>
          <boot.ButtonInput bsStyle='info' onClick={this.refresh}>Refresh Stats</boot.ButtonInput>
          <boot.Label bsStyle='default'>
            Active shards {this.props.stats._shards.successful}/{this.props.stats._shards.total}
            &nbsp;Failed {this.props.stats._shards.failed}</boot.Label>
        </boot.Col>
        <boot.Col xs={12}>
          {all_table}
        </boot.Col>

        {
          other_tables.map((indice, key) => {
            return (indice)
          })

        }

      </div>
    )
  }
})
