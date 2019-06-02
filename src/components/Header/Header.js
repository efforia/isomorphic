/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Adaptive header.
 */

import React from 'react'
import { connect } from 'react-redux'

import './Header.scss'

class AppHeader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <article className="app-header">
        <div className="app-header__title">{this.props.title}</div>
        <div className="app-header__content">{this.props.content}</div>
      </article>
    )
  }
}

const mapStateToProps = state => ({
  ui: state.ui
})

const mapDispatchToProps = dispatch => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppHeader)
