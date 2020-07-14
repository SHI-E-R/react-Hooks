// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useMemo, useCallback } from 'react';
import { Menu } from 'antd'
import routes from '../../routers'
import SubMenu from 'antd/lib/menu/SubMenu'

interface Children {
  title: string
  path: string
  component: any
}

interface RouterType {
  title: string
  path: string
  component: any
  children?: Children[]
}

const Container = () => {
  function formSubmenuChild(obj: RouterType) {
    let cHtml: any = <div></div>
    let childArry: RouterType["children"] = obj.children
    if (childArry && childArry.length > 0) {
      cHtml = childArry.map((item: Children) => {
        return formSubmenuChild(item)
      })
      return <SubMenu key={obj.path} title={obj.title}>{cHtml}</SubMenu>
    } else {
      return <Menu.Item key={obj.path}>{obj.title}</Menu.Item>
    }
  }

  let html = routes.map((obj) => {
    if (obj.children && obj.children.length > 0) {
      return formSubmenuChild(obj)
    } else {
      return <Menu.Item key={obj.path}>{obj.title}</Menu.Item>
    }
  })
  let [content, setContent] = useState(<div></div>)
  function handleClickMenu(item: any) {
    let now: any = routes.find(x => x.path === item.key)
    setContent(now.component) 
  }
  return (
    <div style={{display: 'flex', height: '100vh' }}>
      <div style={{ width: '200px', height: '100%'}}>
        <Menu mode="inline" onClick={(item) => {handleClickMenu(item)}}>
          {html}
        </Menu>
      </div>
      <div className="container" style={{ flex: 1, paddingTop: '50px' }}>
        <div>{content}</div>
      </div>
    </div>
  )
}

Container.prototype = {}

export default Container