// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect, useRef, createRef, forwardRef, useImperativeHandle } from 'react';

/**
 * useRef
 * 类组件、React 元素用 React.createRef，函数组件使用 useRef
 * useRef 返回一个可变的 ref 对象，其 current 属性被初始化为传入的参数（initialValue）
 * useRef 返回的 ref 对象在组件的整个生命周期内保持不变，也就是说每次重新渲染函数组件时，
 * 返回的ref 对象都是同一个（使用 React.createRef ，每次重新渲染组件都会重新创建 ref）
*/

function Parent() {
  let [number, setNumber] = useState(0)
  return (
    <>
      <Child />
      <button onClick={() => setNumber(number + 1)}>+</button>
    </>
  )
}

let input: any
function Child() {
  const inputRef: any = useRef()
  console.log('input === inputRef', input === inputRef)
  input = inputRef
  function getFocus() {
    inputRef.current.focus()
  }
  return (
    <>
      <input type='text' ref={inputRef} />
      <button onClick={getFocus}>获取焦点</button>
    </>
  )
}

/**
 * forwardRef
 * 因为函数组件没有实例，所以函数组件无法像类组件一样可以接收 ref 属性
 * forwardRef 可以在父组件中操作子组件的 ref 对象
 * forwardRef 可以将父组件中的 ref 对象转发到子组件中的 dom 元素上
 * 子组件接受 props 和 ref 作为参数
*/

function Child1(props: any, ref: any) {
  return (
    <input type='text' ref={ref} />
  )
}
// Child1 = React.forwardRef(Child1)
// 回头完善一下
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Parent1() {
  let [number, setNumber] = useState(0)
  // 在使用类组件的时候，创建 ref 返回一个对象，该对象的 current 属性值为空
  // 只有当它被赋给某个元素的 ref 属性时，才会有值
  // 所以父组件（类组件）创建一个 ref 对象，然后传递给子组件（类组件），子组件内部有元素使用了
  // 那么父组件就可以操作子组件中的某个元素
  // 但是函数组件无法接收 ref 属性 <Child ref={xxx} /> 这样是不行的
  // 所以就需要用到 forwardRef 进行转发
  const inputRef: any = useRef() // {current: ''}
  function getFocus() {
    inputRef.current.value = 'focus'
    inputRef.current.focus()
  }
  return (
    <div>
      <Child1 />
      <button onClick={() => setNumber(number + 1)}>+</button>
      <button onClick={getFocus}>获得焦点</button>
    </div>
  )
}

/**
 * useImperativeHandle
 * useImperativeHandle可以让你在使用 ref 时，自定义暴露给父组件的实例值，不能让父组件想干嘛就干嘛
 * 在大多数情况下，应当避免使用 ref 这样的命令式代码。useImperativeHandle 应当与 forwardRef 一起使用
 * 父组件可以使用操作子组件中的多个 ref
*/

function Child2(props: any, parentRef: any) {
  // 子组件自己内部创建ref
  let focuRef: any = useRef()
  let inputRef: any = useRef()
  useImperativeHandle(parentRef, () => {
    // 这个函数会返回一个对象
    // 该对象会作为父组件 current 属性的值
    // 通过这种方式，父组件可以使用操作子组件的多个 ref
    return {
      focuRef,
      inputRef,
      name: '计算器',
      focus() {
        focuRef.current.focus()
      },
      changeText(text: any) {
        inputRef.current.value = text
      }
    }
  })
  return (
    <>
      <input ref={focuRef} />
      <input ref={inputRef} />
    </>
  )
}
// Child2 = forwardRef(Child2)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Parent2(){
  const parentRef: any = useRef() // {current:''}
  function getFocus(){
    parentRef.current.focus()
    // 因为子组件中没有定义这个属性，实现了保护，所以这里的代码无效
    parentRef.current.addNumber(666)
    parentRef.current.changeText('<script>alert(1)</script>');
    console.log(parentRef.current.name)
  }
  return (
      <>
        <Child2 ref={parentRef}/>
        <button onClick={getFocus}>获得焦点</button>
      </>
  )
}


function UseLayoutEffect() {
  return (
    <div>
      <Parent />
      {/* <Parent1 /> */}
      {/* <Parent2 /> */}
    </div>
  )
}

export default UseLayoutEffect