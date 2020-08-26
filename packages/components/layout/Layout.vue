<template>
  <section :class="wrapClasses">
    <slot></slot>
  </section>
</template>

<script>
import {findComponentDownward, findComponentsDownward } from '../../utils/findComponent'
export default {
  name:"jeLayout",
  props:{},
  data(){
    return {
      hasSider: false
    }
  },
  computed: {
    wrapClasses () {
      return [
        'je-layouts',
        this.hasSider ? 'je-layouts-has-sider' : ''
      ];
    }
  },
  methods: {
    findSider () {
      for(let i=0; i<this.$children.length; i++){
        let child = this.$children[i]
        if(child.$options.name === 'jeSider'){
          this.hasSider = true
          return
        }
      }
    }
  },
  mounted ()  {
    this.findSider();
  }
}
</script>
