// index.js
const backgroundMusicAudio = wx.createInnerAudioContext()
var backgroundStart = false
var questionAreas = []
var answerAreas = []
const wordsArray = [{
    word: "actually",
    meaning: "实际上"
  },
  {
    word: "beneficial",
    meaning: "有益的"
  },
  {
    word: "collaborate",
    meaning: "合作"
  }
];

Page({
  data: {
    words: wordsArray.map(item => item.word),
    meanings: wordsArray.map(item => item.meaning)
  },
  onLoad() {
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    this.playBackground();
  },
  backgroundAudioTest() {
    const backgroundMusic = wx.getBackgroundAudioManager();
    // 必须设置 title from https://developers.weixin.qq.com/community/develop/doc/0000426fd14258791acc7fda656800
    backgroundMusic.title = "测试背景音乐"
    //试验发现必须是网络资源
    backgroundMusic.src = 'https://oss.fxwljy.com/attach/file1720682520578.mp3'
    backgroundMusic.play()
    backgroundMusic.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  onShow() {
    if (!backgroundStart) {
      this.playBackground();
      console.log("重新播放")
    } else {
      console.log("没有重新播放")
    }
  },
  playBackground() {
    backgroundMusicAudio.stop();
    backgroundMusicAudio.autoplay = true
    backgroundMusicAudio.loop = true
    backgroundMusicAudio.src = 'https://oss.fxwljy.com/attach/file1720682520578.mp3'
    backgroundMusicAudio.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    backgroundStart = true
    //通过onAudioInterruptionBegin监听音频中断开始
    wx.onAudioInterruptionBegin((res) => {
      backgroundStart = false
    })
  },
  playMusic() {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = '/pages/music/s26wp-2ae6p.mp3'
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    this.vibrateShort();
  },
  vibrateShort() {
    wx.vibrateShort({
      type: 'light',
    })
  },
  touchStart(e) {

    console.log(e);
    const touchStart = e.touches[0]
    const positionX = touchStart.x;
    const positionY = touchStart.y;
    questionAreas.forEach(question => {
      if (question.left < positionX && question.right > positionX && question.top < positionY && question.bottom > positionY) {
        const position = questionAreas.indexOf(question)
        console.log("点击了第"+position+"个,单词是:"+this.data.words[position])
        this.vibrateShort();
        console.log("点击了问题区域")
      }
    })
  },
  touchMove() {

  },
  touchEnd() {

  },
  onShow() {
    this.getAllAreas();
  },
  getAllAreas() {
    const qustionQuery = wx.createSelectorQuery();
    qustionQuery.selectAll('#question').fields({
        node: true,
        dataset: true,
        rect: true,
        size: true
      })
      .exec((res) => {
        console.log("找到全部 question")
        console.log(res);
        questionAreas = res[0];
      });
    const answerQuery = wx.createSelectorQuery();
    answerQuery.selectAll('#answer').fields({
        node: true,
        dataset: true,
        rect: true,
        size: true
      })
      .exec((res) => {
        console.log("找到全部 answer")
        console.log(res);
        answerAreas = res[0];
      });
  }
})