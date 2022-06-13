<!--  -->
<template>
  <div class="screen-container">
    <div class="viewport">
      <div class="column">
        <div class="trend" @click="trendmax">
          <!-- 地区销售 -->
          <trendVue />
        </div>
        <div class="seller" @click="sellermax">
          <!-- 销售趋势 -->
          <sellerVue />
        </div>
      </div>
      <div class="column">
        <div class="map" @click="mapmax">
          <!-- 商家分布中国地图 -->
          <MapVue />
        </div>
        <div class="rank" @click="rankmax">
          <!-- 商家销售 -->
          <rankVue />
        </div>
      </div>
      <div class="column">
        <div class="hot" @click="hotmax">
          <!-- 热销商品 -->
          <hotVue />
        </div>
        <div class="stock" @click="stockmax">
          <!-- 库存分析 -->
          <stockVue ref="stock" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sellerVue from "@/components/seller.vue";
import rankVue from "@/components/rank.vue";
import MapVue from "@/components/Map.vue";
import trendVue from "@/components/trend.vue";
import hotVue from "@/components/hot.vue";
import stockVue from "@/components/stock.vue";
export default {
  //模板名 name:'组件名'
  name: "Home",
  data() {
    return {
      // 定义每一个图表的全屏状态
      fullScreenStatus: {
        trend: false,
        seller: false,
        mappage: false,
        rank: false,
        hot: false,
        stock: false,
      },
    };
  },
  methods: {
    trendmax() {
      this.$router.push("trend");
    },
    sellermax() {
      this.$router.push("seller");
    },
    mapmax() {
      this.$router.push("mappage");
    },
    stockmax() {
      this.$router.push("stock");
    },
    hotmax() {
      this.$router.push("hot");
    },
    rankmax() {
      this.$router.push("rank");
    },
  },
  components: {
    sellerVue,
    rankVue,
    MapVue,
    trendVue,
    hotVue,
    stockVue,
  },
};
</script>

<style lang="less" scoped>
//全屏样式
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}
.screen-container {
  width: 100%;
  height: 100%;
  background-color: #161522;
}
.viewport {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 80px 20px;
  background: url("../../public/static/img/logo.png") no-repeat 0 0 / contain;
  //background-size: contain;会完全显示背景图片 cover会对图片进行裁剪之后 填满整个盒子进行显示
}
.viewport .column {
  flex: 3;
}
.viewport .column:nth-child(3) {
  margin-right: 40px;
  .hot {
    height: 46%;
    position: relative;
  }
  .stock {
    height: 38%;
    margin-top: 25px;
    position: relative;
  }
}
.viewport .column:nth-child(2) {
  flex: 4;
  .map {
    margin-top: 25px;
    height: 56%;
    position: relative;
  }
  .rank {
    height: 28%;
    position: relative;
    margin-top: 15px;
  }

  margin: 25px 20px;
}
.viewport .column:nth-child(1) {
  .seller {
    height: 31%;
    margin-top: 25px;
    position: relative;
  }
  .trend {
    position: relative;
    height: 53%;
  }
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  color: #fff;
  cursor: pointer;
}
</style>
<!--  -->