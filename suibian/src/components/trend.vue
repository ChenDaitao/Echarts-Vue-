<!--  -->
<template>
  <div class="com-container">
    <div class="title" :style="titleStyle">
      <span @click="showChoice = !showChoice">{{ "▎" + showTitle }}</span>
      <span
        class="iconfont title-icon"
        :style="titleStyle"
        @click="showChoice = !showChoice"
        >&#xe6eb;</span
      >
      <div v-show="showChoice" class="select-on" :style="marginStyle">
        <div
          class="select-item"
          v-for="item in selectType"
          :key="item.key"
          @click="handleType(item.key)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-charts" ref="trend_ref"></div>
  </div>
</template>

<script>
export default {
  //模板名 name:'组件名'
  name: "trend",
  data() {
    return {
      chartInstance: null,
      allData: null,
      showChoice: false, //是否显示
      contentType: "map", //默认显示图形为 map
      titleFontSize: 0,
    };
  },
  computed: {
    //   标题种类数据
    selectType() {
      if (!this.allData) {
        return [];
      } else {
        return this.allData.type.filter(
          (item) => item.key !== this.contentType
        );
      }
    },
    //获取标题
    showTitle() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.contentType].title;
      }
    },
    // 动态适配文字
    titleStyle() {
      return {
        fontSize: this.titleFontSize + "px",
      };
    },
    // 设置标题和下拉菜单对齐
    marginStyle() {
      return { marginLeft: this.titleFontSize - this.titleFontSize / 3 + "px" };
    },
  },
  mounted() {
    this.initcharts();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    //   实例化对象
    initcharts() {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, "chalk");
      const initOption = {
        title: {
          textStyle: {
            fontSize: 66,
          },
          left: 20,
          top: 20,
        },
        grid: {
          top: "35%",
          left: "3%",
          right: "4%",
          bottom: "1%",
          containLabel: true, //控制坐标轴文字在图表之内  调整坐标轴的大小 坐标轴的变换大小 包括坐标轴的文字
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          left: 20,
          top: "15%",
          icon: "circle",
        },
        xAxis: {
          type: "category",
          boundaryGap: false, //使x轴数据紧挨着y轴延伸 即不需要间隔
        },
        yAxis: {
          type: "value",
        },
      };
      this.chartInstance.setOption(initOption);
    },
    // 获取数据
    async getData() {
      // await this.$http.get()
      const { data: ret } = await this.$http.get("trend");
      console.log(ret);
      this.allData = ret;
      this.upData();
    },
    // 更新数据
    upData() {
      // 半透明的颜色值
      const colorArr1 = [
        "rgba(11, 168, 44, 0.5)",
        "rgba(44, 110, 255, 0.5)",
        "rgba(22, 242, 217, 0.5)",
        "rgba(254, 33, 30, 0.5)",
        "rgba(250, 105, 0, 0.5)",
      ];
      // 全透明的颜色值
      const colorArr2 = [
        "rgba(11, 168, 44, 0)",
        "rgba(44, 110, 255, 0)",
        "rgba(22, 242, 217, 0)",
        "rgba(254, 33, 30, 0)",
        "rgba(250, 105, 0, 0)",
      ];
      const timeArr = this.allData.common.month; //x轴数据
      const MapData = this.allData[this.contentType].data; //y轴数据
      const seriesArr = MapData.map((item, index) => {
        //同时取到每个数据的序列号
        return {
          name: item.name, //让数据中的series中的name和legend中的name保持一致
          type: "line",
          data: item.data,
          stack: this.contentType, //堆叠图设置
          areaStyle: {
            //以面积形式显示图表数据
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                //   0%时候的颜色值
                offset: 0,
                color: colorArr1[index],
              },
              {
                //100%时候的颜色值
                offset: 1,
                color: colorArr2[index], //根据数据的序列号设置每条数据的颜色
              },
            ]),
          },
        };
      });
      //   图例数据
      const legendArr = MapData.map((item) => item.name);
      const dataOption = {
        xAxis: {
          data: timeArr,
        },
        series: seriesArr,
        legend: {
          data: legendArr,
        },
      };
      this.chartInstance.setOption(dataOption);
    },
    handleType(contentType) {
      this.contentType = contentType;
      this.showChoice = false; //隐藏下拉菜单
      this.upData(); //更新图表
    },
    // 图表适应浏览器大小
    screenAdapter() {
      this.titleFontSize = (this.$refs.trend_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 3,
          },
        },
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
  },
};
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 999;
  color: #fff;
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
  .select-on {
    cursor: pointer;
    background-color: #222733;
  }
}
</style>
<!--  -->