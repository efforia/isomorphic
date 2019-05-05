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
import ripples from '../../../assets/vectors/ripples.svg'

import PrimaryButton from '../../../components/PrimaryButton'
import Navbar from '../../../components/Navbar'

import './SynchronizationFeedback.scss'

class SynchronizationFeedback extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  onSubmit() {
    this.$f7router.navigate({ name: 'Home' })
  }

  canGoBack() {
    const { f7router } = this.props
    const { history } = f7router
    return history.length > 0
  }

  render() {
    const pageTitle = 'Frete Fácil: Pronto!'
    const renderBackButton = () =>
      this.canGoBack() && (
        <Link
          style={{ verticalAlign: 'bottom' }}
          onClick={() => {
            this.$f7router.back()
          }}>
          <img src={arrowIcon} alt="Voltar" />
        </Link>
      )
    return (
      <Page className="synchronization-feedback-page">
        <Helmet title={pageTitle} />
        <Navbar className="user-info-page__navbar">
          <div className="app-navbar__left">{renderBackButton()}</div>
          <div className="app-navbar__center--fullwidth">
            <span className="app-navbar__title">Conclusão da Instalação</span>
          </div>
          <div className="app-navbar__right" />
        </Navbar>
        <div className="synchronization-feedback-page__content">
          <div className="synchronization-feedback-page__content__title">Pronto!</div>
          <div className="synchronization-feedback-page__content__subtitle">
            Você já pode utilizar o seu seguro tranquilamente, basta manter o seu bluetooth e GPS
            sempre ativados.
          </div>
          <img
            className="synchronization-feedback-page__form__illustration"
            src={ripples}
            alt="Ilustração da câmera"
          />
          <div className="synchronization-feedback-page__action">
            <PrimaryButton
              onClick={() => {
                this.onSubmit()
              }}>
              Ok
            </PrimaryButton>
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
)(SynchronizationFeedback)

/* Leaving those here in case they come back in Figma
<img className="synchronization-feedback-page__navbar__ripple bottom-center-left" src={ripples} alt="" />
<img className="synchronization-feedback-page__navbar__ripple bottom-center" src={ripples} alt="" />
<img className="synchronization-feedback-page__navbar__ripple right" src={ripples} alt="" />
<img className="synchronization-feedback-page__navbar__ripple left" src={ripples} alt="" />
<img className="synchronization-feedback-page__navbar__ripple top-center" src={ripples} alt="" />
<img className="synchronization-feedback-page__navbar__ripple top-center-right" src={ripples} alt="" /> */
