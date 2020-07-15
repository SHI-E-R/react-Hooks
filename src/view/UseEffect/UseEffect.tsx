// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { Component, useState, useEffect } from 'react';

/**
 * useEffect
 * effect（副作用）：指那些没有发生在数据向视图转换过程中的逻辑，如 ajax 请求、访问原生dom 元素、本地持久化缓存、绑定/解绑事件、添加订阅、设置定时器、记录日志等。
  副作用操作可以分两类：需要清除的和不需要清除的。
  原先在函数组件内（这里指在 React 渲染阶段）改变 dom 、发送 ajax 请求以及执行其他包含副作用的操作都是不被允许的，因为这可能会产生莫名其妙的 bug 并破坏 UI 的一致性
  useEffect 就是一个 Effect Hook，给函数组件增加了操作副作用的能力。它跟 class 组件中的 componentDidMount、componentDidUpdate 和 componentWillUnmount 具有相同的用途，只不过被合并成了一个 API
  useEffect 接收一个函数，该函数会在组件渲染到屏幕之后才执行，该函数有要求：要么返回一个能清除副作用的函数，要么就不返回任何内容
  与 componentDidMount 或 componentDidUpdate 不同，使用 useEffect 调度的 effect 不会阻塞浏览器更新屏幕，这让你的应用看起来响应更快。大多数情况下，effect 不需要同步地执行。在个别情况下（例如测量布局），有单独的 useLayoutEffect Hook 供你使用，其 API 与 useEffect 相同。
*/

/**
 *  使用 class 组件实现修改标题
 *  在这个 class 中，我们需要在两个生命周期函数中编写重复的代码，这是因为很多情况下，我们希望在组件加载和更新时执行同样的操作。
 *  我们希望它在每次渲染之后执行，但 React 的 class 组件没有提供这样的方法。
 *  即使我们提取出一个方法，我们还是要在两个地方调用它。而 useEffect 会在第一次渲染之后和每次更新之后都会执行
*/

// class Counter extends React.Component{
//   state = {number:0}
//   add = ()=>{
//     this.setState({number:this.state.number + 1})
//   }
//   componentDidMount() {
//     this.changeTitle()
//   }
//   componentDidUpdate() {
//     this.changeTitle()
//   }
//   changeTitle = () => {
//     document.title = `你已经点击了${this.state.number}次`;
//   }
//   render(){
//     return (
//       <>
//         <p>{this.state.number}</p>
//         <button onClick={this.add}>+</button>
//       </>
//     )
//   }
// }

/**
 * 使用 useEffect 来实现修改标题
 * 每次我们重新渲染，都会生成新的 effect，替换掉之前的。某种意义上讲，effect 更像是渲染结果的一部分 —— 每个 effect 属于一次特定的渲染。
 * 
*/

function Counter() {
  const [number, setNumber] = useState(0)
  // useEffcet里面的这个函数会在第一次渲染之后和更新后执行
  // 相当于 componetDidMount 和 componentDidUpdate
  useEffect(() => {
    document.title = `你点击了${number}次`
  })
  return (
    <>
      <p>{number}</p>
      <button onClick={() => setNumber(number + 1)}>+</button>
    </>
  )
}

/**
 * 清除副作用
 * 副作用函数还可以通过返回一个函数来指定如何清除副作用，为防止内存泄漏，清除函数会在组件卸载前执行。
 * 如果组件多次渲染，则在执行下一个 effect 之前，上一个 effect 就已被清除。
 * 
*/

function Counter1() {
  let [number, setNumber] = useState(0)
  let [text, setText] = useState('')
  // 相当于 componetDidMount 和 componentDidUpdate
  useEffect(() => {
    console.log('开启一个定时器')
    let $timer = setInterval(() => {
      setNumber(number => number + 1)
    }, 1000)
    // useEffect 如果返回一个函数的话，该函数会在组件卸载和更新时调用
    // useEffect 在执行副作用函数之前，会先调用上一次返回的函数
    // 如果要清除副作用，要么返回一个清除副作用的函数
    return () => {
      console.log('destroy effect')
      clearInterval($timer)
    }
  })
  // },[]) //要么在这里传入一个空的依赖项数组，这样就不会去重复执行
  return (
    <div>
      <input type="text" value={text} onChange={(e) => setText(e.target.value)}/>
      <p>{number}</p>
      <button>+</button>
    </div>
  )
}

/**
 * 跳过 effect 进行性能优化
 * 依赖项数组控制着 useEffect 的执行
 * 如果某些特定值在两次重渲染之间没有发生变化，你可以通知 React 跳过对 effect 的调用，只要传递数组作为 useEffect 的第二个可选参数即可
 * 如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行
 * 推荐启用 eslint-plugin-react-hooks 中的 exhaustive-deps 规则。此规则会在添加错误依赖时发出警告并给出修复建议。
 * 
*/

function Counter2 () {
  let [number, setNumber] = useState(0)
  let [text, setText] = useState('')
  useEffect(() => {
    console.log('useEffect')
    setInterval(() => {
      setNumber(number => number + 1)
    }, 1000)
  }, [text]) // 数组表示 effect 依赖的变量，只有当这个变量发生改变之后才会重新执行 efffect 函数
  return (
    <div>
      <input type="text" value={text} onChange={(e) => setText(e.target.value)}/>
      <p>{number}</p>
      <button>+</button>
    </div>
  )
}

/**
 *  使用多个 Effect 实现关注点分离
 * 使用 Hook 其中一个目的就是要解决 class 中生命周期函数经常包含不相关的逻辑，但又把相关逻辑分离到了几个不同方法中的问题
*/

// 类组件版
// class FriendStatusWithCounter extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { count: 0, isOnline: null };
//     this.handleStatusChange = this.handleStatusChange.bind(this);
//   }

//   componentDidMount() {
//     document.title = `You clicked ${this.state.count} times`;
//     ChatAPI.subscribeToFriendStatus(
//       this.props.friend.id,
//       this.handleStatusChange
//     );
//   }

//   componentDidUpdate() {
//     document.title = `You clicked ${this.state.count} times`;
//   }

//   componentWillUnmount() {
//     ChatAPI.unsubscribeFromFriendStatus(
//       this.props.friend.id,
//       this.handleStatusChange
//     );
//   }

//   handleStatusChange(status) {
//     this.setState({
//       isOnline: status.isOnline
//     });
//   }
// ...

/**
 * 可以发现设置 document.title 的逻辑是如何被分割到 componentDidMount 和 componentDidUpdate 中的，
 * 订阅逻辑又是如何被分割到 componentDidMount 和 componentWillUnmount 中的。
 * 而且 componentDidMount 中同时包含了两个不同功能的代码。这样会使得生命周期函数很混乱。
 * Hook 允许我们按照代码的用途分离他们， 而不是像生命周期函数那样。React 将按照 effect 声明的顺序依次调用组件中的 每一个 effect。
*/

// Hooks 版
// function FriendStatusWithCounter(props) {
//   const [count, setCount] = useState(0);
//   useEffect(() => {
//     document.title = `You clicked ${count} times`;
//   });

//   const [isOnline, setIsOnline] = useState(null);
//   useEffect(() => {
//     function handleStatusChange(status) {
//       setIsOnline(status.isOnline);
//     }

//     ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
//     return () => {
//       ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
//     };
//   });
//   // ...
// }

function UseEffect() {
  return (
    <div>
      <Counter />
      <Counter1 />
      <Counter2 />
    </div>
  );
}

export default UseEffect