<!--  -->
<template>
  <div class="com-container">
    <div class="com-charts" ref="stock_ref"></div>
  </div>
</template>

<script>
export default {
  //模板名 name:'组件名'
  name: "stock",
  data() {
    return {
      charinstance: null,
      allData: null,
      currentPage: 0,
      timer: null,
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
    clearInterval(this.timer);
  },
  methods: {
    initCharts() {
      this.charinstance = this.$echarts.init(this.$refs.stock_ref, "chalk");
      const initOption = {
        title: {
          text: "▎库存和销量分析",
          left: 20,
          top: 20,
        },
      };
      this.charinstance.setOption(initOption);
      this.charinstance.on("mouseover", () => clearInterval(this.timer));
      this.charinstance.on("mouseout", () => this.startinterval());
    },
    async getData() {
      const { data: ret } = await this.$http.get("stock");
      this.allData = ret;
      console.log(this.allData);
      this.updata();
      this.startinterval();
    },
    updata() {
      const centerArr = [
        //五个圆的中心位置
        ["18%", "40%"],
        ["50%", "40%"],
        ["82%", "40%"],
        ["34%", "75%"],
        ["66%", "75%"],
      ];
      const colorArr = [
        ["#4FF778", "#0BA82C"],
        ["#E5DD45", "#E8B11C"],
        ["#E8821C", "#E55445"],
        ["#5052EE", "#AB6EE5"],
        ["#23E5E5", "#2E72BF"],
      ];
      // 处理图标数据
      const start = this.currentPage * 5;
      const end = (this.currentPage + 1) * 5;
      const showData = this.allData.slice(start, end); //显示五条数据
      const series = showData.map((item, index) => {
        return {
          type: "pie",
          // radius: [110, 100], //外圆半径和内圆半径  即圆环
          labelLine: {
            show: false, //隐藏圆环线
          },
          hoverAnimation: false, //取消鼠标触碰饼图时的动画
          center: centerArr[index],
          label: {
            position: "center", //name文字叙述显示到圆环中心
            color: colorArr[index][0],
          },
          data: [
            {
              value: item.sales,
              name: item.name + "\n\n" + item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0],
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1],
                  },
                ]),
              },
            },
            {
              value: item.stock,
              itemStyle: {
                color: "#333843",
              },
            },
          ],
        };
      });
      const dataOption = {
        series: series,
      };
      this.charinstance.setOption(dataOption);
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.stock_ref.offsetWidth / 100) * 3.6;
      const innerRadius = titleFontSize * 2.8;
      const outterRadius = innerRadius * 1.125;
      const adaptedOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        series: [
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2,
            },
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2,
            },
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2,
            },
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2,
            },
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2,
            },
          },
        ],
      };
      this.charinstance.setOption(adaptedOption);
      this.charinstance.resize();
    },
    startinterval() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.currentPage++;
        if (this.currentPage > 1) {
          this.currentPage = 0;
        }
        this.updata();
      }, 3000);
    },
  },
};
</script>

<style  scoped>
</style>
<!--  -->