/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description User information page.
 */

import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import isEmpty from 'validator/lib/isEmpty'
import { Page, List } from 'framework7-react'
import { AppContent, AppPrimaryButton, AppPrimaryInput, AppNavbar, AppForm } from '../../components'

import { updateRideInCreation } from '../../actions/ride'

import truck from '../../assets/vectors/truck.svg'

import './CreateRide.scss'

class CreateRide extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ride: {
        address: ''
      }
    }
  }

  componentDidMount() {}

  isFormValid() {
    const { ride } = this.state
    return !isEmpty(ride.address)
  }

  onSubmit() {
    this.props.updateRideInCreation(this.state.ride)
    this.$f7router.navigate({ name: 'SetRideItems' })
  }

  canGoBack() {
    const { f7router } = this.props
    const { history } = f7router
    return history.length > 0
  }

  render() {
    const pageTitle = 'Frete Fácil: Cadastro'
    const { user } = this.props
    const { ride } = this.state
    return (
      <Page className="create-ride-page">
        <Helmet title={pageTitle} />
        <AppNavbar className="create-ride-page__navbar">
          <div className="app-navbar__left" />
          <div className="app-navbar__center app-navbar__title">Novo Frete</div>
          <div className="app-navbar__right" />
        </AppNavbar>
        <AppContent className="create-ride-page__content">
          <div className="create-ride-page__intro">
            <div className="create-ride-page__intro__title">Olá, {user.name.split(' ')[0]}</div>
            <div className="create-ride-page__intro__content">
              Precisando de um frete? Deixa a gente te ajudar ;)
            </div>
          </div>
          <img className="create-ride-page__illustration" src={truck} alt="" />
          <List className="create-ride-page__form">
            <AppForm>
              <AppPrimaryInput
                value={ride.address}
                onChange={e => {
                  this.setState({ ride: { ...ride, address: e.target.value } })
                }}
                required
                colorTheme="orange"
                label="CEP de partida"
                type="text"
              />
              <AppPrimaryButton
                disabled={!this.isFormValid()}
                isLoading={this.state.isLoading}
                onClick={() => {
                  this.onSubmit()
                }}>
                Próximo
              </AppPrimaryButton>
            </AppForm>
          </List>
        </AppContent>
      </Page>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user.profile,
  ride: state.ride.inCreation
})

const mapDispatchToProps = dispatch => ({
  updateRideInCreation: data => dispatch(updateRideInCreation(data))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateRide)
