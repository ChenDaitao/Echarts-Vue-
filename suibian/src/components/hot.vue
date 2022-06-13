<!--  -->
<template>
  <div class="com-container">
    <div class="com-charts" ref="hot_ref"></div>
    <span class="iconfont arr-left" @click="goleft" :style="comStyle"
      >&#xe6ef;</span
    >
    <span class="iconfont arr-right" @click="goright" :style="comStyle"
      >&#xe6ed;</span
    >
    <span class="cat-name" :style="comStyle">{{ cattitle }}</span>
  </div>
</template>

<script>
export default {
  //模板名 name:'组件名'
  name: "hot",
  data() {
    return {
      chartinstance: null,
      allData: null,
      index: 0,
      titleFontSize: 0,
    };
  },
  mounted() {
    this.initCharts();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  computed: {
    cattitle() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.index].name;
      }
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize + "px",
      };
    },
  },
  methods: {
    initCharts() {
      this.chartinstance = this.$echarts.init(this.$refs.hot_ref, "chalk");
      const initOption = {
        title: {
          text: "▎热销商品占比",
          left: 20,
          top: 20,
        },
        legend: {
          top: "15%",
        },
        series: [
          {
            type: "pie",
            label: {
              show: false,
            },
            emphasis: {
              //信息高亮显示
              label: {
                show: true,
              },
              //   labelLine: {
              //     show: false,
              //   },
            },
          },
        ],
      };
      this.chartinstance.setOption(initOption);
    },
    async getData() {
      const { data: ret } = await this.$http.get("hotproduct");
      this.allData = ret;
      console.log(this.allData);
      this.updataChart();
    },
    updataChart() {
      const dataOption = {
        legend: {
          data: this.allData[this.index].children.map((item) => item.name),
        },
        tooltip: {
          //   trigger: "item",
          show: "true",
          formatter: (arg) => {
            const third = arg.data.children;
            let total = 0;
            third.forEach((item) => {
              total += item.value;
            });
            let retStr = "";
            third.forEach((item) => {
              // 数据展示
              retStr += `${item.name}:${
                parseInt((item.value / total) * 100) + "%"
              } <br/>`;
            });
            return retStr;
          },
        },
        series: [
          {
            data: this.allData[this.index].children.map((item) => {
              return {
                name: item.name,
                value: item.value,
                children: item.children, //三级分类的数据 可以在tooltip中显示
              };
            }),
          },
        ],
      };
      this.chartinstance.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        legend: {
          itemWidth: this.titleFontSize ,
          itemHeight: this.titleFontSize ,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
        series: [
          {
            radius: this.titleFontSize * 4.5, //饼图的半径
            center: ["50%", "57%"],
          },
        ],
      };
      this.chartinstance.setOption(adapterOption);
      this.chartinstance.resize();
    },
    goleft() {
      this.index--;
      console.log(this.allData.length);
      if (this.index < 0) {
        this.index = this.allData.length - 1; //回到最后一个数据
      }
      this.updataChart();
    },
    goright() {
      this.index++;
      if (this.index > this.allData.length - 1) {
        this.index = 0;
      }
      this.updataChart();
    },
  },
};
</script>

<style lang="less" scoped>
.arr-left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  font-size: 32px;
  z-index: 9999;
  color: #fff;
  cursor: pointer;
}
.arr-right {
  position: absolute;
  right: 10%;
  top: 50%;
  font-size: 32px;
  transform: translateY(-50%);
  z-index: 9999;
  color: #fff;
  cursor: pointer;
}
.cat-name {
  position: absolute;
  right: 15%;
  bottom: 10%;
  color: #fff;
}
</style>
<!--  -->