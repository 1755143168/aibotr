var store = {
  state: {
    isdot: true,
    isCollapse: false,
    asideWidth: '180px'
  },
  setTagsAction (newValue) {
    this.state.isdot = newValue
  },
  setCollapseAction (newValue) {
    this.state.isCollapse = newValue
  },
  setAsideWidthAction (newValue) {
    this.state.asideWidth = newValue
  }
}

export default store