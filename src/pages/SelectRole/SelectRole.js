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
import { AppContent, AppPrimaryButton, AppNavbar, AppForm, AppHeader } from '../../components'
import { createProfile } from '../../actions/user'

import arrowIcon from '../../assets/vectors/arrow.svg'

import './SelectRole.scss'

class SelectRole extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  canGoBack() {
    const { f7router } = this.props
    const { history } = f7router
    return history.length > 0
  }

  render() {
    const pageTitle = 'Frete Fácil: Cadastro'
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

    return (
      <Page className="select-role-page">
        <Helmet title={pageTitle} />
        <AppNavbar className="select-role-page__navbar">
          <div className="app-navbar__left">{renderBackButton()}</div>
          <div className="app-navbar__center app-navbar__title">Cadastro</div>
          <div className="app-navbar__right" />
        </AppNavbar>
        <AppContent className="select-role-page__content">
          <AppHeader
            title={<div>Pronto(a) para começar? </div>}
            content={<div>Selecione seu tipo de usuário abaixo ;)</div>}
          />
          <AppForm>
            <AppPrimaryButton
              onClick={() => {
                this.$f7router.navigate({ name: 'CreateUser' })
              }}>
              Quero solicitar fretes
            </AppPrimaryButton>
            <AppPrimaryButton
              onClick={() => {
                this.$f7router.navigate({ name: 'CreateDriver' })
              }}>
              Sou um freteiro
            </AppPrimaryButton>
          </AppForm>
        </AppContent>
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
)(SelectRole)
