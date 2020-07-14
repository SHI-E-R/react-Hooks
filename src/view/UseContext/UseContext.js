/* eslint-disable no-unused-vars */
import React,{ 
  useState,
  memo,
  useMemo,
  useCallback,
  useReducer,
  createContext,
  useContext
} from 'react'
import ReactDOM from 'react-dom'

const initialState = 0
function reducer(state=initialState, action){
  switch(action.type){
    case 'ADD':
      return {number: state.number + 1}
    default:
      break
  }
}

const CounterContext = createContext()
// 第一种获取 CounterContext的方法  不使用hook
function SubCounterOne() {
  return (
    <CounterContext.Consumer>
      {
        value => (
          <>
            <p>{value.state.number}</p>
            <button onClick={() => value.dispatch({type: 'ADD'})}>+</button>
          </>
        )
      }
    </CounterContext.Consumer>
  )
}
// 第二种使用hook
function SubCounter() {
  const {state, dispatch} = useContext(CounterContext)
  return (
    <>
      <p>{state.number}</p>
      <button onClick={() => dispatch({type: 'ADD'})}>+</button>
    </>
  )
}

function Counter() {
  const [state, dispatch] = useReducer((reducer), initialState, () => ({number: initialState}))
  return (
    <CounterContext.Provider value={{state, dispatch}}>
      <SubCounter />
    </CounterContext.Provider>
  )
}

function UseContext() {
  return (
    <div>
      <Counter />
    </div>
  );
}

export default UseContext