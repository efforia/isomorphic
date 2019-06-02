/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description User information page.
 */

import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Page } from 'framework7-react'
import { AppPrimaryButton, AppNavbar, AppContent } from '../../components'

import shield from '../../assets/vectors/signup-feedback-shield.svg'

import './SignupFeedback.scss'

class SignupFeedback extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  onSubmit() {
    this.$f7router.navigate({ name: 'Login' })
  }

  canGoBack() {
    const { f7router } = this.props
    const { history } = f7router
    return history.length > 0
  }

  render() {
    const pageTitle = 'Frete Fácil: Pronto!'
    return (
      <Page className="signup-feedback-page">
        <Helmet title={pageTitle} />
        <AppNavbar className="user-info-page__navbar">
          <div className="app-navbar__left" />
          <div className="app-navbar__center--fullwidth">
            <span className="app-navbar__title" />
          </div>
          <div className="app-navbar__right" />
        </AppNavbar>
        <AppContent className="signup-feedback-page__content">
          <img
            className="signup-feedback-page__illustration"
            src={shield}
            alt="Logo: Frete Fácil"
          />
          <div className="signup-feedback-page__intro">
            <div className="signup-feedback-page__intro__title">Cadastro realizado</div>
            <div className="signup-feedback-page__intro__content">
              Seu cadastro foi realizado com sucesso
            </div>
          </div>
          <AppPrimaryButton
            onClick={() => {
              this.onSubmit()
            }}>
            Ok, continuar
          </AppPrimaryButton>
        </AppContent>
      </Page>
    )
  }
}

/* eslint-disable-next-line */
const mapStateToProps = state => ({})

/* eslint-disable-next-line */
const mapDispatchToProps = dispatch => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupFeedback)