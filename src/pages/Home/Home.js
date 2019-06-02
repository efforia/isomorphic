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
import { AppNavbar, AppContent } from '../../components/index'

import './Home.scss'

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {}

  componentDidMount() {}

  canGoBack() {
    const { f7router } = this.props
    const { history } = f7router
    return history.length > 0
  }

  render() {
    const pageTitle = 'Frete Fácil: Home'
    return (
      <Page className="home-page">
        <Helmet title={pageTitle} />
        <AppNavbar className="home-page__navbar">
          <div className="app-navbar__left" />
          <div className="app-navbar__center" />
          <div className="app-navbar__right" />
        </AppNavbar>
        <AppContent className="home-page__content" />
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
)(Home)
