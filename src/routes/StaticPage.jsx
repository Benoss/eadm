import React from 'react'

export default React.createClass({
    displayName: 'StaticPage',
      contextTypes: {
        router: React.PropTypes.func
      },
      render() {
        return (
            <h1>
                Static Page Name: {this.context.router.getCurrentParams().name}
            </h1>
        )
    }
})