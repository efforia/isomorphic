/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Adaptive navbar.
 */

import React from 'react'
import { Link, Toolbar, Tabs, Tab, Page } from 'framework7-react'

import { connect } from 'react-redux'

import iconHome from '../../assets/vectors/tab-icon-home.svg'
import iconPolicy from '../../assets/vectors/tab-icon-policy.svg'
import iconUtilization from '../../assets/vectors/tab-icon-utilization.svg'
import iconContact from '../../assets/vectors/tab-icon-contact.svg'

import './TabsContainer.scss'
import Contact from '../../pages/mobile/Contact'
import Home from '../../pages/mobile/Home'
import Policy from '../../pages/mobile/Policy'
import Utilization from '../../pages/mobile/Utilization'

const rootPages = [
  {
    path: 'start',
    label: 'Início',
    icon: iconHome,
    component: Home
  },
  {
    path: 'utilizations',
    label: 'Novo Frete',
    icon: iconUtilization,
    component: Utilization
  },
  {
    path: 'policy',
    label: 'Meus Fretes',
    icon: iconPolicy,
    component: Policy
  },
  {
    path: 'contact',
    label: 'Opções',
    icon: iconContact,
    component: Contact
  }
]

class TabsContainer extends React.Component {
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
      <Page pageContent={false} className="app-tabs">
        <Toolbar noShadow tabbar position="bottom">
          {rootPages.map(tab => (
            <Link
              key={tab.path}
              tabLinkActive={isActive(tab)}
              onClick={() => {
                this.setState({ selectedTab: tab })
              }}>
              <img src={tab.icon} alt={tab.label} />
              <span>{tab.label}</span>
            </Link>
          ))}
        </Toolbar>
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

const mapDispatchToProps = dispatch => ({
  
  
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabsContainer)
