/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Adaptive footer.
 */

import React from 'react'
import { connect } from 'react-redux'
import { List } from 'framework7-react'

import './Form.scss'

class AppForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <List className="app-form">
        <form>{this.props.children}</form>
      </List>
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
)(AppForm)
