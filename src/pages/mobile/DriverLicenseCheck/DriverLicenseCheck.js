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


import arrowIcon from '../../../assets/vectors/arrow.svg'
import cnh from '../../../assets/img/assistant.png'

import PrimaryButton from '../../../components/PrimaryButton'
import Navbar from '../../../components/Navbar'
import Step from '../../../components/Step'

import './DriverLicenseCheck.scss'
import SecondaryButton from '../../../components/SecondaryButton'

class DriverLicenseCheck extends React.Component {
  video = React.createRef()

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.startCamera()
  }

  startCamera() {}

  onSubmit() {
    this.$f7router.navigate({ name: 'ConfirmVehicleInfo' })
  }

  canGoBack() {
    const { f7router } = this.props
    const { history } = f7router
    return history.length > 0
  }

  render() {
    const pageTitle = 'Frete Fácil: CNH'
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
        <Step done />
        <Step />
      </div>
    )
    return (
      <Page className="driver-license-check-page">
        <Helmet title={pageTitle} />
        <Navbar className="user-info-page__navbar">
          <div className="app-navbar__left">{renderBackButton()}</div>
          <div className="app-navbar__center app-navbar__title">Dados Pessoais</div>
          <div className="app-navbar__right">{renderSteps()}</div>
        </Navbar>
        <div className="driver-license-check-page__content">
          {/* <canvas id="cordovaCamera" /> */}
          <img className="driver-license-check-page__picture-preview" src={cnh} alt="CNH" />
          <div className="driver-license-check-page__button-container">
            <PrimaryButton
              onClick={() => {
                this.onSubmit()
              }}>
              Próximo
            </PrimaryButton>
            <SecondaryButton
              onClick={() => {
                this.onSubmit()
              }}>
              Tirar novamente
            </SecondaryButton>
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
)(DriverLicenseCheck)

/* Leaving those here in case they come back in Figma
<img className="driver-license-check-page__navbar__ripple bottom-center-left" src={ripples} alt="" />
<img className="driver-license-check-page__navbar__ripple bottom-center" src={ripples} alt="" />
<img className="driver-license-check-page__navbar__ripple right" src={ripples} alt="" />
<img className="driver-license-check-page__navbar__ripple left" src={ripples} alt="" />
<img className="driver-license-check-page__navbar__ripple top-center" src={ripples} alt="" />
<img className="driver-license-check-page__navbar__ripple top-center-right" src={ripples} alt="" /> */
