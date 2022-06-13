<!--  -->
<template>
  <div class="com-container">
    <div class="com-charts" ref="rank_ref"></div>
  </div>
</template>

<script>
export default {
  //模板名 name:'组件名'
  name: "rank",
  data() {
    return {
      charInstance: null,
      allDate: null,
      startvalue: 0,
      endvalue: 9,
      timer: null,
    };
  },
  //   时刻谨记生命周期函数 函数函数
  mounted() {
    this.initCharts();
    this.getDate();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    clearInterval(timer);
  },
  methods: {
    initCharts() {
      this.charInstance = this.$echarts.init(this.$refs.rank_ref, "chalk");
      const colorArr = [
        ["#0BA82C", "#4FF778"],
        ["#2E72BF", "#23E5E5"],
        ["#5052EE", "#AB6EE5"],
      ];

      const initOption = {
        title: {
          text: "▎地区销售排行",
          left: 20,
          top: 20,
        },
        grid: {
          top: "40%",
          left: "4%",
          right: "5%",
          bottom: "4%",
          containLabel: true, //包括坐标轴数据调整的大小
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
            itemStyle: {
              color: (arg) => {
                let targetColorArr = null;
                //arg即数据中的每一个具体的数据对象
                if (arg.value > 300) {
                  targetColorArr = colorArr[0];
                } else if (arg.value > 200) {
                  targetColorArr = colorArr[1];
                } else {
                  targetColorArr = colorArr[2];
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColorArr[0], //数据中的第一个颜色
                  },
                  {
                    offset: 1,
                    color: targetColorArr[1], //数据中的第二个颜色
                  },
                ]);
              },
            },
          },
        ],
      };
      this.charInstance.setOption(initOption);
      this.startinterval();
      this.charInstance.on("mouseover", () => clearInterval(this.timer));
      this.charInstance.on("mouseout", () => this.startinterval());
    },
    async getDate() {
      const { data: ret } = await this.$http.get("rank");
      this.allDate = ret;
      this.allDate.sort((a, b) => b.value - a.value);
      console.log(this.allDate);
      this.updataCharts();
    },
    updataCharts() {
      const dataOption = {
        xAxis: {
          data: this.allDate.map((item) => item.name),
        },
        dataZoom: {
          //控制数据的显示条数
          show: false,
          startValue: this.startvalue,
          endValue: this.endvalue,
        },
        series: [
          {
            data: this.allDate.map((item) => item.value),
          },
        ],
      };
      this.charInstance.setOption(dataOption);
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.rank_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0],//左上角和右上角都宽度/2 达到圆角的效果
            },
          },
        ],
      };
      this.charInstance.setOption(adapterOption);
      this.charInstance.resize();
    },
    startinterval() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.startvalue++;
        this.endvalue++;
        if (this.endvalue == this.allDate.length) {
          this.startvalue = 0;
          this.endvalue = 9;
        }
        this.updataCharts();
      }, 2000);
    },
  },
};
</script>

<style  scoped>
</style>
<!--  -->