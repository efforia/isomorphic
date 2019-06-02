/**
 * @license MIT
 * @version 1.1.0
 * @author Trinca
 * @description User authentication page.
 */

import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Page, PageContent, Swiper, SwiperSlide, Link } from 'framework7-react'
import { AppPrimaryButton, AppContent, AppForm, AppNavbar } from '../../components'

import slide01Pic from '../../assets/vectors/onboarding-slide-01.svg'
import slide02Pic from '../../assets/vectors/onboarding-slide-02.svg'
import slide03Pic from '../../assets/vectors/onboarding-slide-03.svg'

import './Onboarding.scss'

class Onboarding extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {}

  componentDidMount() {}

  render() {
    const pageTitle = 'Frete Fácil'
    return (
      <Page className="onboarding-page">
        <Helmet title={pageTitle} />

        <PageContent>
          <AppNavbar className="onboarding-page__navbar__title">Frete Fácil</AppNavbar>
          <AppContent className="onboarding-page__content">
            <AppForm className="onboarding-page__form">
              <Swiper pagination navigation>
                <SwiperSlide>
                  <img src={slide01Pic} alt="Frete Fácil" className="onboarding-page__slide__pic" />
                  <div className="onboarding-page__slide__description">
                    Adicione os itens do frete
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <img src={slide02Pic} alt="Frete Fácil" className="onboarding-page__slide__pic" />
                  <div className="onboarding-page__slide__description">Garanta o melhor preço.</div>
                </SwiperSlide>
                <SwiperSlide>
                  <img src={slide03Pic} alt="Frete Fácil" className="onboarding-page__slide__pic" />
                  <div className="onboarding-page__slide__description">
                    Faça seu frete com tranquilidade!
                  </div>
                </SwiperSlide>
              </Swiper>
              <AppPrimaryButton
                fill
                color="primary"
                onClick={() => {
                  this.$f7router.navigate({ name: 'Login' })
                }}>
                Fazer login
              </AppPrimaryButton>
              <p className="login-page__paragraph bottom">
                Não tem uma conta?&nbsp;
                <Link
                  className="login-page__link"
                  onClick={() => {
                    this.$f7router.navigate({ name: 'SelectRole' })
                  }}>
                  Cadastre-se
                </Link>
              </p>
            </AppForm>
          </AppContent>
        </PageContent>
      </Page>
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Onboarding)
