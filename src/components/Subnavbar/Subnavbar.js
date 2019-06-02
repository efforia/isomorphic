/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Adaptive subnavbar.
 */

import React from 'react'
import { connect } from 'react-redux'


import './Subnavbar.scss'

class AppSubnavbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return <article className="app-subnavbar">{this.props.children}</article>
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
)(AppSubnavbar)
