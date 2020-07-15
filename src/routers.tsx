import React from 'react'
import UseState from './view/UseState/UseState'
import UseReducer from './view/UseReducer/UseReducer'
import UseContext from './view/UseContext/UseContext.js'
import UseEffect from './view/UseEffect/UseEffect'
import UseLayoutEffect from './view/UseLayoutEffect/UseLayoutEffect'
import UseRef from './view/UseRef/UseRef'
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
  },
  {
    title: 'UseContext',
    path: '/UseContext',
    component: <UseContext />
  },
  {
    title: 'UseEffect',
    path: '/UseEffect',
    component: <UseEffect />
  },
  {
    title: 'UseLayoutEffect',
    path: '/UseLayoutEffect',
    component: <UseLayoutEffect />
  },
  {
    title: 'UseRef',
    path: '/UseRef',
    component: <UseRef />
  }
]

export default routes