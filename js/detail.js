/*
  请求单一一条商品的所有信息, 按照 html 格式渲染

  问题: 请求哪一条商品的信息 ?
    + 在列表页点击哪一个 商品, 就是哪一个商品的信息
    + 点击事件发生在 list.html 页面, 请求商品详情信息发生在 detail.html 页面
    + 点击商品的时候, 把商品 id 存储在 cookie 里面
    + 在详情页拿到商品 id, 根据 id 去请求这一条商品

  问题: 如何跨页面进行通讯 ?
    + 登录的时候, 在 login.html 得到的用户昵称信息
    + 使用的时候, 在 index.html 使用的用户昵称信息
*/

/*
  加入购物车的事件
    + 只要我组装出一个数组来
    + 存储到 lcoalStorage 里面
    + 将来在 cart.html 页面把这个数组拿出来

  4. 当你点击 加入购物车的时候
    + 向数组里面组装的过程
    4-1. 事件绑定给谁 ?
      => 因为 addCart 是渲染的, 所以绑定给 goodsInfo 进行事件委托
    4-2. 拿到 localStorage 里面有没有购物车数组
    4-3. 确定数组中有没有这个数据
      => 当我两次加入同一个数据的时候, 要判断一下原先有没有这个数据
    4-4. 将数据再次存储到 localStorage 中

  5. 操作 加 减 按钮, 让 input 里面的数字 ++ 或者 --
    5-1. 事件委托, 委托给 goodsInfo
*/

