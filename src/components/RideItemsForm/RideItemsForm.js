/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Adaptive form.
 */

import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'framework7-react'
import AppPrimaryButton from '../PrimaryButton'
import AppPrimaryInput from '../PrimaryInput'
import AppForm from '../Form'

import './RideItemsForm.scss'

class AppRideItemsForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [{ quantity: '', description: '' }]
    }
  }

  removeItem(index) {
    const updatedItems = this.state.items
    updatedItems.splice(index, 1)
    this.setState({ items: updatedItems })
  }

  render() {
    const { items } = this.state
    const renderItemInput = (item, index) => {
      const isFirstItem = index === 0
      return (
        <Row className="app-ride-items-form__item" key={index}>
          {!isFirstItem && (
            <Col width={15}>
              <AppPrimaryButton
                className="app-ride-items-form__item__button-remove"
                onClick={() => {
                  this.removeItem(index)
                }}>
                x
              </AppPrimaryButton>
            </Col>
          )}
          <Col width={!isFirstItem ? 30 : 40}>
            <AppPrimaryInput
              value={item.quantity}
              onChange={e => {
                item.quantity = e.target.value
                this.setState({})
              }}
              required
              colorTheme="orange"
              label={isFirstItem ? 'Quant.' : 'Qtd.'}
              type="text"
            />
          </Col>
          <Col width={!isFirstItem ? 55 : 60}>
            <AppPrimaryInput
              value={item.description}
              onChange={e => {
                item.description = e.target.value
                this.setState({})
              }}
              required
              colorTheme="orange"
              label="Nome do item"
              type="text"
              alignn="center"
            />
          </Col>
        </Row>
      )
    }
    return (
      <article className="app-ride-items-form">
        <AppForm>
          {items.map((item, index) => renderItemInput(item, index))}
          <AppPrimaryButton
            onClick={() => {
              this.setState({ items: items.concat([{ quantity: '', description: '' }]) })
            }}>
            Adicionar item
          </AppPrimaryButton>
          <AppPrimaryButton
            disabled={!(items.length > 1)}
            isLoading={this.state.isLoading}
            onClick={() => {
              this.props.onSave()
            }}>
            Próximo
          </AppPrimaryButton>
        </AppForm>
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
)(AppRideItemsForm)
