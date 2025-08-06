# JavaScript 基础知识总结

## 变量和数据类型

JavaScript 中有以下几种基本数据类型：

- **Number**: 数字类型
- **String**: 字符串类型  
- **Boolean**: 布尔类型
- **Undefined**: 未定义类型
- **Null**: 空类型
- **Symbol**: 符号类型（ES6新增）
- **BigInt**: 大整数类型（ES2020新增）

```javascript
let num = 42;
let str = "Hello World";
let bool = true;
let undef = undefined;
let empty = null;
```

## 函数

### 函数声明
```javascript
function greet(name) {
    return `Hello, ${name}!`;
}
```

### 箭头函数
```javascript
const greet = (name) => `Hello, ${name}!`;
```

## 数组方法

常用的数组方法：

```javascript
const arr = [1, 2, 3, 4, 5];

// map: 转换数组
const doubled = arr.map(x => x * 2);

// filter: 过滤数组
const evens = arr.filter(x => x % 2 === 0);

// reduce: 归约数组
const sum = arr.reduce((acc, x) => acc + x, 0);
```

这些是 JavaScript 开发的基础知识点。