// jQuery 的入口函数
$(function () {

    // 0. 提前准备一个变量拿出来商品信息
    let info = null
  
    // 1. 拿到 cookie 中的 goods_id 属性
    const id = getCookie('goods_id')
  
    // 2. 根据 id 信息去请求商品数据
    getGoodsInfo()
    async function getGoodsInfo() {
      const goodsInfo = await $.get('./server/getGoodsInfo.php', { goods_id: id }, null, 'json')
  
      // 3. 进行页面的渲染
      bindHtml(goodsInfo.info)
  
      // 给提前准备好的变量进行赋值
      info = goodsInfo.info
    }
  
    function bindHtml(info) {
      console.log(info)
  
      // 1. 渲染左边放大镜位置
      $('.box').html(`
        <div class="show">
          <img src="${ info.goods_big_logo }" alt="">
          <div class="mask"></div>
        </div>
        <div class="list">
          <p class="active">
            <img src="${ info.goods_small_logo }" alt="">
          </p>
        </div>
      `)
  
      // 2. 商品详细信息渲染
      $('.goodsInfo').html(`
        <p class="desc">${ info.goods_name }</p>
        <div class="btn-group size">
          <button type="button" class="btn btn-default">S</button>
          <button type="button" class="btn btn-default">M</button>
          <button type="button" class="btn btn-default">L</button>
          <button type="button" class="btn btn-default">XL</button>
        </div>
        <p class="price">
          ￥ <span class="text-danger">${ info.goods_price }</span>
        </p>
        <div class="num">
          <button class="subNum">-</button>
          <input type="text" value="1" class="cartNum">
          <button class="addNum">+</button>
        </div>
        <div>
          <button class="btn btn-success addCart">加入购物车</button>
          <button class="btn btn-warning continue"><a href="./list.html">继续去购物</a></button>
        </div>
      `)
  
      // 3. 商品参数渲染
      $('.goodsDesc').html(info.goods_introduce)
    }
  
    // 4. 加入购物车的操作
    $('.goodsInfo').on('click', '.addCart', function () {
      // 4-2. 拿到 localStorage 里面有没有数组
      // 如果你没有这个数组, 那么我就定义一个空数组
      // 如果你有, 我就用你的
      const cart = JSON.parse(window.localStorage.getItem('cart')) || []
  
      // 4-3. 判断一下 cart 数组里面有没有这个数据
      // 问题: 当前是哪一条数据 ? id
      // 如果 cart 里面有某一条数据和我的 id 一样
      // 表示我不需要添加内容了, 而是 ++
      // 如果 cart 里面没有某一条数据, 那么我要把当前这条数据 push 进去
      // 当前这一条数据是哪一条 ? info 存储进去
      // 如何判断 cart 中有没有 id 一样的数据
      // some 方法
      const flag = cart.some(item => item.goods_id === id)
      // 如果没有, 那么我就 push 进去
      if (flag) {
        // cart 里面 id 一样的这一条里面的 cart_number ++
        // 4-4. 如果有这个数据拿到这个信息
        // filter 方法返回的是一个数组
        const cart_goods = cart.filter(item => item.goods_id === id)[0]
        cart_goods.cart_number = cart_goods.cart_number - 0 + ($('.cartNum').val() - 0)
      } else {
        info.cart_number = 1
        // 表示没有
        cart.push(info)
      }
  
      // 4-5. 添加完毕还要存储到 localStorage 里面
      window.localStorage.setItem('cart', JSON.stringify(cart))
    })
  
    // 5. ++ -- 的事件
    $('.goodsInfo')
      .on('click', '.subNum', function () {
        // 拿到 input 的 value 值
        let num = $('.cartNum').val() - 0
        // 进行判断, 如果当前是 1, 那么什么都不做
        if (num === 1) return
        // 否则就进行 -- 操作, 然后在设置回去
        $('.cartNum').val(num - 1)
      })
      .on('click', '.addNum', function () {
        // 拿到 input 的 value 值
        let num = $('.cartNum').val() - 0
        // 否则就进行 -- 操作, 然后在设置回去
        $('.cartNum').val(num + 1)
      })
  })
  
  // const id = 15
  // var arr = [
  //   { goods_id: 13 },
  //   { goods_id: 14 },
  //   { goods_id: 15 },
  //   { goods_id: 16 },
  //   { goods_id: 17 }
  // ]
  // 判断数组里面有没有 goods_id 为 17 的
  // const flag = arr.some(item => item.goods_id === id)
  // // 从数组里面筛选出来满足条件的项
  // const info = arr.filter(item => item.goods_id === id)[0]
  // console.log(info)
  // console.log(flag)
  
  
  
  // 一个商品
  // var info = { goods_id: 13 }
  
  // const arr = [
  //   { goods_id: 13, num: 1 },
  //   { goods_id: 15, num: 1 },
  //   { goods_id: 16, num: 1 },
  //   { goods_id: 17, num: 1 }
  // ]
  
  // 需求: 把 info 按照合理的方式加入到 arr 里面
  // // 1. 判断 arr 里面是不是有 goods_id === 13 的
  // const flag = arr.some(item => item.goods_id === info.goods_id)
  
  // if (flag) {
  //   // 拿到 arr 里面 goods_id 为 13 的哪一条
  //   // { goods_id: 13 }
  //   const info = arr.filter(item => item.goods_id === info.goods_id)[0]
  //   info.num++
  
  // } else {
  //   info.num = 1
  //   arr.push(info)
  // }











  /*
  放大镜逻辑代码

  分析:
    0. 认识一些单词
      => show: 表示展示图片的盒子
      => mask: 表示图片上面移动的盒子
      => enalrge: 表示放大镜盒子
      => list: 表示列表盒子
    1. 移入移出
      => 移入的时候, mask 和 enlarge 盒子显示
      => 移出的时候, mask 和 enlarge 盒子消失
    2. 移动的时候
      => 移动的时候, mask 盒子正在 show 盒子范围内移动
      => 移动的时候, enlarge 盒子里面的背景图片位置跟着移动
    3. 点击列表项
      => 点击的时候, 可以一整套的切换图片
      => 切换 show 里面 img 标签的图片
      => 切换 enlarge 盒子的背景图片

  抽象对象
    + 属性(构造函数体内)
      0. 范围元素: 确定放大镜的整个范围
      1. show 盒子: 确定 mask 盒子的范围边界
      2. mask 盒子: 确定显示还是消失, 还要移动
      3. enlarge 盒子: 确定显示还是消失, 也要移动背景图片
      4. show 盒子的宽高: 确定比例使用
      5. enlarge 盒子的宽高: 确定比例使用
      6. 背景图片的尺寸: 确定比例使用
    + 方法(构造函数原型)
      0. 入口函数: 用来调用 1 2 3 4 这四个方法
      1. 调整比例: 这个方法一旦执行, 就可以调整好比例
      2. 移入移出: 这个方法一旦执行, 就可以绑定好移入移出事件
      3. 鼠标移动: 这个方法一旦执行, 光标在 show 盒子上移动的时候, 就可以元素联动了
      4. 图片切换: 这个方法一旦执行, 点击列表项的时候, 就能整体切换图片了
    + 书写一个构造函数
      => 拥有上面书写的属性和方法
*/

