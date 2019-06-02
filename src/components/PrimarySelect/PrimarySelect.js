/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Adaptive navbar.
 */

import React from 'react'
import { ListItem, List, BlockTitle } from 'framework7-react'

import { connect } from 'react-redux'

import './PrimarySelect.scss'

class AppPrimarySelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { options } = this.props
    return (
      <div className={`select-primary ${this.props.className || ''}`}>
        <BlockTitle>Qual o seu principal sentimento neste momento?</BlockTitle>
        <List>
          {options &&
            options.map(selectOption => (
              <ListItem
                key={selectOption.value}
                radio
                title={selectOption.label}
                name={selectOption.value}
              />
            ))}
        </List>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ui: state.ui
})
/* eslint-disable-next-line */
const mapDispatchToProps = dispatch => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppPrimarySelect)
