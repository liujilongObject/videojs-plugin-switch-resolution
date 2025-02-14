import videojs from 'video.js'
import ResolutionMenuItem from './resolution-menu-item'
import './plugin.scss'

// 默认配置
const pluginOptions = {
  videoSources: [],
  controlText: 'Resolution',
}

// 创建控制条按钮
class ResolutionMenuButton extends videojs.getComponent('MenuButton') {
  constructor(player, options) {
    super(player, options)

    this.on(player, 'resolutionchange', () => {
      this.updateLabel()
    })
  }

  createEl() {
    const el = super.createEl()

    this.labelElId_ = 'vjs-switch-resolution-value-label-' + this.id_

    this.labelEl_ = videojs.dom.createEl('div', {
      className: 'vjs-switch-resolution-value',
      id: this.labelElId_,
      textContent: `${pluginOptions.videoSources[0]?.resolution}P`,
    })

    el.appendChild(this.labelEl_)

    return el
  }

  dispose() {
    if (this.labelEl_) {
      this.labelEl_ = null
    }
    super.dispose()
  }

  buildCSSClass() {
    return `vjs-switch-resolution-button ${super.buildCSSClass()}`
  }

  buildWrapperCSSClass() {
    return `vjs-switch-resolution ${super.buildWrapperCSSClass()}`
  }

  createItems() {
    const videoSources = pluginOptions.videoSources || []
    if (videoSources.length === 0) {
      return []
    }
    const currentSrc = this.player().currentSrc()

    return videoSources.map(
      (source) =>
        new ResolutionMenuItem(this.player(), {
          label: source.label,
          src: source.src,
          type: source.type,
          resolution: source.resolution,
          selected: source.src === currentSrc,
        })
    )
  }

  updateLabel(event) {
    this.labelEl_.textContent = `${this.player().currentSource().resolution}P`
  }
}
videojs.registerComponent('ResolutionMenuButton', ResolutionMenuButton)

const Plugin = videojs.getPlugin('plugin')

// 创建插件
class ResolutionSwitcherPlugin extends Plugin {
  constructor(player, options) {
    super(player, options)

    try {
      this.initializeButton()
    } catch (error) {
      videojs.log.error('ResolutionSwitcherPlugin initialization failed:', error)
    }
  }

  initializeButton() {
    const controlBar = this.player.getChild('controlBar')
    if (!controlBar) return

    // 使用 getChild 获取全屏按钮
    const fullscreenToggle = controlBar.getChild('FullscreenToggle')
    const buttonIndex = fullscreenToggle
      ? controlBar.children().indexOf(fullscreenToggle)
      : controlBar.children().length

    // 添加子组件
    if (this.getVideoSources().length > 0) {
      ResolutionMenuButton.prototype.controlText_ = pluginOptions.controlText

      controlBar.addChild('ResolutionMenuButton', {}, buttonIndex)
    }
  }

  getVideoSources() {
    return pluginOptions.videoSources || []
  }

  dispose() {
    const controlBar = this.player.getChild('controlBar')
    const resolutionButton = controlBar?.getChild('ResolutionMenuButton')
    if (resolutionButton) {
      controlBar?.removeChild(resolutionButton)
    }
    super.dispose()
  }
}

// 自定义默认状态 https://videojs.com/guides/plugins/#statefulness
ResolutionSwitcherPlugin.defaultState = {
  initialized: false,
}

// 注册插件
videojs.registerPlugin('pluginSwitchResolution', function (options) {
  Object.assign(pluginOptions, options)
  const player = videojs.getPlayer(document.querySelector('.video-js'))
  if (!player) {
    videojs.log.error(
      'player not found: please check the video element with class name "video-js".'
    )
    return
  }
  return new ResolutionSwitcherPlugin(player, pluginOptions)
})

export default ResolutionSwitcherPlugin
