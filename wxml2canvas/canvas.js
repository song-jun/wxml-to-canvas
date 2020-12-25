/*
 * @Description: 
 * @Version: 
 * @Autor: MrSong
 * @Date: 2020-12-24 19:43:03
 * @LastEditors: MrSong
 * @LastEditTime: 2020-12-25 15:19:04
 */
/* eslint-disable */
const PROPERTIES = ['hover-class', 'hover-start-time', 'space', 'src']
const COMPUTED_STYLE = [
  'color',
  'font-size',
  'font-weight',
  'font-family',
  'backgroundColor',
  'border',
  'border-radius',
  'box-sizing',
  'line-height',
]
const DEFAULT_BORDER = '0px none rgb(0, 0, 0)'
const DEFAULT_BORDER_RADIUS = '0px'

// default z-index??
const DEFAULT_RANK = {
  view: 0,
  image: 1,
  text: 2,
}

const drawWrapper = (context, data) => {
  const {
    backgroundColor,
    width,
    height
  } = data
  context.setFillStyle(backgroundColor)
  context.fillRect(0, 0, width, height)
}

// todo: do more for different language
const strLen = str => {
  let count = 0
  for (let i = 0, len = str.length; i < len; i++) {
    count += str.charCodeAt(i) < 256 ? 1 : 2
  }
  return count / 2
}

const isMuitlpleLine = (data, text) => {
  const {
    'font-size': letterWidth,
    width
  } = data
  // console.log('letterWidth', letterWidth)
  const length = strLen(text)
  const rowlineLength = length * parseInt(letterWidth, 10)
  return rowlineLength > width
}

const drawMutipleLine = (context, data, text) => {
  let {
    'font-size': letterWidth,
    width,
    left,
    top,
    'line-height': lineHeightAttr,
  } = data;
  const lineHieght = lineHeightAttr === 'normal' ? Math.round(1.2 * letterWidth) : lineHeightAttr
  const rowLetterCount = Math.floor(width / parseInt(letterWidth, 10))
  const length = strLen(text)
  let lineWidth = 0;
  let lastSubStrIndex = 0; //每次开始截取的字符串的索引
  for (let i = 0; i < text.length; i++) {
    lineWidth += context.measureText(text[i]).width;
    if (lineWidth > width) {
      context.fillText(text.substring(lastSubStrIndex, i), left, top); //绘制截取部分
      top += parseFloat(lineHieght); //lineHieght为字体的高度
      lineWidth = 0;
      lastSubStrIndex = i;
    }
    if (i == text.length - 1) { //绘制剩余部分
      context.fillText(text.substring(lastSubStrIndex, i + 1), left, top);
    }
  }
  // for (let i = 0; i < length; i += rowLetterCount) {
  //   const lineText = text.substring(i, i + rowLetterCount)
  //   const rowNumber = Math.floor(i / rowLetterCount)
  //   const rowTop = top + rowNumber * parseInt(lineHieght, 10)
  //   console.log(lineText)
  //   context.fillText(lineText, left, rowTop)
  // }
}

