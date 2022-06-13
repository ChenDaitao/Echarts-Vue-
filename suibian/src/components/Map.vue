<!--  -->
<template>
  <div class="com-container" @click="TwoBack">
    <div class="com-charts" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from "axios";
import { getProvinceMapInfo } from "@/utils/map_utils";
export default {
  //模板名 name:'组件名'
  name: "Map",
  data() {
    return {
      chartInstance: null,
      allData: null,
      mapCache: {}, //省份地图缓存
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
  methods: {
    //   初始化实例
    async initCharts() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, "chalk");
      //   http://localhost:8999/static/map/china.json
      //获取中国地图的矢量数据地址 静态资源
      const ret = await axios.get(
        "http://localhost:8999/static/map/china.json"
      );
      //   console.log(ret);
      // 注册地图 china 别名 +数据
      this.$echarts.registerMap("china", ret.data);
      const initOption = {
        geo: {
          type: "map",
          map: "china",
          top: "5%",
          bottom: "5%",
          itemStyle: {
            //控制地图整体的颜色
            areaColor: "#2e72bf",
            borderColor: "orange",
          },
        },
        legend: {
          orient: "vertical", //图例垂直摆放
          bottom: 50,
          left: 70,
        },
        title: {
          text: "▎商家分布",
          left: "20",
          top: 20,
        },
      };
      this.chartInstance.setOption(initOption);
      // 点击事件 点击获取省份地图
      this.chartInstance.on("click", async (data) => {
        const provinceinfo = getProvinceMapInfo(data.name);
        if (!this.mapCache[provinceinfo.key]) {
          const ret = await axios.get(
            "http://localhost:8999" + provinceinfo.path
          ); //获取省份矢量数据的地址
          this.mapCache[provinceinfo.key] = ret.data; //数据缓存
          // 对获取的省份进行地图配置
          this.$echarts.registerMap(provinceinfo.key, ret.data);
        }

        const provinceOption = {
          geo: {
            map: provinceinfo.key,
          },
        };
        this.chartInstance.setOption(provinceOption);
        console.log(ret.data);
      });
    },
    // 获取koa2后台数据 散点图
    async getData() {
      // this.$http  await
      const { data: ret } = await this.$http.get("map");
      this.allData = ret;
      // console.log(this.allData);
      this.upData();
    },
    // 更新数据
    upData() {
      // 设置图例
      const legendArr = this.allData.map((item) => item.name);
      // 处理图表数据
      // 若想在地图中显示散点的数据，需要指明散点将会使用地图坐标系统 coordinateSystem:geo
      const seriesArr = this.allData.map((item) => {
        return {
          type: "effectScatter", //散点图
          name: item.name,
          data: item.children,
          coordinateSystem: "geo", //必须指明
          rippleEffect: {
            scale: 7, //涟漪范围
            brushType: "stroke", //涟漪空心效果散点
          },
        };
      });
      const dataOption = {
        series: seriesArr,
        legend: {
          data: legendArr,
        },
      };
      this.chartInstance.setOption(dataOption);
    },
    // 浏览器大小适配
    screenAdapter() {
      const titleFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2, //每个图例之间的间隔
          textStyle: {
            fontSize: titleFontSize / 2,
          },
        },
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    TwoBack() {
      //回到中国地图
      const revertOption = {
        geo: {
          map: "china",
        },
      };
      this.chartInstance.setOption(revertOption);
    },
  },
};
</script>

<style  scoped>
</style>
<!--  -->