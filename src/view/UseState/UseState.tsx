// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useMemo, useCallback } from 'react';
// import logo from './logo.svg';

/***
 * useState
 * React 假设当你多次调用 useState 的时候，你能保证每次渲染时它们的调用顺序是不变的。
  通过在函数组件里调用它来给组件添加一些内部 state，React会 在重复渲染时保留这个 state
  useState 唯一的参数就是初始 state
  useState 会返回一个数组：一个 state，一个更新 state 的函数

  在初始化渲染期间，返回的状态 (state) 与传入的第一个参数 (initialState) 值相同
  你可以在事件处理函数中或其他一些地方调用这个函数。它类似 class 组件的 this.setState，但是它不会把新的 state 和旧的 state 进行合并，而是直接替换
 */
function Child1(porps: { num: any; handleClick: any; }) {
  console.log('child1', porps)
  const { num, handleClick } = porps
  return (
    <div
      onClick={() => {
        handleClick(num + 1)
      }}
    >
      child
    </div>
  )
}

function Child2(porps: { text: any; handleClick: any; }) {
  console.log('child2', porps)
  const { text, handleClick } = porps
  return (
    <div
      onClick={() => {
        handleClick(text + 1)
      }}
    >
      grandson
    </div>
  )
}

function Parent() {
  console.log('creat')
  let [num, setNum] = useState(0)
  let [text, setText] = useState(1)

  return (
    <div>
      <Child1 num={num} handleClick={setNum} />
      <Child2 text={text} handleClick={setText} />
    </div>
  )
}

/***
 * useState
 * 每次渲染都是独立的闭包
   每一次渲染都有它自己的 Props 和 State
   每一次渲染都有它自己的事件处理函数
   当点击更新状态的时候，函数组件都会重新被调用，那么每次渲染都是独立的，取到的值不会受后面操作的影响
*/

function Counter() {
  let [number, setNumber] = useState(0)
  function alertNumber() {
    setTimeout(() => {
      alert(number)
    }, 3000);
  }
  return(
    <>
      <p>{ number }</p>
      <button onClick={() => setNumber(number + 1)}>+</button>
      <button onClick={alertNumber}>alertNumber</button>
    </>
  )
}

/**
 *  useState
 *  函数式更新
 *  如果新的 state 需要通过使用先前的 state 计算得出，那么可以将回调函数当做参数传递给 setState。该回调函数将接收先前的 state，并返回一个更新后的值。
 */

function Counter1(){
  let [number, setNumber] = useState(0)
  function lazy(){
    setTimeout(() => {
        // setNumber(number+1)
        // 这样每次执行时都会去获取一遍 state，而不是使用点击触发时的那个 state
        setNumber(number=>number+1)
    }, 3000)
  }
  return (
    <>
        <p>{number}</p>
        <button onClick={()=>setNumber(number+1)}>+</button>
        <button onClick={lazy}>lazy</button>
    </>
  )
}

/**
 * 惰性初始化 state
  initialState 参数只会在组件的初始化渲染中起作用，后续渲染时会被忽略
  如果初始 state 需要通过复杂计算获得，则可以传入一个函数，在函数中计算并返回初始的 state，此函数只在初始渲染时被调用
*/

function Counter2(props: { number: number; }){
  console.log('Counter2 render');
  // 这个函数只在初始渲染时执行一次，后续更新状态重新渲染组件时，该函数就不会再被调用
  function getInitState(){
    return {number:props.number};
  }
  let [counter,setCounter] = useState(getInitState);
  return (
    <>
      <p>{counter.number}</p>
      <button onClick={()=>setCounter({number: counter.number + 1})}>+</button>
      <button onClick={()=>setCounter(counter)}>setCounter</button>
    </>
  )
}

/**
 * Object.is （浅比较）
  Hook 内部使用 Object.is 来比较新/旧 state 是否相等
  与 class 组件中的 setState 方法不同，如果你修改状态的时候，传的状态值没有变化，则不重新渲染
  与 class 组件中的 setState 方法不同，useState 不会自动合并更新对象。你可以用函数式的 setState 结合展开运算符来达到合并更新对象的效果
*/

function Counter3(){
  const [counter,setCounter] = useState({name:'计数器', number:0});
  console.log('render Counter3')
  // 如果你修改状态的时候，传的状态值没有变化，则不重新渲染
  return (
    <>
      <p>{counter.name}:{counter.number}</p>
      <button onClick={() => setCounter({...counter, number:counter.number+1})}>+</button>
      <button onClick={() => setCounter(counter)}>++</button>
    </>
  )
}

/**
 * 减少渲染次数
  默认情况，只要父组件状态变了（不管子组件依不依赖该状态），子组件也会重新渲染
  一般的优化：
  类组件：可以使用 pureComponent ；
  函数组件：使用 React.memo ，将函数组件传递给 memo 之后，就会返回一个新的组件，新组件的功能：如果接受到的属性不变，则不重新渲染函数；
  但是怎么保证属性不会变尼？这里使用 useState ，每次更新都是独立的，const [number,setNumber] = useState(0) 也就是说每次都会生成一个新的值（哪怕这个值没有变化），即使使用了 React.memo ，也还是会重新渲染
*/

function SubCounter(props: {onClick: any, data: {number: any}}){
  console.log('SubCounter render')
  return (
    <button onClick={props.onClick}>{props.data.number}</button>
  )
}

let oldData: any, oldAddClick: any;
function Counter4(){
  console.log('Counter render')
  const [name,setName]= useState('计数器')
  const [number,setNumber] = useState(0)
  // 父组件更新时，这里的变量和函数每次都会重新创建，那么子组件接受到的属性每次都会认为是新的
  // 所以子组件也会随之更新，这时候可以用到 useMemo
  // 有没有后面的依赖项数组很重要，否则还是会重新渲染
  // 如果后面的依赖项数组没有值的话，即使父组件的 number 值改变了，子组件也不会去更新
  //const data = useMemo(()=>({number}),[]);
  const data = useMemo(() => ({number}),[number])
  console.log('data===oldData ',data === oldData, data)
  oldData = data;
  
  // 有没有后面的依赖项数组很重要，否则还是会重新渲染
  const addClick = useCallback(()=>{
    setNumber(number + 1)
  },[number])
  console.log('addClick===oldAddClick ',addClick === oldAddClick)
  oldAddClick = addClick
  return (
    <>
      <input type="text" value={name} onChange={(e)=>setName(e.target.value)}/>
      <SubCounter data={data} onClick={addClick}/>
    </>
  )
}


function UseState() {
  return (
    <div>
      <Parent />
      <Counter />
      <Counter1 />
      <Counter2 number={1} />
      <Counter3 />
      <Counter4 />
    </div>
  );
}

export default UseState;