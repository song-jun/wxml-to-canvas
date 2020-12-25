## uniapp中使用方法

- github下载组件

```sh
git clone https://github.com/song-jun/wxml-to-canvas.git
```

- 将目录下wxml2canvas 文件下载下来，放到本地项目components中，在页面中引用组件

```vue
<template>
  <div class="wxml2canvas">
    <wxmlcanvas @getCanvasImg='getCanvasImg' :wrapperData='wrapperData'>
      <block slot="content">
        <view class="container" id="wrapper">
          <text class="title draw" data-align='left' data-text="小程序canvas">小程序canvas</text>
          <text class="info draw" data-text="小程序商品详情分享，canvas绘图demo，封装测试。小程序商品详情分享，canvas绘图demo。小程序商品详情分享，canvas绘图demo，封装测试。小程序商品详情分享，canvas绘图demo。">
            小程序商品详情分享，canvas绘图demo，封装测试。小程序商品详情分享，canvas绘图demo。小程序商品详情分享，canvas绘图demo，封装测试。小程序商品详情分享，canvas绘图demo。
          </text>
          <view class="draw test">
            <view class="flex draw">
              <text class="draw" data-line='1' data-text="11111111111111111">11111111111111111</text>
            </view>
            <view class="flex draw">
              <image class="draw" src="../../static/demo.jpg" />
            </view>
            <view class="flex draw">
              <image class="draw borarc ace" src="../../static/demo.jpg" />
            </view>
          </view>
          <view class="image-wrapper draw">
            <image class="draw" src="../../static/demo.jpg" />
          </view>
          <view class="image-wrapper draw">
            <image class="draw arc" src="../../static/demo.jpg" />
          </view>
          <view class="image-wrapper draw">
            <image class="draw" src="../../static/demo.jpg" />
          </view>
          <view class="image-wrapper draw">
            <image class="draw" src="../../static/demo.jpg" />
          </view>
          <view class="image-wrapper draw">
            <image class="draw" src="../../static/demo.jpg" />
          </view>
        </view>
      </block>
    </wxmlcanvas>
  </div>
</template>

<script>
  import wxmlcanvas from '@/components/wxml2canvas/'
  export default {
    components: {
      wxmlcanvas
    },
    data: () => ({
      realheight:0,
      wrapperData:{
        wrapperId:'#wrapper',//画布形状wrapperId
        drawClassName: '.draw'//需要绘制的元素 className
      }
    }),
    methods: {
      getCanvasImg(url){
        console.log('getCanvasImg',url);
      }
    },
    onLoad() {}
  };
</script>

<style lang="scss" scoped>
  .container {
    box-sizing: border-box;
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border: 1px solid #f1f1f1;
    position: sticky;
    left: 0;
    top: 0;
  }
  .container .title {
    font-size: 36px;
    margin-bottom: 10px;
  }
  .container .info {
    font-size: 14px;
    line-height: 18px;
    color: grey;
    text-align: left;
    margin-bottom: 40px;
  }
  .container .image-wrapper image {
    width: 100%;
    border-radius: 20rpx;
    /* border: 0px solid transparent; */
    box-sizing: border-box;
    margin: 10rpx 0;
  }
  .text-canvas {
    width: 100%;
    box-sizing: border-box;
    height: 150rpx;
  }
  .text-canvas canvas {
    width: 100%;
    height: 100%;
  }
  .test {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 40rpx;
  }
  .flex {
    width: 80rpx;
    height: 80rpx;
    border: 1px solid #f1f1f1;
    border-radius: 8rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .flex image {
    width: 100%;
    height: 80rpx;
  }
  .flex:nth-child(1) {
    background-color: aqua;
  }
  .flex:nth-child(2) {
    background-color: blue;
    border: 1px solid red;
  }
  .flex:nth-child(3) {
    background-color: gold;
    border-radius: 50%;
    overflow: hidden;
  }
  .flex text {
    /* color: #fff; */
    text-overflow: ellipsis;
    width: 100%;
    overflow: hidden;
    text-align: center;
    /* line-height: 80rpx; */
  }
  .container .image-wrapper .arc {
    border-radius: 50%;
    width: 200rpx;
    height: 200rpx;
  }
  .flex image.draw {
    border-radius: 30rpx;
  }
  .flex image.borarc.ace {
    border-radius: 50%;
  }
</style>
```

## 在小程序中使用

- 先去github下载canvas.js

```sh
git clone https://github.com/song-jun/wxml-to-canvas.git
```

- index.js代码示例

