<!--
 * @Description: 
 * @Version: 
 * @Autor: MrSong
 * @Date: 2020-12-24 19:38:52
 * @LastEditors: MrSong
 * @LastEditTime: 2020-12-25 15:19:51
-->
<template>
  <view>
    <view class="btn-box" @tap="drawCanvas">
      绘制
    </view>
    <slot name="content"></slot>
    <view class="share-canvas">
      <canvas :style="[{height:realheight+'px'}]" class='canvas' canvas-id="canvas-map"></canvas>
    </view>
  </view>
</template>

<script>
  const {
    wxml2canvas,
    wxSelectorQuery
  } = require('./canvas.js')
  export default {
    props: ['wrapperData'],
    data() {
      return {
        realheight: 400,
        wxSelectorQuery: wxSelectorQuery
      }
    },
    watch: {
      wrapperData: {
        async handler(newVal, oldVal) {
          if (newVal) {
            console.log('wrapperData', newVal);
            const wrapperId = newVal.wrapperId;
            const getWrapperElement = await wxSelectorQuery(wrapperId);
            this.realheight = getWrapperElement[0].height;
          }
        },
        immediate: true,
        deep: true
      }
    },
    async mounted() {},
    methods: {
      drawCanvas() {
        const wrapperId = this.wrapperData.wrapperId
        const drawClassName = this.wrapperData.drawClassName
        const canvasId = 'canvas-map'
        wxml2canvas(wrapperId, drawClassName, canvasId, this).then((res) => {
          // console.log('wxml2canvas', res)
          // canvas has been drawn
          // can save the image with wx.canvasToTempFilePath and wx.saveImageToPhotosAlbum 
          this.createImage(canvasId, res)
        }).catch((err) => {})
      },
      createImage(canvasId, data) {
        const systemInfo = wx.getSystemInfoSync();
        let imageWidth = systemInfo.windowWidth,
          imageHeight = systemInfo.windowHeight,
          realheight = data.height,
          realwidth = data.width;
        // return;
        wx.canvasToTempFilePath({ //将canvas生成图片
          canvasId: canvasId,
          x: 0,
          y: 0,
          width: realwidth,
          height: realheight,
          destWidth: realwidth, //截取canvas的宽度
          destHeight: realheight, //截取canvas的高度
          success: (res) => {
            wx.saveImageToPhotosAlbum({ //保存图片到相册
              filePath: res.tempFilePath,
              success: () => {
                this.$emit('getCanvasImg', res.tempFilePath)
                wx.showToast({
                  title: "生成图片成功！",
                  duration: 2000
                })
              }
            })
          },
          fail: (err) => {
            console.log(err)
          }
        }, this)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn-box {
    width: 100rpx;
    height: 100rpx;
    line-height: 100rpx;
    border-radius: 50%;
    position: fixed;
    right: 10rpx;
    bottom: 80rpx;
    z-index: 8888;
    overflow: hidden;
    font-size: 28rpx;
    background-color: #179b16;
    color: #fff;
    text-align: center;
    box-shadow: 0 0 10rpx #000;
  }
  .share-canvas,
  .canvas {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border: 1px solid #f1f1f1;
    background: transparent;
  }
</style>

