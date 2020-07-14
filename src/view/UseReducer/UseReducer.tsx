// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useReducer } from 'react';

/**
 * useReducer 和 redux 中 reducer 很像
  useState 内部就是靠 useReducer 来实现的
  useState 的替代方案，它接收一个形如 (state, action) => newState 的 reducer，并返回当前的 state 以及与其配套的 dispatch 方法
  在某些场景下，useReducer 会比 useState 更适用，例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等
*/

// let initialState = 0
// 如果你希望初始状态是一个{number:0}
// 可以在第三个参数中传递一个这样的函数 ()=>({number:initialState})
// 这个函数是一个惰性初始化函数，可以用来进行复杂的计算，然后返回最终的 initialState
// const [state, dispatch] = useReducer(reducer, initialState, init)
const initialState = 0
function reducer(state: { number: number; }, action: { type: any; }) {
  switch (action.type) {
    case 'increment':
      return {number: state.number + 1}
    case 'decrement':
      return {number: state.number - 1}
    default:
      throw new Error()
  }
}

function init(initialState: any){
  return {number: initialState}
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState, init)
  return (
    <>
      Count: {state.number}
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  )
}

function UseReducer() {
  return (
    <div>
      <Counter/>
    </div>
  );
}

export default UseReducer;