```js
const {wxml2canvas,wxSelectorQuery} = require('../../utils/canvas.js')
Page({
  data: {},
  async onLoad() {
    const wrapperId = '#wrapper';
    const getWrapperElement = await wxSelectorQuery(wrapperId);
    this.setData({
      realheight:getWrapperElement[0].height
    })
  },
  drawCanvas: function () {
    const wrapperId = '#wrapper'
    const drawClassName = '.draw'
    const canvasId = 'canvas-map'

    wxml2canvas(wrapperId, drawClassName, canvasId).then((res) => {
      console.log(res)
      this.createImage(canvasId, res)
    })
  },
  createImage(canvasId, data) {
    const systemInfo = wx.getSystemInfoSync();
    let realheight = data.height,
      realwidth = data.width;
    wx.canvasToTempFilePath({ //将canvas生成图片
      canvasId: canvasId,
      x: 0,
      y: 0,
      width: realwidth,
      height: realheight,
      destWidth: realwidth,
      destHeight: realheight,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function () {
            wx.showToast({
              title: "生成图片成功！",
              duration: 2000
            })
          }
        })
      }
    })
  }
})
```

- index.wxml代码示例

```html
<view class="btn-box" bindtap="drawCanvas">
  绘制
</view>
<view class="container" id="wrapper">
  <text class="title draw" data-align='left' data-text="小程序canvas">小程序canvas</text>
  <text class="info draw"
    data-text="小程序商品详情分享，canvas绘图demo，封装测试。小程序商品详情分享，canvas绘图demo。小程序商品详情分享，canvas绘图demo，封装测试。小程序商品详情分享，canvas绘图demo。">
    小程序商品详情分享，canvas绘图demo，封装测试。小程序商品详情分享，canvas绘图demo。小程序商品详情分享，canvas绘图demo，封装测试。小程序商品详情分享，canvas绘图demo。
  </text>
  <view class="draw test">
    <view class="flex draw">
      <text class="draw" data-line='1' data-text="11111111111111111">11111111111111111</text>
    </view>
    <view class="flex draw">
      <image class="draw" src="../../assets/demo.jpg" />
    </view>
    <view class="flex draw">
      <image class="draw borarc ace" src="../../assets/demo.jpg" />
    </view>
  </view>
  <view class="image-wrapper draw">
    <image class="draw" src="../../assets/demo.jpg" />
  </view>
  <view class="image-wrapper draw">
    <image class="draw arc" src="../../assets/demo.jpg" />
  </view>
  <view class="image-wrapper draw">
    <image class="draw" src="../../assets/demo.jpg" />
  </view>
  <view class="image-wrapper draw">
    <image class="draw" src="../../assets/demo.jpg" />
  </view>
  <view class="image-wrapper draw">
    <image class="draw" src="../../assets/demo.jpg" />
  </view>
</view>
<view class="share-canvas">
  <canvas style="height:{{realheight}}px" class='canvas' canvas-id="canvas-map"></canvas>
</view>
```

- index.wxss

```css
.btn-box{
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
.container {
  box-sizing: border-box;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border:1px solid #f1f1f1;
  position: absolute;
  left: 0;
  top: 0;
} 
.container .title {
  font-size:36px;
  margin-bottom: 10px;

}
.container .info {
  font-size: 14px;
  line-height: 18px;
  color: grey;
  text-align: left;
  margin-bottom: 40px;
}
.container .image-wrapper image {
  width: 100%;
  border-radius: 20rpx;
  /* border: 0px solid transparent; */
  box-sizing: border-box;
}
.text-canvas{
  width: 100%;
  box-sizing: border-box;
  height: 150rpx;
}
.text-canvas canvas{
  width: 100%;
  height: 100%;
}
.share-canvas,.canvas {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border:1px solid #f1f1f1;
  background: transparent;
}
.test{
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 40rpx;
}

.flex{
  width: 80rpx;
  height: 80rpx;
  border: 1px solid #f1f1f1;
  border-radius:8rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.flex image{
  width:100%;
  height: 80rpx;
}
.flex:nth-child(1){
  background-color: aqua;
}
.flex:nth-child(2){
  background-color: blue;
  border: 1px solid red;
}
.flex:nth-child(3){
  background-color: gold;
  border-radius: 50%;
  overflow: hidden;
}
.flex text{
  /* color: #fff; */
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
  text-align: center;
  /* line-height: 80rpx; */
}
.container .image-wrapper .arc {
  border-radius: 50%;
  width: 200rpx;
  height: 200rpx;
}
.flex image.draw{
  border-radius: 30rpx;
}
.flex image.borarc.ace{
  border-radius: 50%;
}
```

## canvas.js使用说明

- 要绘制的元素都必须带上相同的className,wrapperId都是必选项

- 绘制文字，需加上data-text属性
例如 data-text="11111111111111111"

- 控制文字行数，需加上data-line属性,没加属性文字自动换行
例如 data-line="1"

- 控制文字对齐方式，left,center,right,需加属性data-align
例如 data-align='center'

- 支持image,view,text,border,borderRadius,backgroundColor,绘制圆角矩形，绘制圆角图片，绘制圆形图片，文字自动换行，文字行数控制，超出部分省略号显示
