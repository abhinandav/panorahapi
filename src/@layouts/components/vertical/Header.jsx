'use client'

// Third-party Imports
import classnames from 'classnames'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import StyledFooter from '@layouts/styles/vertical/StyledFooter'

// Styled Component Imports
const Footer = props => {
  // Props
  const { children, overrideStyles } = props

  // Hooks
  const { settings } = useSettings()

  // Vars
  const { footerContentWidth } = settings
  const footerDetached = themeConfig.footer.detached === true
  const footerAttached = themeConfig.footer.detached === false
  const footerStatic = themeConfig.footer.type === 'static'
  const footerFixed = themeConfig.footer.type === 'fixed'
  const footerContentCompact = footerContentWidth === 'compact'
  const footerContentWide = footerContentWidth === 'wide'

  return (
    <StyledFooter
      overrideStyles={overrideStyles}
      className={classnames(verticalLayoutClasses.footer, 'is-full', {
        [verticalLayoutClasses.footerDetached]: footerDetached,
        [verticalLayoutClasses.footerAttached]: footerAttached,
        [verticalLayoutClasses.footerStatic]: footerStatic,
        [verticalLayoutClasses.footerFixed]: footerFixed,
        [verticalLayoutClasses.footerContentCompact]: footerContentCompact,
        [verticalLayoutClasses.footerContentWide]: footerContentWide
      })}
    >
      <div className={verticalLayoutClasses.footerContentWrapper}>{children}</div>
    </StyledFooter>
  )
}

export default Footer
