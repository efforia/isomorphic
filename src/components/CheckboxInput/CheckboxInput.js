/**
 * @license MIT
 * @version 1.1.0
 * @author Trinca
 * @description Adaptive navbar.
 */

import React from 'react'
import { Checkbox, Row, Col } from 'framework7-react'

import { connect } from 'react-redux'

import './CheckboxInput.scss'

class AppCheckboxInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { checked, disabled, transparent, children, onChange } = this.props
    return (
      /* eslint-disable-next-line */
      <div
        {...this.props}
        onClick={() => (onChange ? onChange(!checked) : null)}
        className={`checkbox-input ${checked ? 'checked' : ''}  ${
          transparent ? 'transparent' : ''
        }`}
        disabled={disabled}>
        <Row>
          <Col width={10}>
            <Checkbox color="orange" checked={checked} />
          </Col>
          <Col width={90}>{children}</Col>
        </Row>
      </div>
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
)(AppCheckboxInput)
