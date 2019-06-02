/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Adaptive navbar.
 */

import React from 'react'
import { Tabs, Tab, Page } from 'framework7-react'

import { connect } from 'react-redux'

import iconHome from '../../assets/vectors/tab-icon-home.svg'
import Home from '../../pages/Home'

import './HomeContainer.scss'

const rootPages = [
  {
    path: 'start',
    label: 'Início',
    icon: iconHome,
    component: Home
  },
  {
    path: 'foo',
    label: 'Início',
    icon: iconHome,
    component: Home
  },
  {
    path: 'baz',
    label: 'Início',
    icon: iconHome,
    component: Home
  }
  /* {
    path: 'rides',
    label: 'Meus Fretes',
    icon: iconRides,
    component: RidesList
  },
  {
    path: 'contact',
    label: 'Opções',
    icon: iconContact,
    component: Settings
  } */
]

/* <span>{tab.label}</span> */
class AppHomeContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: rootPages[0]
    }
  }

  render() {
    const { selectedTab } = this.state
    const isActive = tab => selectedTab.path === tab.path
    return (
      <Page pageContent={false} className="home-container">
        {/* <Toolbar noShadow tabbar position="bottom">
          {rootPages.map(tab => (
            <Link
              key={tab.path}
              tabLinkActive={isActive(tab)}
              onClick={() => {
                this.setState({ selectedTab: tab })
              }}>
              <img src={tab.icon} alt={tab.label} />
            </Link>
          ))}
        </Toolbar> */}
        <Tabs>
          {rootPages.map(tab => {
            const TabContent = tab.component
            return (
              <Tab key={tab.path} className="page-content" id={tab.path} tabActive={isActive(tab)}>
                <TabContent {...this.props} />
              </Tab>
            )
          })}
        </Tabs>
      </Page>
    )
  }
}

const mapStateToProps = state => ({
  ui: state.ui
})

const mapDispatchToProps = dispatch => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppHomeContainer)