const canvasWraptitleText = (context, data) => {
  // debugger
  let {
    dataset: {
      text,
      line,
      align
    },
    left,
    top,
    color,
    'line-height': lineHeight,
    'width': maxWidth,
    'font-weight': fontWeight,
    'font-size': fontSize,
    'font-family': fontFamily,
  } = data
  const setTextBaseline = line > 1 ? 'normal' : 'normal';
  lineHeight = (lineHeight === 'normal' ? Math.round(parseFloat(fontSize)) : lineHeight);
  // console.log('setTextBaseline',setTextBaseline)
  const maxLine = line ? line : 1;
  const canvasText = Array.isArray(text) ? text[0] : text
  context.font = `${fontWeight} ${Math.round(
    parseFloat(fontSize),
  )}px ${fontFamily}`
  context.setFillStyle(color)
  context.setTextBaseline(setTextBaseline)
  console.log(left, top, lineHeight)
  //处理文字多出省略号显示
  let allRow = Math.ceil(context.measureText(canvasText).width / maxWidth); //实际总共能分多少行
  let count = allRow >= maxLine ? maxLine : allRow; //实际能分多少行与设置的最大显示行数比，谁小就用谁做循环次数
  let endPos = 0; //当前字符串的截断点
  for (let j = 0; j < count; j++) {
    let nowStr = canvasText.slice(endPos); //当前剩余的字符串
    let rowWid = 0; //每一行当前宽度  
    if (context.measureText(nowStr).width > maxWidth) { //如果当前的字符串宽度大于最大宽度，然后开始截取
      for (let m = 0; m < nowStr.length; m++) {
        rowWid += context.measureText(nowStr[m]).width; //当前字符串总宽度
        if (rowWid > maxWidth) {
          if (j === maxLine - 1) { //如果是最后一行
            context.fillText(nowStr.slice(0, m - 1) + '...', left, top + (j + 1) * (parseFloat(lineHeight))); //(j+1)*(parseFloat(lineHeight))这是每一行的高度
          } else {
            context.fillText(nowStr.slice(0, m), left, top + (j + 1) * (parseFloat(lineHeight)));
          }
          endPos += m; //下次截断点
          break;
        }
      }
    } else { //如果当前的字符串宽度小于最大宽度就直接输出
      context.fillText(nowStr.slice(0), left, top + (j + 1) * lineHeight);
    }
  }
}

// enable color, font, for now only support chinese
const drawText = (context, data) => {
  console.log('drawText', data)
  const {
    dataset: {
      text,
      line,
      align
    },
    left,
    width,
    top,
    right,
    color,
    'font-weight': fontWeight,
    'font-size': fontSize,
    'font-family': fontFamily,
  } = data
  const canvasText = Array.isArray(text) ? text[0] : text
  context.font = `${fontWeight} ${Math.round(
    parseFloat(fontSize),
  )}px ${fontFamily}`
  context.setFillStyle(color)
  context.setTextBaseline('top')
  if (line) {
    context.setTextAlign('left')
    canvasWraptitleText(context, data)
  } else {
    if (isMuitlpleLine(data, canvasText)) {
      context.setTextAlign('left')
      drawMutipleLine(context, data, canvasText)
    } else {
      if (align == 'center') {
        context.setTextAlign('center')
        context.fillText(canvasText, width / 2, top)
      } else if (align == "right") {
        context.setTextAlign('right')
        context.fillText(canvasText, right, top)
      } else {
        context.setTextAlign('left')
        context.fillText(canvasText, left, top)
      }
    }
  }
  context.restore()
}

const getImgInfo = src =>
  new Promise((resolve, reject) => {
    wx.getImageInfo({
      src,
      success(res) {
        resolve(res)
      },
    })
  })

const hasBorder = border => border !== DEFAULT_BORDER
const hasBorderRadius = borderRadius => borderRadius !== DEFAULT_BORDER_RADIUS

const getBorderAttributes = border => {
  let borderColor, borderStyle
  let borderWidth = 0

  if (hasBorder) {
    borderWidth = parseInt(border.split(/\s/)[0], 10)
    borderStyle = border.split(/\s/)[1]
    borderColor = border.match(/(rgb).*/gi)[0]
  }
  if (border == DEFAULT_BORDER) {
    borderColor = 'transparent'
  }
  // console.log(borderColor, borderStyle, borderWidth)
  return {
    borderWidth,
    borderStyle,
    borderColor,
  }
}

const getImgRect = (imgData, borderWidth) => {
  const {
    width,
    height,
    left,
    top
  } = imgData
  const imgWidth = width - 2 * borderWidth
  const imgHeight = height - 2 * borderWidth
  const imgLeft = left + borderWidth
  const imgTop = top + borderWidth
  return {
    imgWidth,
    imgHeight,
    imgLeft,
    imgTop,
  }
}

