<!--  -->
<template>
  <div class="com-container">
    <div class="com-charts" ref="seller_ref"></div>
  </div>
</template>

<script>
export default {
  //模板名 name:'组件名'
  name: "seller",
  date() {
    return {
      chartInstance: null,
      allDate: null, //服务器返回的数据
      currentPage: 1, //当前显示的页数
      totalPage: 0, //一共有多少页
      timer: null,
    };
  },
  mounted() {
    // 组件挂载即将结束 触发此生命周期函数 进行图形渲染
    this.initcharts();
    this.getDate();
    // 虽然this指向的是vue实例 但是在获取其属性时，data中的数据还没有被解析出来，因为return对象的时候 数据是一起渲染的，因此会出现undefined的问题
    this.currentPage = 1;
    this.totalPage = 0;
    // 组件挂载完毕 主动进行适配
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    clearInterval(this.timer);
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    //  实例化对象    初始echarts图表
    initcharts() {
      // 操作dom元素
      // init参数 位置 主题
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, "chalk");
      const initOption = {
        title: {
          text: "▎商家销售统计",
          textStyle: {
            fontSize: 66,
          },
          left: 20,
          top: 20,
        },
        grid: {
          top: "20%",
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true, //调整坐标轴的大小 坐标轴的变换大小 包括坐标轴的文字
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            z: 0,
            lineStyle: {
              color: "#2D3443",
            },
          },
        },
        series: [
          {
            type: "bar",
            label: {
              //柱子中的显示文字
              show: true,
              position: "right",
              textStyle: {
                color: "white",
              },
            },
            itemStyle: {
              barBorderRadius: [0, 33, 33, 0],
              // 指明颜色的渐变方向
              // 指明不同的百分比之下的颜色(x1,y1,x2,y2,[指明不同百分比下面的颜色值])
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                // 百分之0状态之下的颜色值
                {
                  offset: 0,
                  color: "#5052EE",
                },
                // 百分之100状态之下的颜色值
                {
                  offset: 1,
                  color: "#AB6EE5",
                },
              ]),
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);

      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timer);
      });
      this.chartInstance.on("mouseout", () => {
        this.timeStart();
      });
    },
    //   获取服务器的数据
    async getDate() {
      //   var _this = this;
      //http ://127.0.0.1:8888/api/seller
      //   将返回的数据解构 即只保留data数据 若{data：ret}就是再将data数据赋值给ret
      const { data: ret } = await this.$http.get("seller"); //通过await直接拿到promise对象中的数据
      //   console.log(data);
      this.allDate = ret;
      // console.log(this.currentPage)//undefined
      // console.log(this.totalPage)//undefined
      this.allDate.sort((a, b) => a.value - b.value); //a-b即从小到大排序 反之可见
      this.totalPage = Math.ceil(this.allDate.length / 5); //五组数据一页 向上取整
      this.updataChart();
      // 启动定时器
      console.log(this.currentPage + "之前");
      this.timeStart();
    },
    //  设置配置项  更新图表
    updataChart() {
      const start = (this.currentPage - 1) * 5;
      const end = this.currentPage * 5;
      const showData = this.allDate.slice(start, end); //slice获取数组数据 取到start 取不到end 所有当currentPage为1时 数据从0-4
      const sellerNames = showData.map((item) => item.name);
      const sellerValue = showData.map((item) => item.value);
      // 设置配置项
      const dataOption = {
        yAxis: {
          data: sellerNames,
        },
        series: [
          {
            data: sellerValue,
          },
        ],
      };
      //   配置项 和数据给到实例化对象
      this.chartInstance.setOption(dataOption);
    },
    // 分页循环函数
    timeStart() {
      // 先判断定时器是否存在
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.currentPage++;
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1;
        }
        this.updataChart(); //更新图表
      }, 3000);
    },
    // 图表适配浏览器大小
    screenAdapter() {
      // console.log(this.$refs.seller_ref.offsetWidth)
      const titleFontSize = (this.$refs.seller_ref.offsetWidth / 100) * 3.6;
      // 分辨率大小配置
     const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize(); //手动调用图表对象的resize 图形根据浏览器大小进行缩放
    },
  },
};
</script>

<style  scoped>
</style>
<!--  -->