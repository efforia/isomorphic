/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Adaptive navbar.
 */

import React from 'react'
import { Button, Preloader } from 'framework7-react'

import { connect } from 'react-redux'

import './PrimaryButton.scss'

class AppPrimaryButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Button
        {...this.props}
        className={`button-primary ${this.props.className || ''}`}
        fill
        color={this.props.color || 'primary'}
        disabled={this.props.disabled || this.props.isLoading}>
        {!this.props.isLoading ? this.props.children : <Preloader color="white" />}
      </Button>
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
)(AppPrimaryButton)
