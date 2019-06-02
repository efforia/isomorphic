/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Adaptive card.
 */

import React from 'react'
import { connect } from 'react-redux'
import { Card } from 'framework7-react'

import './Card.scss'

class AppCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return <Card className="app-card">{this.props.children}</Card>
  }
}

const mapStateToProps = state => ({
  ui: state.ui
})

const mapDispatchToProps = dispatch => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppCard)
