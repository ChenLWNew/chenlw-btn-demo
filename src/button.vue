<template>
  <button @click="$emit('click')" class="g-button" :class="{[`icon-${iconPosition}`]: true}">
    <!--
    <svg v-if="icon" class="icon">
      <use v-bind:xlink:href=`#i-${icon}`></use>
    </svg>
    -->
    <g-icon class="icon" v-if="icon && !loading" :name="icon"></g-icon>
    <g-icon v-if="loading" class="loading icon" name="loading"></g-icon>
    <div class="content">
      <slot></slot>
    </div>
  </button>
</template>
<script>
  // import Vue from 'vue'
  // import Icon from './icon.vue'
  // Vue.component('g-icon', Icon) 组件内不建议全局注册,所以还是局部注册吧

  import Icon from './icon.vue'
  export default {
    components: {
      'g-icon': Icon
    },
    // props: ['icon','iconPosition'] //iconPosition我能帮使用者处理的是要么是left要么是right
    props: {
      icon: {},
      loading: {
        type: Boolean,
        default: false
      },
      iconPosition: {
        type: String,
        default: 'left',
        validator(value) {
          /*
          if(value !== 'left' && value !== 'right') {
            return false
          }else{
            return true
          }
          */
          return !(value !== 'left' && value !== 'right');
        }
      }
    }
  }
</script>
<style lang="scss">
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100%{
      transform: rotate(360deg);
    }
  }
  .g-button {
    font-size: var(--font-size);
    height: var(--button-height);
    padding: 0 1em;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    background: var(--button-bg);
    vertical-align: middle;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    &:hover{
      border-color: var(--border-color-hover);
    }
    &:active{
      background-color: var(--button-active-bg);
    }
    &:focus{
      outline: none;
    }
    > .icon {
      order: 1;
      margin-right: .3em;
    }
    > .content{
      order: 2
    }
    &.icon-right{
      > .icon{
        order: 2;
        margin-right: 0;
        margin-left: .3em;
      }
      > .content{
        order: 1
      }
    }
    .loading {
      animation: spin 2s infinite linear;
    }
  }
</style>
