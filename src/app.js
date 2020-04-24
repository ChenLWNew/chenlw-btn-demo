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
const expect = chai.expect
{
  console.log(Button)
  /*
  Button其实就是一个对象而已。对象的话我们无法通过它实例化一个东西,所以需要转换为一个函数
  */
  const Constructor = Vue.extend(Button)
  console.log(Constructor)
  const button = new Constructor()
  // 这个button就是一个Vue实例,你把这个button放到页面里就是一个按钮。我们在页面中写一个坑 <div id="test"></div>
  button.$mount('#test')
  // 我们在页面中使用 g-button 组件标签来引用这个组件,直接在标签属性上传递数据到组件内部,但是我们这种写法怎么传递数据呢？
  const button1 = new Constructor({
    propsData: {
      icon: 'settings'
    }
  })
  button1.$mount('#test1') // 带有icon的SVG的button组件渲染后应该是有一个use标签的
  let useElement = button1.$el.querySelector('use')
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
  const button = new Constructor({
    propsData: {
      icon: 'settings',
      loading: true
    }
  })
  button.$mount() // 不需要一定要挂载到页面上,可以直接放到内存中,只要你在下面的断言是正确的话就OK,如果有错误就会输出控制台
  let useElement = button.$el.querySelector('use')
  let href = useElement.getAttribute('xlink:href')
  expect(href).to.eq('#i-loading')
  // 有的人问了, 不是传了settings的icon吗？又给了loading为true,那么应该有两个icon啊,你怎么断定拿到的icon的use标签的属性是loading而不是settings呢？
  // 这就是你希望的断言啊。当你loading存在的时候settings就不应该存在啊,这就是你组件的需求啊
  // 结果控制台没有报错。也就是对的
  // expect(href).to.eq('#i-settings') 这句断言就错了
}
