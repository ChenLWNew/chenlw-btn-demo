const expect = chai.expect
import Vue from 'vue'
import Button from '../src/button.vue'

Vue.config.productionTip = false
Vue.config.devtools = false

describe('Button', () => {
  it('存在.',() => {
    expect(Button).to.be.ok
  })

  it('可以设置icon', () => {
    const Constructor = Vue.extend(Button)
    const vm = new Constructor({
      propsData: {
        icon: 'settings'
      }
    }).$mount()
    const useElement = vm.$el.querySelector('use')
    expect(useElement.getAttribute('xlink:href')).to.equal('#i-settings')
    vm.$destroy()
  })

  it('可以设置loading', () => {
    const Constructor = Vue.extend(Button)
    const vm = new Constructor({
      propsData: {
        icon: 'settings',
        loading: true
      }
    }).$mount()
    const useElements = vm.$el.querySelectorAll('use')
    expect(useElements.length).to.equal(1)
    expect(useElements[0].getAttribute('xlink:href')).to.equal('#i-loading')
    vm.$destroy()
  })

  it('icon默认的order是1', () => {
    const div = document.createElement(div)
    document.body.append(div)
    const Constructor = Vue.extend(Button)
    const vm = new Constructor({
      propsData: {
        icon: 'settings'
      }
    }).$mount(div)
    const icon = vm.$el.querySelector('SVG')
    expect(getComputedStyle(icon).order).to.eq('1')
    vm.$el.remove()
    vm.$destroy()
  })

  it('设置iconPosition可以改变order', () => {
    const div = document.createElement(div)
    document.body.append(div)
    const Constructor = Vue.extend(Button)
    const vm = new Constructor({
      propsData: {
        icon: 'settings',
        iconPosition: 'right'
      }
    }).$mount(div)
    const icon = vm.$el.querySelector('SVG')
    expect(getComputedStyle(icon).order).to.eq('2')
    vm.$el.remove()
    vm.$destroy()
  })

  it('点击button触发click事件', () => {
    const Constructor = Vue.extend(Button)
    const vm = new Constructor({
      propsData: {
        icon: 'settings'
      }
    }).$mount()
    const callback = sinon.fake()
    vm.$on('click',callback)
    vm.$el.click()
    expect(callback).to.have.been.called
  })
  /*
  这里我要解释一下：
  你在谷歌控制台写一个函数 f1=function(){console.log(1)}
  问题是,这个回调函数 f1() 你是执行了,可是从技术方面来说你怎么知道他被调用了,无法
  所以sinon帮助我们提供了一个间谍函数,它知道他自己有没有被调用。
  */
})
