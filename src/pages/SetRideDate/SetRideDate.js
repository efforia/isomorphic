/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description User information page.
 */

import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Page, Link } from 'framework7-react'
import {
  AppContent,
  AppNavbar,
  AppHeader,
  AppCard,
  AppForm,
  AppPrimaryInput,
  AppPrimaryButton,
  AppStep
} from '../../components'

import arrow from '../../assets/vectors/arrow.svg'
import route from '../../assets/vectors/route.svg'

import { updateRideInCreation } from '../../actions/ride'

import './SetRideDate.scss'

class SetRideDate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ride: {
        date: ''
      }
    }
  }

  componentDidMount() {}

  removeItem(index) {
    const updatedDate = this.state.date
    updatedDate.splice(index, 1)
    this.setState({ date: updatedDate })
  }

  onSubmit() {
    this.props.updateRideInCreation({ date: this.state.date })
    this.$f7router.navigate({ name: 'SetRideDate' })
  }

  canGoBack() {
    const { f7router } = this.props
    const { history } = f7router
    return history.length > 0
  }

  render() {
    const pageTitle = 'Frete Fácil: Cadastro'
    const { ride } = this.state
    const renderBackButton = () =>
      this.canGoBack() && (
        <Link
          style={{ verticalAlign: 'middle' }}
          onClick={() => {
            this.$f7router.back()
          }}>
          <img src={arrow} alt="Voltar" />
        </Link>
      )

    const renderSteps = () => (
      <div>
        <AppStep done />
        <AppStep done />
        <AppStep done />
        <AppStep />
      </div>
    )

    return (
      <Page className="ride-date-page">
        <Helmet title={pageTitle} />
        <AppNavbar className="ride-date-page__navbar">
          <div className="app-navbar__left">{renderBackButton()}</div>
          <div className="app-navbar__center app-navbar__title">Destino do frete</div>
          <div className="app-navbar__right">{renderSteps()}</div>
        </AppNavbar>
        <AppContent className="ride-date-page__content">
          <AppHeader content={<div>Para onde você deseja enviar seus itens?</div>} />
          <AppCard>
            <AppForm>
              <img className="ride-date-page__illustration" src={route} alt="" />
              <AppPrimaryInput
                value={ride.date}
                onChange={e => {
                  this.setState({ ride: { ...ride, date: e.target.value } })
                }}
                required
                colorTheme="orange"
                label="CEP de destino"
                type="text"
              />
              <AppPrimaryButton
                disabled={!(ride.date.length > 1)}
                isLoading={this.state.isLoading}
                onClick={() => {
                  this.onSubmit()
                }}>
                Finalizar
              </AppPrimaryButton>
            </AppForm>
          </AppCard>
        </AppContent>
      </Page>
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  updateRideInCreation: data => dispatch(updateRideInCreation(data))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetRideDate)
