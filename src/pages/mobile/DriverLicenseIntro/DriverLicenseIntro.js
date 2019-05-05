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
import pictureIntro from '../../../assets/vectors/picture-intro.svg'

import PrimaryButton from '../../../components/PrimaryButton'
import Navbar from '../../../components/Navbar'
import Step from '../../../components/Step'

import './DriverLicenseIntro.scss'



class DriverLicenseIntro extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isCameraOpen: false
    }
  }

  componentDidMount() {}

  openCamera() {
    const { camera } = window.navigator
    camera.getPicture(
      base64 => {
        window.localStorage.INSTANT_CNH_PICTURE = base64
      },
      error => {
        console.log(error)
      }
    )
  }

  onSubmit() {
    this.$f7router.navigate({ name: 'SynchronizationFeedback' })
  }

  canGoBack() {
    const { f7router } = this.props
    const { history } = f7router
    return history.length > 0
  }

  render() {
    const pageTitle = 'Frete Fácil: CNH'
    const { isCameraOpen } = this.state
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

    const renderOpenCameraButton = () => (
      <PrimaryButton
        onClick={() => {
          this.onSubmit()
        }}>
        Abrir câmera
      </PrimaryButton>
    )

    const renderTakePictureButton = () => (
      <PrimaryButton
        onClick={() => {
          this.onSubmit()
        }}>
        Tirar foto
      </PrimaryButton>
    )

    return (
      <Page className="driver-license-intro-page">
        <Helmet title={pageTitle} />
        <Navbar className="user-info-page__navbar">
          <div className="app-navbar__left">{renderBackButton()}</div>
          <div className="app-navbar__center app-navbar__title">Dados Pessoais</div>
          <div className="app-navbar__right">{renderSteps()}</div>
        </Navbar>
        <div className="driver-license-intro-page__content">
          <div className="driver-license-intro-page__intro">
            Vamos precisar de uma foto da sua CNH
          </div>
          <img
            className="driver-license-intro-page__illustration"
            src={pictureIntro}
            alt="Ilustração da câmera"
          />
          <div className="driver-license-intro-page__action">
            <div className="driver-license-intro-page__action__title">Vamos tirar a foto</div>
            <div className="driver-license-intro-page__action__tip">
              Retire a sua CNH do plástico
            </div>
            {isCameraOpen ? renderTakePictureButton() : renderOpenCameraButton()}
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
)(DriverLicenseIntro)