const getArcCenterPosition = imgData => {
  const {
    width,
    height,
    left,
    top
  } = imgData
  const coordX = width / 2 + left
  const coordY = height / 2 + top
  return {
    coordX,
    coordY,
  }
}

const getArcRadius = (imgData, borderWidth = 0) => {
  const {
    width
  } = imgData
  return width / 2 - borderWidth / 2
}

const getCalculatedImagePosition = (imgData, naturalWidth, naturalHeight) => {
  const {
    'border-radius': borderRadius,
    border
  } = imgData
  const {
    borderWidth
  } = getBorderAttributes(border)
  const {
    imgWidth,
    imgHeight,
    imgLeft,
    imgTop
  } = getImgRect(
    imgData,
    borderWidth,
  )
  const ratio = naturalWidth / naturalHeight
  // tweak for real width and position => center center
  const realWidth = ratio > 0 ? imgWidth : imgHeight * ratio
  const realHeight = ratio > 0 ? imgWidth * (1 / ratio) : imgHeight
  const offsetLeft = ratio > 0 ? 0 : (imgWidth - realWidth) / 2
  const offsetTop = ratio > 0 ? (imgHeight - realHeight) / 2 : 0
  return {
    borderRadius,
    realWidth,
    realHeight,
    left: imgLeft + offsetLeft,
    top: imgTop + offsetTop,
  }
}

const drawRectRadiusImage = (context, imgData) => {
  const {
    'width': w,
    'height': h,
    src,
    border,
    'left': x,
    'top': y,
    'border-radius': borderRadius
  } = imgData
  const {
    borderColor,
    borderWidth
  } = getBorderAttributes(border)
  return getImgInfo(src).then(res => {
    // const {
    //   width: naturalWidth,
    //   height: naturalHeight
    // } = res

    // let {
    //   'left': x,
    //   'top': y,
    //   'realWidth': w,
    //   'realHeight': h,
    //   'borderRadius': borderRadius,
    // } = getCalculatedImagePosition(
    //   imgData,
    //   naturalWidth,
    //   naturalHeight,
    // )
    let r = parseFloat(borderRadius);
    let l = 2 * borderWidth;
    // console.log(src, x, y, w, h, r)
    // 绘制海报背景图片圆角
    if (w < 2 * r) {
      r = w / 2;
    }
    if (h < 2 * r) {
      r = h / 2;
    }
    context.save();
    context.beginPath();
    context.strokeStyle = borderColor;
    context.setLineWidth(l)
    context.arc(x + r + l / 2, y + r + l / 2, r, Math.PI, Math.PI * 1.5);
    context.arc(x + w - r - l / 2, y + r + l / 2, r, Math.PI * 1.5, Math.PI * 2);
    context.arc(x + w - r - l / 2, y + h - r - l / 2, r, 0, Math.PI * 0.5);
    context.arc(x + r + l / 2, y + h - r - l / 2, r, Math.PI * 0.5, Math.PI);
    context.moveTo(x + l / 2, y + h - r - l / 2);
    context.lineTo(x + l / 2, y + r + l / 2);
    context.stroke();
    context.clip();
    context.drawImage(src, x + l / 2, y + l / 2, w - l, h - l);
    // 恢复之前保存的绘图上下文
    context.restore()
  })
}
const drawArcImage = (context, imgData) => {
  const {
    border,
    src
  } = imgData
  const {
    coordX,
    coordY
  } = getArcCenterPosition(imgData)
  const {
    borderWidth,
    borderColor
  } = getBorderAttributes(border)
  // console.log(borderColor)
  return getImgInfo(src).then(res => {
    const {
      width: naturalWidth,
      height: naturalHeight
    } = res
    const arcRadius = getArcRadius(imgData)
    let l = 2 * borderWidth;
    context.save()
    context.beginPath()
    // console.log('arcRadius', coordX, coordY, arcRadius)
    context.arc(coordX + l / 2, coordY + l / 2, arcRadius, 0, 2 * Math.PI)
    context.strokeStyle = borderColor;
    context.setLineWidth(l)
    context.stroke();
    context.closePath();
    context.clip()
    const {
      realWidth,
      realHeight
    } = getCalculatedImagePosition(
      imgData,
      naturalWidth,
      naturalHeight,
    )
    // console.log(realWidth,realHeight,coordX,coordY)
    context.drawImage(
      src,
      0,
      0,
      naturalWidth,
      naturalHeight,
      coordX - arcRadius + l / 2,
      coordY - arcRadius + l / 2,
      2 * arcRadius,
      2 * arcRadius,
    )
    context.restore()
  })
}

