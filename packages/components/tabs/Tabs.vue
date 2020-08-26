<template>
  <div :class="tabsClass">
    <div :class="headerClass" ref="head">
      <ul class="je-tabs-navwrap">
        <li v-for="(item,index) in navList" :key="index" :class="{
          'je-tabs-active':index === activeIndex,
          'je-tabs-disabled':item.disabled}" 
        @click="switchTabs(item, $event)">
          <Icon v-if="item.icon != ''" :type="item.icon" class="je-mr5"/>
          <span>{{item.label}}</span>
          <Icon v-if="item.closable" type="icon-close" custom="je-ml8" 
          @click.stop="removeHandle(item, index)"/>
        </li>
      </ul>
    </div>
    <div :class="bodyClass" :style="bodyAnimateStyle" ref="body" v-show="!hidePane">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { findComponentsDownward } from "../../utils/findComponent";
import Icon from "../icon/Icon";
export default {
  name: "jeTabs",
  components: {
    Icon
  },
  props:{
    value: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'line',
      validator: val => ['line', 'card'].indexOf(val) > -1
    },
    direction: {
      type: String,
      default: "top",
      validator: val => ['top', 'right', 'bottom', 'left'].indexOf(val) > -1
    },
    size: {
      type: String,
      default: 'default',
      validator: val => ['default', 'small'].indexOf(val) > -1
    },
    closable: {
      type: Boolean,
      default: false
    },
    animated: {
      type: Boolean,
      default: false
    },
    hidePane: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      navList: [],
      paneList: [],
      activeKey: this.value,
      nextable: false,
      prevable: false
    }
  },
  watch: {
    direction(value){
      this.moveNodes(value)
    }
  },
  mounted() {
    this.paneList = findComponentsDownward(this, 'jeTabsPane');
    this.updateNav()
    this.moveNodes(this.direction)
  },
  methods: {
    moveNodes(type){
      this.$nextTick(() => {
        let reType = type === 'bottom' || type === 'right'
        this.$el.appendChild(reType ? this.$refs.head : this.$refs.body)
      })
    },
    getTabs() {
      return this.$children.filter(item =>
        item.$options.name === 'jeTabsPane'
      )
    },
    updateNav(){
      this.navList = []
      this.paneList.forEach((item, index) => {
        if (!item.currName) {
          item.currName = index
        }
        if (index === 0 && !this.activeKey) {
          this.activeKey = item.currName || index
        }
        this.navList.push({
          label: item.label,
          name: item.currName || index,
          disabled: item.disabled||'',
          icon: item.icon,
          closable: item.isClosable
        })
      }) 
      if (!this.animated) {
        this.updatePaneStatus()
      }    
    },
    switchTabs(tabs, event){
      if (!tabs.disabled) {
        let currValue = tabs.name
        this.activeKey = tabs.name
        if (!this.animated) {
          this.updatePaneStatus()
        } 
        this.$emit('tab-click', tabs, event);
        this.$emit('input', currValue)
      }
    },
    updatePaneStatus() {
      this.paneList.forEach(item => {
        item.show = (item.currName === this.activeKey)
      })
    },
    removeHandle(tabItem, index){
      let tabs = this.paneList, activeKey = ''
      if (tabItem && tabItem.disabled) return
      this.navList.splice(index, 1)
      this.$emit('tab-remove', {
        index: index,
        name: tabItem.name
      })
      this.$nextTick(() => {
        this.updateNav()
      })
      if (tabItem.name === this.activeKey) {
        const newTabs = this.getTabs()
        if (newTabs.length) {
          const nextAbleTabs = tabs.filter((item, itemIndex) =>
            !item.disabled && itemIndex > index
          )
          const prevAbleTabs = tabs.filter((item, itemIndex) =>
            !item.disabled && itemIndex < index
          )
          if (nextAbleTabs.length) {
            activeKey = nextAbleTabs[0].currName
          } else if (prevAbleTabs.length) {
            activeKey = prevAbleTabs[prevAbleTabs.length - 1].currName
          } else {
            activeKey = newTabs[0].currName
          }
        }
        this.activeKey = activeKey
      }
    }
  },
  computed:{
    tabsClass(){
      return [
        'je-tabs',
        {
          [`je-tabs-${this.direction}`]: this.direction !== ''
        }
      ]
    },
    headerClass(){
      return [
        'je-tabs-header', 
        {[`je-tabs-${this.type}`]: this.type !== ''}
      ]
    },
    bodyClass(){
      return [
        'je-tabs-body', 
        {[`je-tabs-animated`]: this.animated}
      ]
    },
    bodyAnimateStyle () {
      if(!this.animated) return {}
      if(this.animated){
        const activeIndex = this.activeIndex
        const translateValue = this.animated ? `${-activeIndex * 100}%` : 0
        return {
          transform: `translate3d(${translateValue}, 0, 0)`
        }
      }
    },
    activeIndex () {
      const navList = this.navList
      for (let i = 0, len = navList.length; i < len; i++) {
        const item = navList[i]
        if (item.name === this.activeKey) {
          return i
        }
      }
      return 0
    }
  }
}
</script>
