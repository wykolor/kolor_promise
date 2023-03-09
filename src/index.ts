const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

type Status = typeof PENDING | typeof FULFILLED | typeof REJECTED;

type defaultFuncType = (...args: any[]) => void;

class MyPromise {
  // executor 是一个执行器，进入会立即执行
  // 并传入 resolve 和 reject 方法
  constructor(executor: defaultFuncType) {
    executor(this.resolve, this.reject)
  }

  // 存储状态的变量 初始值是 pending
  status: Status  = PENDING;

  // 成功之后的值
  value: any = null;

  // 失败之后的原因
  reason: any = null;

  // 存储多个成功回调函数
  onFulfilledCallbacks: defaultFuncType[] = [];

  // 存储多个失败回调函数
  onRejectCallbacks: defaultFuncType[] = [];

  // resolve 和 reject 为什么使用箭头函数？
  // 如果直接调用的话，普通函数的 this 会指向 window 或者 undefined
  // 箭头函数就可以指向当前的实列对象 （箭头函数定义时决定 this 指向）

  // 更改成功后的状态
  resolve = (value: any) => {
    // 只有状态是 pending 时，才执行状态修改
    if(this.status === PENDING) {
      // 状态修改为成功
      this.status = FULFILLED;

      // 并保存成功之后的值
      this.value = value;
      
      // 遍历存储的成功回调函数集合，一个个按照顺序执行一遍
      while (this.onFulfilledCallbacks.length) {
        this.onFulfilledCallbacks.shift()?.(value);
      }
    }
  }

  // 更改失败后的状态
  reject = (reason: any) => {
    // 只有状态是 pending 时，才修改状态
    if(this.status === PENDING) {
      // 修改状态为失败
      this.status = REJECTED;

      // 并保存失败原因
      this.reason = reason;

      // 遍历存储的失败函数集合，一个个按照顺序执行一遍
      while(this.onRejectCallbacks.length) {
        this.onRejectCallbacks.shift()?.(reason);
      }
    }
  }

  then(onFulfilled: defaultFuncType, onReject: defaultFuncType) {
    if(this.status === FULFILLED) {
      onFulfilled(this.value)
    } else if(this.status === REJECTED) {
      onReject(this.reason)
    } else if(this.status === PENDING) {
      this.onFulfilledCallbacks.push(onFulfilled);
      this.onRejectCallbacks.push(onReject);
    }
  }
}

export default MyPromise;