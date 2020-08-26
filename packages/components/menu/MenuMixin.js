export default {
  data () {
    return {
      ParentLayerNum:0
    }
  },
  methods: {
    findParentLevel (val){
      let parent = val.$parent , opts = parent.$options
      if(parent && (opts.name == "jeSubmenu" || opts.name == "jeMenu" || opts.name == "jeMenuItemGroup")){
        this.ParentLayerNum = this.ParentLayerNum + (opts.name == "jeMenuItemGroup" ? 2 : 1)
        this.findParentLevel(parent)
      }
      return this.ParentLayerNum  
    },
    getpadValue() {
      return {
        paddingLeft: this.ParentLayerNum - 1 == 0 ? "" : 10 * this.ParentLayerNum + "px",
      };
    }
  }
};
