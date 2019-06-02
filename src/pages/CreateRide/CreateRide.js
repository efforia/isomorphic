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
import { Page } from 'framework7-react'
import {
  AppContent,
  AppPrimaryButton,
  AppPrimaryInput,
  AppNavbar,
  AppForm,
  AppHeader,
  AppCard,
  AppStep
} from '../../components'

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
    const { ride } = this.state
    const renderSteps = () => (
      <div>
        <AppStep done />
        <AppStep />
        <AppStep />
        <AppStep />
      </div>
    )
    return (
      <Page className="create-ride-page">
        <Helmet title={pageTitle} />
        <AppNavbar className="create-ride-page__navbar">
          <div className="app-navbar__left" />
          <div className="app-navbar__center app-navbar__title">Novo Frete</div>
          <div className="app-navbar__right">{renderSteps()}</div>
        </AppNavbar>
        <AppContent className="create-ride-page__content">
          <AppHeader content={<div>Precisando de um frete? Deixa a gente te ajudar ;)</div>} />
          <AppCard>
            <img className="create-ride-page__illustration" src={truck} alt="" />
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
          </AppCard>
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
