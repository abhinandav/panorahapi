const verticalMenuData = dictionary => [
  // This is how you will normally render submenu
  {
    label: dictionary['navigation'].dashboards,
    suffix: {
      label: '5',
      color: 'error'
    },
    icon: 'tabler-smart-home',
    children: [
      // This is how you will normally render menu item
      {
        label: dictionary['navigation'].doctypelist,
        icon: 'tabler-circle',
        href: '/dashboards/doctypelist'
      },{
        label: dictionary['navigation'].createdoctype,
        icon: 'tabler-circle',
        href: '/dashboards/createdoctype'
      },
      {
        label: dictionary['navigation'].insertdata,
        icon: 'tabler-circle',
        href: '/dashboards/insertdata'
      },
      {
        label: dictionary['navigation'].deletedoc,
        icon: 'tabler-circle',
        href: '/dashboards/deletedoc'
      },
      {
        label: dictionary['navigation'].updatedoc,
        icon: 'tabler-circle',
        href: '/dashboards/updatedoc'
      },
      {
        label: dictionary['navigation'].logistics,
        icon: 'tabler-circle',
        href: '/dashboards/fetchdata'
      }
    ]
  }
]

export default verticalMenuData
