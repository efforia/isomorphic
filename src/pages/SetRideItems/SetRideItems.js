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
  AppRideItemsForm,
  AppStep
} from '../../components'

import { updateRideInCreation } from '../../actions/ride'

import arrowIcon from '../../assets/vectors/arrow.svg'

import './SetRideItems.scss'

class SetRideItems extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  onSubmit(items) {
    this.props.updateRideInCreation({ items })
    this.$f7router.navigate({ name: 'SetRideDestination' })
  }

  canGoBack() {
    const { f7router } = this.props
    const { history } = f7router
    return history.length > 0
  }

  render() {
    const pageTitle = 'Frete Fácil'
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

    const renderSteps = () => (
      <div>
        <AppStep done />
        <AppStep done />
        <AppStep />
        <AppStep />
      </div>
    )

    return (
      <Page className="ride-items-page">
        <Helmet title={pageTitle} />
        <AppNavbar className="ride-items-page__navbar">
          <div className="app-navbar__left">{renderBackButton()}</div>
          <div className="app-navbar__center app-navbar__title">Itens do frete</div>
          <div className="app-navbar__right">{renderSteps()}</div>
        </AppNavbar>
        <AppContent className="ride-items-page__content">
          <AppHeader content={<div>O que você gostaria de transportar?</div>} />
          <AppCard>
            <AppRideItemsForm
              onSave={items => {
                this.onSubmit(items)
              }}
            />
          </AppCard>
        </AppContent>
      </Page>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user.profile
})

const mapDispatchToProps = dispatch => ({
  updateRideInCreation: data => dispatch(updateRideInCreation(data))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetRideItems)
