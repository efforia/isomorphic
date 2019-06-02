/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Adaptive feelings-calendar.
 */

import React from 'react'
import { connect } from 'react-redux'


import './FeelingsCalendar.scss'

class AppFeelingsCalendar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return <article className="app-feelings-calendar">{this.props.children}</article>
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
)(AppFeelingsCalendar)