function Enlarge(ele) {
    // 0. 拿到范围元素
    this.ele = document.querySelector(ele)
    // 1. show 盒子
    this.show = this.ele.querySelector('.show')
    // 2. mask 盒子
    this.mask = this.ele.querySelector('.mask')
    // 3. enlarge 盒子
    this.enlarge = this.ele.querySelector('.enlarge')
    // 4. show 盒子的宽高
    // clientWidth 获取元素的尺寸(内容 + padding)
    this.show_width = this.show.clientWidth
    this.show_height = this.show.clientHeight
    // 5. enlarge 盒子的宽高
    // 因为 enlarge 盒子默认是隐藏的, clientWidth 不好使
    // 获取元素非行内样式
    this.enlarge_width = parseInt(window.getComputedStyle(this.enlarge).width)
    this.enlarge_height = parseInt(window.getComputedStyle(this.enlarge).height)
    // 6. 背景图片的尺寸
    // split() 按照你给出的符号切割字符串, 返回值是一个数组
    this.bg_width = parseInt(window.getComputedStyle(this.enlarge).backgroundSize.split(' ')[0])
    this.bg_height = parseInt(window.getComputedStyle(this.enlarge).backgroundSize.split(' ')[1])
    // 7. 获取列表盒子
    this.list = this.ele.querySelector('.list')
  
    // 直接启动入口函数
    this.init()
  }
  
  
  // 书写方法
  Enlarge.prototype.init = function () {
    // init 方法是被实例调用的
    // 所以这个位置的 this 就是当前实例
    this.setScale()
    this.overOut()
    this.move()
    this.change()
  }
  
  /*
    调整比例
  
        show 盒子尺寸        背景图片尺寸
      ---------------- = -------------------
        mask 盒子尺寸      enlarge 盒子尺寸
      mask 盒子尺寸 * 背景图片尺寸 = show 盒子尺寸 * enlarge 盒子尺寸
      mask 盒子尺寸 = show 盒子尺寸 * enlarge 盒子尺寸 / 背景图片尺寸
      + 根据公式计算出 mask 盒子尺寸, 给 mask 盒子进行赋值
  */
  
  Enlarge.prototype.setScale = function () {
    // 根据公式计算 mask 盒子的大小
    this.mask_width = this.show_width * this.enlarge_width / this.bg_width
    this.mask_height = this.show_height * this.enlarge_height / this.bg_height
  
    // 给 mask 盒子进行赋值
    this.mask.style.width = this.mask_width + 'px'
    this.mask.style.height = this.mask_height + 'px'
  }
  
  /*
    移入移出
      + 移入 show 盒子的时候, mask 和 enlarge 显示
      + 移出 show 盒子的时候, mask 和 enlarge 消失
  */
  Enlarge.prototype.overOut = function () {
    // 绑定移入事件
    // 之所以写成箭头函数, 是因为写了标准函数以后, 函数内部的 this 变成 show 盒子了
    // 就没有当前实例了, 所以改变了 箭头函数
    this.show.addEventListener('mouseover', () => {
      this.mask.style.display = 'block'
      this.enlarge.style.display = 'block'
    })
  
    // 绑定移出事件
    this.show.addEventListener('mouseout', () => {
      this.mask.style.display = 'none'
      this.enlarge.style.display = 'none'
    })
  }
  
  /*
    鼠标移动
      + 给 show 盒子绑定一个鼠标移动事件
      + 拿到光标的坐标 ? 哪一组 ?
        => client 一组: 可视窗口左上角
          -> 光标坐标点相对于浏览器可视窗口左上角的坐标位置
        => page 一组: 文档流左上角
          -> 光标坐标点相对于文档流左上角的坐标位置
        => offset 一组: 目标元素左上角
          -> 光标坐标点相对于目标元素左上角的坐标位置
      + 解决光标问题
        => 方法1:
          -> 不管我光标移动到哪里, 不管页面是不是滚动
          -> 有一个坐标原点不变的属性, page 一组
          -> 拿到 page 一组坐标 - box 距离页面左边和顶部的距离
        => 方法2:
          -> 只要 mask 不作为目标元素, 我拿到的就是相对于 show 盒子的坐标位置
          -> 需要一个 css 样式来帮忙
          -> pointer-events: none;
      + 给 mask 盒子进行赋值
        => 注意边界问题
      + 让背景图片跟随联动
          mask 盒子移动距离     enlarge 盒子的移动距离
        -------------------- = ---------------------
          mask 盒子的尺寸        enlarge 盒子的尺寸
        enlarge 盒子的移动距离 * mask 盒子的尺寸 = enlarge 盒子的尺寸 * mask 盒子移动距离
        enlarge 盒子的移动距离 = enlarge 盒子的尺寸 * mask 盒子移动距离 / mask 盒子的尺寸
      + 但是我们赋值的时候应该变成 负数, 赋值给 enlarge 盒子的背景图片位置
  
  */
  Enlarge.prototype.move = function () {
    // 给 show 盒子绑定 move 事件
    this.show.addEventListener('mousemove', e => {
      // 处理事件对象兼容
      e = e || window.event
      // 获取坐标点位
      // offsetTop 元素的偏移量, 根据元素参考父级来计算的偏移量
      // this.ele 元素的参考父级, body
      // const x = e.pageX - this.ele.offsetLeft
      // const y = e.pageY - this.ele.offsetTop
      // console.log(x, y)
  
      // 获取坐标点位
      let x = e.offsetX - this.mask_width / 2
      let y = e.offsetY - this.mask_height / 2
  
      // 边界值判断
      if (x <= 0) x = 0
      if (y <= 0) y = 0
      if (x >= this.show_width - this.mask_width) x = this.show_width - this.mask_width
      if (y >= this.show_height - this.mask_height) y = this.show_height - this.mask_height
  
      // 给 msak 盒子进行 left 和 top 的赋值
      this.mask.style.left = x + 'px'
      this.mask.style.top = y + 'px'
  
      // 根据公式计算出背景图片移动的距离
      const bg_x = this.enlarge_width * x / this.mask_width
      const bg_y = this.enlarge_height * y / this.mask_height
  
      // 赋值给 enlarge 盒子的 background-position 属性
      this.enlarge.style.backgroundPosition = `-${ bg_x }px -${ bg_y }px`
    })
  
  }
  
  
  /*
    给每一个列表项绑定点击事件
      + 事件绑定给谁 ?
        => 事件委托的形式把事件绑定给 this.list
      + 点击 img 标签的时候如何进行替换
        => 把每一组图片提前一自定义属性的形式书写在 img 标签上
        => 当你点击 img 标签的时候, 拿到你点击的这个 img 标签身上的自定义属性
        => 分别给 show 盒子里面的 img 标签赋值
        => 给 enlarge 盒子的 背景图片 赋值
      + 更换 p 标签的边框颜色
        => 更换 p 标签的 active 类名
        => 应该给所有 p 标签没有 active
        => 只给点击的这个元素的 父元素 添加 active
  */
  Enlarge.prototype.change = function () {
    // 绑定事件
    this.list.addEventListener('click', e => {
      // 处理事件对象兼容
      e = e || window.event
      // 处理事件目标兼容
      const target = e.target || e.srcElement
  
  
      // 判断点击的是哪一个 img 元素
      if (target.nodeName === 'IMG') {
        // 拿到点击元素的身上的自定义属性
        const show_url = target.getAttribute('show')
        const enlarge_url = target.getAttribute('enlarge')
  
        // 给元素进行赋值
        this.show.firstElementChild.src = show_url
        this.enlarge.style.backgroundImage = `url(${ enlarge_url })`
  
        // 给所有 p 标签取消 active
        for (let i = 0; i < this.list.children.length; i++) {
          this.list.children[i].classList.remove('active')
        }
  
        target.parentElement.classList.add('active')
      }
    })
  }