const drawRectImage = (context, imgData) => {
  const {
    src,
    width,
    height,
    left,
    top
  } = imgData

  return getImgInfo(src).then(res => {
    const {
      width: naturalWidth,
      height: naturalHeight
    } = res
    context.save()
    context.beginPath()
    context.rect(left, top, width, height)
    context.closePath()
    context.clip()

    const {
      left: realLeft,
      top: realTop,
      realWidth,
      realHeight,
    } = getCalculatedImagePosition(imgData, naturalWidth, naturalHeight)
    context.drawImage(
      src,
      0,
      0,
      naturalWidth,
      naturalHeight,
      realLeft,
      realTop,
      realWidth,
      realHeight,
    )
    context.restore()
  })
}

const drawArcBorder = (context, imgData) => {
  const {
    border
  } = imgData
  const {
    coordX,
    coordY
  } = getArcCenterPosition(imgData)
  const {
    borderWidth,
    borderColor
  } = getBorderAttributes(border)
  const arcRadius = getArcRadius(imgData, borderWidth)
  context.save()
  context.beginPath()
  context.setLineWidth(borderWidth)
  context.setStrokeStyle(borderColor)
  context.arc(coordX, coordY, arcRadius, 0, 2 * Math.PI)
  context.stroke()
  context.restore()
}

const drawRectBorder = (context, imgData) => {
  const {
    border
  } = imgData
  const {
    left,
    top,
    width,
    height
  } = imgData
  const {
    borderWidth,
    borderColor
  } = getBorderAttributes(border)

  const correctedBorderWidth = borderWidth + 1 // draw may cause empty 0.5 space
  context.save()
  context.beginPath()
  context.setLineWidth(correctedBorderWidth)
  context.setStrokeStyle(borderColor)

  context.rect(
    left + borderWidth / 2,
    top + borderWidth / 2,
    width - borderWidth,
    height - borderWidth,
  )
  context.stroke()
  context.restore()
}

// image, enable border-radius: 50%, border, bgColor
const drawImage = (context, imgData) => {
  // debugger
  const {
    border,
    'border-radius': borderRadius
  } = imgData
  let drawImagePromise
  console.log('drawImage', imgData, borderRadius)
  if (borderRadius == '50%') {
    console.log(1)
    drawImagePromise = drawArcImage(context, imgData)
  } else {
    if (hasBorderRadius(borderRadius)) {
      console.log(2)
      drawImagePromise = drawRectRadiusImage(context, imgData)
    } else {
      console.log(3)
      drawImagePromise = drawRectImage(context, imgData)
    }
  }

  return drawImagePromise.then(() => {
    if (borderRadius == '50%') {
      return drawArcImage(context, imgData)
    } else {
      if (hasBorder(border)) {
        if (hasBorderRadius(borderRadius)) {
          return drawRectRadiusImage(context, imgData)
        } else {
          return drawRectBorder(context, imgData)
        }
      }
    }
    return Promise.resolve()
  })
}

