// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'
import Link from 'next/link'


// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'
import CustomChip from '@core/components/mui/Chip'

// import { GenerateVerticalMenu } from '@components/GenerateMenu'
// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)




const VerticalMenu = ({ dictionary, scrollMenu }) => {
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const params = useParams()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const { lang: locale } = params
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >

      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <SubMenu
          label={dictionary['navigation'].dashboards}
          icon={<i className='tabler-smart-home' />}
        >


          {/* <MenuItem href={`/${locale}/dashboards/createdoctype`}>Create Doctype</MenuItem> */}
          <MenuItem href={`/${locale}/dashboards/doctypelist`}>Dotype List</MenuItem>
          <MenuItem href={`/${locale}/dashboards/insertdata`}>Insert Data</MenuItem>
          <MenuItem href={`/${locale}/dashboards/fetchdata`}>Fetch Data</MenuItem>

          {/* 
          
          <MenuItem href={`/${locale}/dashboards/deletedoc`}>{dictionary['navigation'].deletedoc}</MenuItem>
          <MenuItem href={`/${locale}/dashboards/updatedoc`}>{dictionary['navigation'].updatedoc}</MenuItem>
          <MenuItem href={`/${locale}/dashboards/fileupload`}>{dictionary['navigation'].fileupload}</MenuItem>
          <MenuItem href={`/${locale}/dashboards/filterdata`}>{dictionary['navigation'].filterdata}</MenuItem>
          <MenuItem href={`/${locale}/dashboards/getmetadata`}>{dictionary['navigation'].getmetadata}</MenuItem>
          <MenuItem href={`/${locale}/dashboards/addcolumn`}>{dictionary['navigation'].addcolumn}</MenuItem>
          <MenuItem href={`/${locale}/dashboards/renamecolumn`}>{dictionary['navigation'].renamecolumn}</MenuItem>
          <MenuItem href={`/${locale}/dashboards/deletecolumn`}>{dictionary['navigation'].deletecolumn}</MenuItem> */}
        </SubMenu>



      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
