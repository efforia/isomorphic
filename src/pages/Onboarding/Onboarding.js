/**
 * @license MIT
 * @version 1.1.0
 * @author Trinca
 * @description User authentication page.
 */

import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Page, PageContent, List, Swiper, SwiperSlide } from 'framework7-react'
import { AppPrimaryButton, AppContent } from '../../components'

import google from '../../assets/vectors/google-plus.svg'

import slide01Pic from '../../assets/vectors/onboarding-slide-01.svg'
import slide02Pic from '../../assets/vectors/onboarding-slide-02.svg'
import slide03Pic from '../../assets/vectors/onboarding-slide-03.svg'
import slide04Pic from '../../assets/vectors/onboarding-slide-04.svg'

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
          <AppContent className="onboarding-page__content">
            <div className="onboarding-page__navbar">
              <div className="onboarding-page__navbar__title">Frete Fácil</div>
            </div>
            <List className="onboarding-page__form">
              <Swiper pagination navigation>
                <SwiperSlide>
                  <img src={slide01Pic} alt="Frete Fácil" className="onboarding-page__slide__pic" />
                  <div className="onboarding-page__slide__description">
                    Diga como você está se sentindo.
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <img src={slide02Pic} alt="Frete Fácil" className="onboarding-page__slide__pic" />
                  <div className="onboarding-page__slide__description">
                    Mantenha um histórico do seu humor.
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <img src={slide04Pic} alt="Frete Fácil" className="onboarding-page__slide__pic" />
                  <div className="onboarding-page__slide__description">
                    Se desejar, compartilhe com alguém de confiança.
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <img src={slide03Pic} alt="Frete Fácil" className="onboarding-page__slide__pic" />
                  <div className="onboarding-page__slide__description">
                    Fique {/* eslint-disable-next-line */}
                    <a
                      onClick={() =>
                        /* eslint-disable-next-line */
                        alert(
                          'As informações de cada usuário e usuária ficam salvas apenas em sua conta do Google Drive.'
                        )
                      }>
                      seguro(a)
                    </a>{' '}
                    sobre sua privacidade.
                  </div>
                </SwiperSlide>
              </Swiper>
              <AppPrimaryButton
                fill
                color="primary"
                onClick={() => {
                  // auth.accessWithGoogle().then(() => {
                  this.$f7router.navigate({ name: 'Login' })
                  // })
                }}>
                <img src={google} alt="" /> Acessar com o Google
              </AppPrimaryButton>
            </List>
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
