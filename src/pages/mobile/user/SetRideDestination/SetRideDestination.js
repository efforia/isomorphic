/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description User information page.
 */

import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Page, List, Link, Row, Col } from 'framework7-react'
import moment from 'moment-mini'
import { createProfile } from '../../../../actions/user'

import arrowIcon from '../../../../assets/vectors/arrow.svg'

import authService from '../../../../services/auth'

import PrimaryButton from '../../../../components/PrimaryButton'
import PrimaryInput from '../../../../components/PrimaryInput'
import Navbar from '../../../../components/Navbar'
import Form from '../../../../components/Form'

import './SetRideDestination.scss'

class SetRideDestination extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      destination: [{ quantity: '', description: '' }]
    }
  }

  componentDidMount() {}

  removeItem(index) {
    const updatedDestination = this.state.destination
    updatedDestination.splice(index, 1)
    this.setState({ destination: updatedDestination })
  }

  onSubmit() {
    this.setState({ isLoading: true })
    this.props
      .updateRideInCreation({ destination: this.state.destination })
      .then(data => {
        this.$f7router.navigate({ name: 'SetRideDestination' })
      })
      .catch(e => {
        console.log(e)
        this.$f7.dialog.alert(
          'Por favor, verifique as informações preenchidas e tente novamente.',
          'Houve uma falha na operação'
        )
      })
      .then(() => {
        this.setState({ isLoading: false })
      })
  }

  canGoBack() {
    const { f7router } = this.props
    const { history } = f7router
    return history.length > 0
  }

  render() {
    const pageTitle = 'Frete Fácil: Cadastro'
    const { destination } = this.state
    console.log(destination)
    const renderBackButton = () =>
      this.canGoBack() && (
        <Link
          style={{ verticalAlign: 'middle' }}
          onClick={() => {
            this.$f7router.back()
          }}>
          <img src={arrowIcon} alt="Voltar" />
        </Link>
      )

    const renderItemInput = (item, index) => {
      const isFirstItem = index === 0
      return (
        <Row className="ride-destination-page__item" key={index}>
          <Col width={!isFirstItem ? 30 : 40}>
            <PrimaryInput
              value={item.quantity}
              onChange={e => {
                item.quantity = e.target.value
                this.setState({})
              }}
              required
              colorTheme="orange"
              label="Quant."
              type="text"
            />
          </Col>
          <Col width={!isFirstItem ? 55 : 60}>
            <PrimaryInput
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
          {!isFirstItem && (
            <Col width={15}>
              <PrimaryButton
                className="ride-destination-page__item__button-remove"
                onClick={() => {
                  this.removeItem(index)
                }}>
                x
              </PrimaryButton>
            </Col>
          )}
        </Row>
      )
    }

    return (
      <Page className="ride-destination-page">
        <Helmet title={pageTitle} />
        <Navbar className="ride-destination-page__navbar">
          <div className="app-navbar__left">{renderBackButton()}</div>
          <div className="app-navbar__center app-navbar__title">Novo frete</div>
          <div className="app-navbar__right" />
        </Navbar>
        <div className="ride-destination-page__content">
          <div className="ride-destination-page__intro">
            <div className="ride-destination-page__intro__title">Itens do frete</div>
            <div className="ride-destination-page__intro__content">
              O que você gostaria de transportar?
            </div>
          </div>
          <List className="ride-destination-page__form">
            <Form>
              {destination.map((item, index) => renderItemInput(item, index))}
              <PrimaryButton
                isLoading={this.state.isLoading}
                onClick={() => {
                  this.setState({ destination: destination.concat([{ quantity: '', description: '' }]) })
                }}>
                Adicionar item
              </PrimaryButton>
              <PrimaryButton
                disabled={!(destination.length > 1)}
                isLoading={this.state.isLoading}
                onClick={() => {
                  this.onSubmit()
                }}>
                Próximo
              </PrimaryButton>
            </Form>
          </List>
        </div>
      </Page>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user.profile
})

const mapDispatchToProps = dispatch => ({
  createProfile: data => dispatch(createProfile(data))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetRideDestination)
