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
