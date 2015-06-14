import alt from '../alt';

class ClusterActions {
  constructor() {

  }
  refreshStats(args) {
    this.dispatch(args)
  }
  setAutoRefresh(args) {
    this.dispatch(args)
  }
  stopAutoRefresh(args) {
    this.dispatch(args)
  }
}

export default alt.createActions(ClusterActions)

