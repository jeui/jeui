<template>
  <div class="je-page">
    <div class="je-page-align">
      <div class="total" v-if="showTotal">共<span> {{total}} </span>条</div>
      <div class="page-list">
        <ul :class="pageBorder">
          <li>
            <button title="上一页" class="prev" :class="{'disabled':active===1}" :disabled="active===1" @click="jumpPage(active-1)">
              <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="left" width="12px" height="12px" fill="currentColor" aria-hidden="true">
                <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path>
              </svg>
            </button>
          </li>
          <li>
            <button title="1" @click="jumpPage(1)" :class="{'active':active===1}">1</button>
          </li>
          <li v-if="pages.start > 2">
            <button :title="`向前${pagerCount}页`" class="jump-prev" @click="jumpPage(active-pagerCount)">
              <span class="svg"><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="double-left" width="12px" height="12px" fill="currentColor" aria-hidden="true">
                  <path d="M272.9 512l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L186.8 492.3a31.99 31.99 0 0 0 0 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H532c6.7 0 10.4-7.7 6.3-12.9L272.9 512zm304 0l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L490.8 492.3a31.99 31.99 0 0 0 0 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H836c6.7 0 10.4-7.7 6.3-12.9L576.9 512z"></path>
                </svg></span>
              <span class="dot">•••</span>
            </button>
          </li>
          <li v-for="(page,index) in pages.list" :key="index">
            <button :title="page" v-text="page" :class="{'active':page===active}" @click="jumpPage(page)"></button>
          </li>
          <li v-if="pageCount > pages.end+1">
            <button :title="`向后${pagerCount}页`" class="jump-next" @click="jumpPage(active+pagerCount)">
              <span class="svg"><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="double-right" width="12px" height="12px" fill="currentColor" aria-hidden="true">
                  <path d="M533.2 492.3L277.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H188c-6.7 0-10.4 7.7-6.3 12.9L447.1 512 181.7 851.1A7.98 7.98 0 0 0 188 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5zm304 0L581.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H492c-6.7 0-10.4 7.7-6.3 12.9L751.1 512 485.7 851.1A7.98 7.98 0 0 0 492 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5z"></path>
                </svg></span>
              <span class="dot">•••</span>
            </button>
          </li>

          <li v-if="pageCount>1">
            <button :title="pageCount" @click="jumpPage(pageCount)" :class="{'active':active===pageCount}">{{pageCount}}</button>
          </li>
          <li>
            <button title="下一页" class="next" :class="{'disabled':pageCount<=active}" :disabled="pageCount<=active" @click="jumpPage(active+1)">
              <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="right" width="12px" height="12px" fill="currentColor" aria-hidden="true">
                <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path>
              </svg>
            </button>
          </li>
        </ul>
      </div>
      <jeSelect v-model="changePageSize" v-if="selectList.length>0" width="80px">
        <jeOption v-for="item in selectList" :value="item.value" :label="item.label" :key="item.value" :rawdata="item"></jeOption>
      </jeSelect>
      <div class="show-jumper" v-if="jumper" style="width:120px">
        <jeInput v-model="pageInput" @on-blur="jumpBlur" placeholder="" :maxlength="6" textAlign="center" width="120px">
          <span slot="prepend">前往</span>
          <span slot="append">页</span>
        </jeInput>
      </div>
    </div>
  </div>
</template>

<script>
import jeInput from '../input/Input'
import jeSelect from '../select/Select'
import jeOption from '../select/Option'
export default {
  name: 'jePage',
  components: {
    jeInput,
    jeSelect,
    jeOption
  },
  props: {
    current: {
      // 当前面码
      type: [String, Number],
      default: 1
    },
    total: {
      // 数据总数
      type: Number,
      default: 0
    },
    pageSize: {
      // 每页条数
      type: Number,
      default: 10
    },
    jumper: {
      // 显示快速切换到某一页
      type: Boolean,
      default: false
    },
    border: {
      // 是否显示边框
      type: Boolean,
      default: true
    },
    pagerCount: {
      // 点击折叠向前或向后跳多少页
      type: Number,
      default: 5
    },
    showSize: {
      type: Array,
      default() { return [] }
    },
    showTotal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: this.current, // 当前页
      pageInput: '', // 快速跳到第几页
      changePageSize: 10,
      selectList: []
    }
  },
  mounted() {
    let options = []
    this.showSize.forEach(item => {
      options.push({
        label: `每页${item}条`,
        value: item
      })
    })
    this.selectList = options
  },
  watch: {
    current(val) {
      this.active = val
    },
    selectList(val) {
      this.selectList = val
    },
    changePageSize(v) {
      // 改变每页显示条数后，更新当前页
      if (this.active > this.pageCount) {
        this.active = this.pageCount
      }
      this.$emit('size-change', this.pageCount)
    }
  },
  methods: {
    jumpPage(page, isBlur = true) {
      let currPage = page
      if (page > this.pageCount) {
        currPage = this.pageCount
      }
      if (page < 1) {
        currPage = 1
      }
      if (!isBlur) {
        this.pageInput = currPage
      }
      this.active = page <= 1 ? 1 : currPage
      this.jumpEmit()
    },
    jumpBlur() {
      if (this.pageInput === '') {
        this.active = 1
      } else {
        let toPage = parseInt(this.pageInput)
        this.jumpPage(toPage, false)
      }
    },
    jumpEmit(){
      this.$emit('update:current', this.active)
      this.$emit('update:pagerCount', this.changePageSize)
      // 页码改变的回调，返回改变后的页码
      this.$emit('current-change', this.active)
    }
  },
  computed: {
    pageBorder(){
      return this.border ? 'border' : ''
    },
    pageCount() {
      // 一共分多少页
      return Math.ceil(this.total / this.changePageSize)
    },
    pages() {
      let start = '', end = this.pageCount - 1
      if (this.active + parseInt(this.pagerCount / 2) < this.pageCount) {
        end = this.active + parseInt(this.pagerCount / 2)
      }
      if (this.active >= this.pagerCount) {
        start = this.active - parseInt(this.pagerCount / 2)
      } else {
        // 当前页小于pagerCount时
        end = this.pagerCount > this.pageCount ? this.pageCount : this.pagerCount
      }
      // 接近尾页时
      if (this.pageCount - this.active < this.pagerCount) {
        const fixedStart = this.pageCount - this.pagerCount + 1
        start = fixedStart > start ? start : fixedStart
      }
      if (start < 2) {
        start = 2
      }
      if (end >= this.pageCount - 1) {
        end = this.pageCount - 1
      }

      let list = [], forStart = start
      while (forStart <= end) {
        list.push(forStart)
        forStart++
      }
      return {list, start, end}
    }
  }
}
</script>