// e.g. 10%, 4px
const getBorderRadius = imgData => {
  const {
    width,
    height,
    'border-radius': borderRadiusAttr
  } = imgData
  const borderRadius = parseInt(borderRadiusAttr, 10)
  if (borderRadiusAttr.indexOf('%') !== -1) {
    const borderRadiusX = parseInt(borderRadius / 100 * width, 10)
    const borderRadiusY = parseInt(borderRadius / 100 * height, 10)
    return {
      isCircle: borderRadiusX === borderRadiusY,
      borderRadius: borderRadiusX,
      borderRadiusX,
      borderRadiusY,
    }
  } else {
    return {
      isCircle: true,
      borderRadius,
    }
  }
}

const drawViewArcBorder = (context, imgData) => {
  const {
    width,
    height,
    left,
    top,
    backgroundColor,
    border
  } = imgData
  const {
    borderRadius
  } = getBorderRadius(imgData)
  const {
    borderWidth,
    borderColor
  } = getBorderAttributes(border)
  // console.log('🐞-imgData', imgData)
  context.beginPath()
  context.moveTo(left + borderRadius, top)
  context.lineTo(left + width - borderRadius, top)
  context.arcTo(
    left + width,
    top,
    left + width,
    top + borderRadius,
    borderRadius,
  )
  context.lineTo(left + width, top + height - borderRadius)
  context.arcTo(
    left + width,
    top + height,
    left + width - borderRadius,
    top + height,
    borderRadius,
  )
  context.lineTo(left + borderRadius, top + height)
  context.arcTo(
    left,
    top + height,
    left,
    top + height - borderRadius,
    borderRadius,
  )
  context.lineTo(left, top + borderRadius)
  context.arcTo(left, top, left + borderRadius, top, borderRadius)
  context.closePath()
  if (backgroundColor) {
    context.setFillStyle(backgroundColor)
    context.fill()
  }
  if (borderColor && borderWidth) {
    context.setLineWidth(borderWidth)
    context.setStrokeStyle(borderColor)
    context.stroke()
  }
}

const drawViewBezierBorder = (context, imgData) => {
  const {
    width,
    height,
    left,
    top,
    backgroundColor,
    border
  } = imgData
  const {
    borderWidth,
    borderColor
  } = getBorderAttributes(border)
  const {
    borderRadiusX,
    borderRadiusY
  } = getBorderRadius(imgData)
  context.beginPath()
  context.moveTo(left + borderRadiusX, top)
  context.lineTo(left + width - borderRadiusX, top)
  context.quadraticCurveTo(left + width, top, left + width, top + borderRadiusY)
  context.lineTo(left + width, top + height - borderRadiusY)
  context.quadraticCurveTo(
    left + width,
    top + height,
    left + width - borderRadiusX,
    top + height,
  )
  context.lineTo(left + borderRadiusX, top + height)
  context.quadraticCurveTo(
    left,
    top + height,
    left,
    top + height - borderRadiusY,
  )
  context.lineTo(left, top + borderRadiusY)
  context.quadraticCurveTo(left, top, left + borderRadiusX, top)
  context.closePath()
  if (backgroundColor) {
    context.setFillStyle(backgroundColor)
    context.fill()
  }
  if (borderColor && borderWidth) {
    context.setLineWidth(borderWidth)
    context.setStrokeStyle(borderColor)
    context.stroke()
  }
}

// enable border, border-radius, bgColor, position
const drawView = (context, imgData) => {
  const {
    isCircle
  } = getBorderRadius(imgData)
  if (isCircle) {
    drawViewArcBorder(context, imgData)
  } else {
    drawViewBezierBorder(context, imgData)
  }
}

const isTextElement = item => {
  const {
    dataset: {
      text
    },
    type
  } = item
  return Boolean(text) || type === 'text'
}

const isImageElement = item => {
  const {
    src,
    type
  } = item
  return Boolean(src) || type === 'image'
}

const isViewElement = item => {
  const {
    type
  } = item
  return type === 'view'
}

