



var app = new Vue({
  el: "#app",
  data: {
    size: 2
  },
  methods: {
    changeMatrix: function(value) {
      this.size = value;
      console.log(value);
    }
  }
});
