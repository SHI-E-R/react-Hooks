import React from 'react'
import UseState from './view/UseState/UseState'
import UseReducer from './view/UseReducer/UseReducer'

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

let routes: RouterType[] = [
  {
    title: 'UseState',
    path: '/UseState',
    component: <UseState />
  },
  {
    title: 'UseReducer',
    path: '/UseReducer',
    component: <UseReducer />
  }
]

export default routes