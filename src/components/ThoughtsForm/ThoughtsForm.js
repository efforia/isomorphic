/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Adaptive navbar.
 */

import React from 'react'
import { connect } from 'react-redux'

import thoughts from '../../config/thougts'

import CheckboxInput from '../CheckboxInput'

import './ThoughtsForm.scss'

class AppThoughtsForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      positive: thoughts.positive,
      negative: thoughts.negative
    }
  }

  updateValue(type, index, checked) {
    if (type === 'negative')
      this.setState({
        negative: this.state.negative.map((thought, thoughtIndex) =>
          thoughtIndex === index ? { ...thought, checked } : thought
        )
      })
    else
      this.setState({
        positive: this.state.positive.map((thought, thoughtIndex) =>
          thoughtIndex === index ? { ...thought, checked } : thought
        )
      })
  }

  render() {
    const { displayPositive, displayNegative } = this.props

    const renderThoughts = (thoughtsList, thoughtsType) =>
      thoughtsList.map((thought, index) => (
        <CheckboxInput
          key={thought.property}
          checked={thought.checked || false}
          onChange={checked => {
            this.updateValue(thoughtsType, index, checked)
          }}>
          {thought.question}
        </CheckboxInput>
      ))

    return (
      <article className={`app-thoughts-form ${this.props.className || ''}`}>
        {displayPositive && renderThoughts(this.state.positive, 'positive')}
        {displayNegative && renderThoughts(this.state.negative, 'negative')}
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
)(AppThoughtsForm)
