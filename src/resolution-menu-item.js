import videojs from 'video.js'

// 创建菜单项
class ResolutionMenuItem extends videojs.getComponent('MenuItem') {
  constructor(player, options) {
    super(player, {
      ...options,
      selectable: true,
      multiSelectable: false,
    })

    const { src, label, type, resolution } = options

    this.src = src
    this.label = label
    this.type = type
    this.resolution = resolution

    this.on(player, 'resolutionchange', () => {
      this.handleResolutionChange()
    })
  }

  handleClick(event) {
    super.handleClick(event)

    const player = this.player()

    // 切换视频源
    player.src({
      src: this.src,
      type: this.type,
      label: this.label,
      resolution: this.resolution,
    })

    player.trigger('resolutionchange')

    const currentTime = player.currentTime()
    const wasPlaying = !player.paused()

    // 使用 one() 来监听一次性事件
    player.one('loadedmetadata', () => {
      // 恢复播放时间
      player.currentTime(currentTime)

      // 如果之前在播放，则恢复播放
      if (wasPlaying) {
        player.play().catch(() => {
          videojs.log('Playback failed after resolution switch')
        })
      }
    })
  }

  // 处理分辨率变化
  handleResolutionChange() {
    this.selected(this.src === this.player().currentSrc())
  }

  dispose() {
    this.off(this.player(), 'resolutionchange')
    super.dispose()
  }
}

videojs.registerComponent('ResolutionMenuItem', ResolutionMenuItem)

export default ResolutionMenuItem
