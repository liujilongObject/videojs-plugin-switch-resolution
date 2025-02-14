import videojs from 'video.js'
import 'video.js/dist/video-js.min.css'

import './src/plugin.js'
import './src/plugin.scss'

const player = videojs('my-video', {
  autoplay: false,
  controls: true,
  preload: 'auto',
  language: 'zh-CN',
  width: 1000,
  height: 800,
  playbackRates: [0.5, 1, 1.5, 2],
  disablePictureInPicture: true,
  controlBar: {
    remainingTimeDisplay: {
      displayNegative: false,
    },
    pictureInPictureToggle: false,
  },
  sources: [
    {
      src: 'https://example.com/video1.mp4',
      type: 'video/mp4',
    },
  ],
})

player.pluginSwitchResolution({
  videoSources: [
    {
      src: 'https://example.com/video1.mp4',
      type: 'video/mp4',
      label: '智能 360P',
      resolution: '360',
    },
    {
      src: 'https://example.com/video2.mp4',
      type: 'video/mp4',
      label: '准高清 720P',
      resolution: '720',
    },
    {
      src: 'https://example.com/video3.mp4',
      type: 'video/mp4',
      label: '高清 1080P',
      resolution: '1080',
    },
  ],
  controlText: '分辨率',
})
