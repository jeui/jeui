
<script>
export default {
  name: "jeTimeline",
  props: {
    pending: {
      type: Boolean,
      default: false
    },
    reverse: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    pending () {
      this.$children.forEach(child => {
        child.checkForLast()
      })
    }
  },
  render() {
    const classes = [
      'je-timeline',
      {'je-timeline-pending': this.pending}
    ];
    let slots = this.$slots.default || [];
    if (this.reverse) {
      slots = slots.reverse();
    }
    return (<div class={ classes }>
      { slots }
    </div>);
  }
};
</script>