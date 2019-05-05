/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description User information page.
 */

import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { Page, List } from 'framework7-react'


import truck from '../../../assets/vectors/truck.svg'

import PrimaryButton from '../../../components/PrimaryButton'

import './WaitingForDevice.scss'

class WaitingForDevice extends React.Component {
  video = React.createRef()

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  onSubmit() {
    this.$f7router.navigate({ name : 'SynchronizeDevice' })
  }

  canGoBack() {
    const { f7router } = this.props
    const { history } = f7router
    return history.length > 0
  }

  render() {
    const pageTitle = 'Frete Fácil: CNH'
    return (
      <Page className="waiting-for-device-page">
        <Helmet title={pageTitle} />
        <div className="waiting-for-device-page__content">
          <div className="waiting-for-device-page__intro">
            <div className="waiting-for-device-page__intro__title">Aguarde o seu device </div>
            <div className="waiting-for-device-page__intro__content">
              Após a confirmação do envio do seu device pode levar entre 3 e 7 dias para ele chegar
              até você.
            </div>
          </div>
          <List className="waiting-for-device-page__form">
            <img
              className="waiting-for-device-page__form__illustration"
              src={truck}
              alt="Ilustração da câmera"
            />
            <div className="waiting-for-device-page__action">
              <div className="waiting-for-device-page__action__title">
                Seu device está chegando...
              </div>
              <div className="waiting-for-device-page__action__tip">
                Clique abaixo se você já está com o device em mãos
              </div>
              <PrimaryButton
                onClick={() => {
                  this.onSubmit()
                }}>
                Meu device chegou!
              </PrimaryButton>
            </div>
          </List>
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
)(WaitingForDevice)
