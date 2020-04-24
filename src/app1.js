import Vue from 'vue'
import Button from './button.vue'
import Icon from './icon.vue'
import ButtonGroup from './button-group.vue'

Vue.component('g-button',Button)
Vue.component('g-icon',Icon)
Vue.component('g-button-group',ButtonGroup)

new Vue({
  el: '#app',
  data: {
    loading1: false,
    loading2: true,
    loading3: false,
  }
})

// 单元测试
import chai from 'chai'
import spies from 'chai-spies'
chai.use(spies)
const expect = chai.expect
try{
  {
    console.log(Button)
    /*
    Button其实就是一个对象而已。对象的话我们无法通过它实例化一个东西,所以需要转换为一个函数
    */
    const Constructor = Vue.extend(Button)
    console.log(Constructor)
    const vm = new Constructor()
    // 这个button就是一个Vue实例,你把这个button放到页面里就是一个按钮。我们在页面中写一个坑 <div id="test"></div>
    vm.$mount('#test')
    // 我们在页面中使用 g-vm 组件标签来引用这个组件,直接在标签属性上传递数据到组件内部,但是我们这种写法怎么传递数据呢？
    const vm1 = new Constructor({
      propsData: {
        icon: 'settings'
      }
    })
    vm1.$mount('#test1') // 带有icon的SVG的button组件渲染后应该是有一个use标签的
    let useElement = vm1.$el.querySelector('use')
    console.log(useElement)
    // 那么我主观认为这个use标签的数据
    // expect(useElement.getAttribute('xlink:href')).to.eq('settings')
    // 此时我们发现控制台报错了。因为你的主观判断expect(useElement.getAttribute('xlink:href')).to.eq('settings')错误了
    /*
    我们在控制台展开这个错误可以看到
    actual: "#i-settings"
    expected: "settings"
    message: "expected '#i-settings' to equal 'settings'"
    showDiff: true
    实际上button1组件渲染到页面时内部的use标签的xlink:href属性值是 #i-settings,但是你希望的是settings
    */
    expect(useElement.getAttribute('xlink:href')).to.eq('#i-settings')
    // 你的这个主观断言确实就是对的。那么你这条测试用例（Test Case）通过了。
  }

  {
    // 测试button.vue组件的loading
    const Constructor = Vue.extend(Button)
    const vm = new Constructor({
      propsData: {
        icon: 'settings',
        loading: true
      }
    })
    vm.$mount() // 不需要一定要挂载到页面上,可以直接放到内存中,只要你在下面的断言是正确的话就OK,如果有错误就会输出控制台
    let useElement = vm.$el.querySelector('use')
    let href = useElement.getAttribute('xlink:href')
    expect(href).to.eq('#i-loading')
    // 有的人问了, 不是传了settings的icon吗？又给了loading为true,那么应该有两个icon啊,你怎么断定拿到的icon的use标签的属性是loading而不是settings呢？
    // 这就是你希望的断言啊。当你loading存在的时候settings就不应该存在啊,这就是你组件的需求啊
    // 结果控制台没有报错。也就是对的
    // expect(href).to.eq('#i-settings') 这句断言就错了
  }

  {
    // 测试icon在左边还是右边
    const Constructor = Vue.extend(Button)
    const vm = new Constructor({
      propsData: {
        icon: 'settings',
        loading: true
      }
    })
    const div = document.createElement('div')
    document.body.appendChild(div)
    vm.$mount(div)
    let svg = vm.$el.querySelector('svg')
    let { order } = window.getComputedStyle(svg)
    // expect(order).to.eq(1)
    // 我们发现断言出现错误了。实际上是 '1',但是你希望的是1。因为CSS的所有属性值都是字符串!!!
    expect(order).to.eq('1')
    /*
    注意：
    我们发现如果你是button.$mount()只是把元素挂在内存的话,那么expect(order).to.eq(1)这句断言就是错的。
    控制台断言报错：实际上svg标签的order的CSS属性值是''空,但是你期望的是1
    你没有把这个元素挂载到页面上去,如果元素不在页面中的话,会出现什么问题？页面就不渲染这个元素,那么CSS就不会加到这个button上面，你button都不在页面上,css怎么加上去啊
    */
    // 但是这样的话,页面好乱啊,怎么办？
    vm.$el.remove()
    vm.$destroy()
    // 这样的话,一旦测试通过的话就会执行到这里,将测试的标签从页面中移除,button组件销毁掉。否则的话你写很多测试用例,又不删除这些的话内存就很容易泄露占满
    // 一旦你断言出错的话,代码也就停住了,不会走到这里删除的操作。
  }

  {
    // 测试icon在左边还是右边
    const Constructor = Vue.extend(Button)
    const vm = new Constructor({
      propsData: {
        icon: 'settings',
        iconPosition: 'right'
      }
    })
    const div = document.createElement('div')
    document.body.appendChild(div)
    vm.$mount(div)
    let svg = vm.$el.querySelector('svg')
    let { order } = window.getComputedStyle(svg)
    expect(order).to.eq('2')
    vm.$el.remove()
    vm.$destroy()
  }

  {
    // 触发click
    const Constructor = Vue.extend(Button)
    const vm = new Constructor({
      propsData: {
        icon: 'settings'
      }
    })
    vm.$mount() // 点击的话不像CSS那样需要渲染所以直接放到内存中即可
    vm.$on('click',function() { // 给button监听click事件
      console.log(1)
    })
    // 那么我们期待什么呢？我们希望上面的click绑定的回调函数被执行
    let button = vm.$el
    button.click()
    // 但是这样写是不行的,你压根无法写断言啊。所以我们需要另外一个方式mock
  }

  {
    // 使用 chai-spies 测试监听函数
    const Constructor = Vue.extend(Button)
    const vm = new Constructor({
      propsData: {
        icon: 'settings'
      }
    })
    vm.$mount()
    let spy = chai.spy(function(){

    })
    vm.$on('click',spy)
    let button = vm.$el
    button.click()
    expect(spy).to.have.been.called()
  }
}catch(error){
  window.errors = [error]
}finally{
  window.errors&&window.errors.forEach(error=>{
    console.error(error.message)
  })
}
