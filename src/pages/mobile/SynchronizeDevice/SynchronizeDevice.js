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


import deviceIcon from '../../../assets/vectors/sync-device.svg'
import arrowIcon from '../../../assets/vectors/arrow.svg'

import Navbar from '../../../components/Navbar'
import Step from '../../../components/Step'

import './SynchronizeDevice.scss'

class SynchronizeDevice extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    this.synchronize()
  }

  synchronize() {
    setTimeout(() => {
      this.$f7router.navigate({ name: 'SelectDevice' })
    }, 5000)
  }

  canGoBack() {
    const { f7router } = this.props
    const { history } = f7router
    return history.length > 0
  }

  render() {
    const pageTitle = 'Frete Fácil: Sincronizar'
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
        <Step done />
        <Step />
        <Step />
      </div>
    )
    return (
      <Page className="synchronize-device-page">
        <Helmet title={pageTitle} />
        <Navbar className="user-info-page__navbar">
          <div className="app-navbar__left">{renderBackButton()}</div>
          <div className="app-navbar__center app-navbar__title">Device</div>
          <div className="app-navbar__right">{renderSteps()}</div>
        </Navbar>
        <div className="synchronize-device-page__content">
          <div className="synchronize-device-page__intro">
            <div className="synchronize-device-page__intro__title">
              Localizando o dispositivo...
            </div>
            <div className="synchronize-device-page__intro__content">
              Tenha certeza que o bluetooth do seu celular está ativado para realizar a
              sincronização
            </div>
          </div>
          <div className="synchronize-device-page__illustration">
            <img
              className="synchronize-device-page__illustration__content"
              src={deviceIcon}
              alt="Ilustração da dispositivo"
            />
            <div className="synchronize-device-page__illustration__ripple" />
            <div className="synchronize-device-page__illustration__ripple" />
            <div className="synchronize-device-page__illustration__ripple" />
            <div className="synchronize-device-page__illustration__ripple" />
          </div>
        </div>
      </Page>
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  
  
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SynchronizeDevice)