const formatElementData = elements =>
  elements.map(element => {
    if (isTextElement(element)) {
      element.type = 'text'
      element.rank = DEFAULT_RANK.text
    } else if (isImageElement(element)) {
      element.type = 'image'
      element.rank = DEFAULT_RANK.image
    } else {
      element.type = 'view'
      element.rank = DEFAULT_RANK.view
    }
    return element
  })

// todo: use z-index as order to draw??
const getSortedElementsData = elements =>
  elements.sort((a, b) => {
    if (a.rank < b.rank) {
      return -1
    } else if (a.rank > b.rank) {
      return 1
    }
    return 0
  })

const drawElements = (context, storeItems) => {
  const itemPromise = []
  storeItems.forEach(item => {
    if (isTextElement(item)) {
      const text = drawText(context, item)
      itemPromise.push(text)
    } else if (isImageElement(item)) {
      const image = drawImage(context, item)
      itemPromise.push(image)
    } else {
      const view = drawView(context, item)
      itemPromise.push(view)
    }
  })
  return itemPromise
}

// storeObject: { 0: [...], 1: [...] }
// chain call promise based on Object key
const drawElementBaseOnIndex = (context, storeObject, key = 0, drawPromise) => {
  if (typeof drawPromise === 'undefined') {
    drawPromise = Promise.resolve()
  }
  const objectKey = key // note: key is changing when execute promise then
  const chainPromise = drawPromise.then(() => {
    const nextPromise = storeObject[objectKey] ?
      Promise.all(drawElements(context, storeObject[objectKey])) :
      Promise.resolve()
    return nextPromise
  })

  if (key > Object.keys(storeObject).length) {
    return chainPromise
  } else {
    return drawElementBaseOnIndex(context, storeObject, key + 1, chainPromise)
  }
}

const drawCanvas = (canvasId, wrapperData, innerData, _this) => {
  const context = wx.createCanvasContext(canvasId, _this)
  context.setTextBaseline('top')

  // todo: use this after weixin fix stupid clip can't work bug in fillRect
  // for now, just set canvas background as a compromise
  drawWrapper(context, wrapperData[0])

  const storeObject = {}

  const sortedElementData = getSortedElementsData(formatElementData(innerData)) // fake z-index

  sortedElementData.forEach(item => {
    if (!storeObject[item.rank]) {
      // initialize
      storeObject[item.rank] = []
    }
    if (isTextElement(item) || isImageElement(item) || isViewElement(item)) {
      storeObject[item.rank].push(item)
    }
  })
  // note: draw is async
  return drawElementBaseOnIndex(context, storeObject).then(
    () =>
      new Promise((resolve, reject) => {
        context.draw(true, () => {
          resolve()
        })
      }),
  )
}

const wxSelectorQuery = element =>
  new Promise((resolve, reject) => {
    try {
      wx
        .createSelectorQuery()
        .selectAll(element)
        .fields({
          dataset: true,
          size: true,
          rect: true,
          properties: PROPERTIES,
          computedStyle: COMPUTED_STYLE,
        },
          res => {
            resolve(res)
            // console.log(res)
          },
        )
        .exec()
    } catch (error) {
      reject(error)
    }
  })

const wxml2canvas = (wrapperId, elementsClass, canvasId, _this) => {
  const getWrapperElement = wxSelectorQuery(wrapperId)
  const getInnerElements = wxSelectorQuery(elementsClass)
  return new Promise((resolve, reject) => {
    let obj, originTop, arr;
    Promise.all([getWrapperElement, getInnerElements]).then(data => {
      obj = data[0][0];
      originTop = obj.top;
      arr = data[1];
      arr.forEach((item) => {
        item.top = item.top - originTop;
      })
      return drawCanvas(canvasId, data[0], arr, _this)
    })
      .then((res) => {
        resolve(obj)
      }).catch((err) => {
        reject(err)
      })
  })
}

// export default wxml2canvas
module.exports = {
  wxml2canvas,
  wxSelectorQuery
}