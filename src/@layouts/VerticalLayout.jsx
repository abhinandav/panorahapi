// Third-party Imports
import classnames from 'classnames'

// Component Imports
import LayoutContent from './components/vertical/LayoutContent'

// Util Imports
import { verticalLayoutClasses } from './utils/layoutClasses'

// Styled Component Imports
import StyledContentWrapper from './styles/vertical/StyledContentWrapper'

const VerticalLayout = props => {
  // Props
  const { navbar, header, navigation, children } = props

  return (
    <div className={classnames(verticalLayoutClasses.root, 'flex flex-auto')}>
      {navigation || null}
      <StyledContentWrapper
        className={classnames(verticalLayoutClasses.contentWrapper, 'flex flex-col min-is-0 is-full')}
      >
        {navbar || null}
        {header}
        {/* Content */}
        <LayoutContent>{children}</LayoutContent>
      </StyledContentWrapper>
    </div>
  )
}

export default VerticalLayout
