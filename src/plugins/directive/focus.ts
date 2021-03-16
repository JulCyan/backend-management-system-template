export default {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function(el: any, binding: any) {
    const { value } = binding
    if (value) {
      setTimeout(() => {
        el.getElementsByTagName(value)[0].focus()
      }, 0)
    } else {
      el.focus()
    }
  }
}
