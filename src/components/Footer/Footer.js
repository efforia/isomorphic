/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Adaptive footer.
 */

import React from 'react'
import { connect } from 'react-redux'


import './Footer.scss'

class AppFooter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return <article className="app-footer">{this.props.children}</article>
  }
}

const mapStateToProps = state => ({
  ui: state.ui
})

const mapDispatchToProps = dispatch => ({
  
  
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppFooter)
