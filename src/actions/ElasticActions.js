import alt from '../alt';

class ElasticActions {
  constructor() {
  }

  doQuery(args) {
    this.dispatch(args)
  }

  codeChanged(args) {
    this.dispatch(args)
  }


}

export default alt.createActions(ElasticActions)

