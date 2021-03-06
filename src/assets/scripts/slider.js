import SliderTouchMobile from './touchMobile.js'
/**
 * caroussel responsive avec possibilité d'afficher un ou plusieurs element par slide
 * incluant la pagination rotation en boucle et le tactile
 * @description **Slider / carousel responsive and versatile**
 * @class
 * @tutorial will be added later
 *
 * @export
 */
class Slider {
  /**
   * This callback is displayed as part of the Requester class.
   * @callback moveCallBack
   * @param {number} index
  */

  /**
   * @param {HTMLelement} element
   * @param {object} options
   * @param {object} [options.slidesToScroll = 1] *** NBR element to scroll  ***
   * @param {object} [options.slidesVisible = 1] *** NBR elements Visible  ***
   * @param {boolean} [options.loop = false] *** doit on bouclé en fin de slide  ***
   * @param {boolean} [options.pagination = false] *** doit afficher la pagination  ***
   * @param {boolean} [options.navigation = true] *** doit afficher la navigation  ***
   * @param {boolean} [options.infinite = false] *** doit on bouclé en a l'infini  ***
   * @constructor
   */
  constructor (element, options = {}) {
    this.element = element
    this.options = Object.assign({}, {
      slidesToScroll: 1,
      slidesVisible: 1,
      loop: false,
      pagination: false,
      navigation: true,
      infinite: false
    }, options)
    if (this.options.infinite && this.options.loop) {
      throw new Error("l'option loop n'est pas compatible avec l'option infinite")
    }
    const children = Array.from(element.children)
    this.isMobile = false
    this.currentItem = 0
    this.moveCallbacks = []
    this.offset = 0
    // crations des Elements + Modification du DOM
    this.root = this.createDivWithClass('slider')
    this.container = this.createDivWithClass('slider__container')
    this.root.setAttribute('tabindex', 0)
    this.root.appendChild(this.container)
    this.element.appendChild(this.root)
    this.items = children.map((child) => {
      const item = this.createDivWithClass('slider__item')
      item.appendChild(child)
      return item
    })
    if (this.options.infinite) {
      this.offset = this.options.slidesVisible + this.options.slidesToScroll
      if (this.offset > children.length) {
        console.error("il n' y a pas assez d'elements dans le carousel ", this.element)
      }
      this.items = [
        ...this.items.slice(this.items.length - this.offset).map(el => el.cloneNode(true)),
        ...this.items,
        ...this.items.slice(0, this.offset).map(el => el.cloneNode(true))
      ]

      this.goToItem(this.offset, false)
    }
    this.items.forEach(item => this.container.appendChild(item))
    this.setStyle()
    if (this.options.navigation) this.createNavigation()
    if (this.options.pagination) this.createPagination()

    // Evenement
    this.moveCallbacks.forEach(cd => cd(this.currentItem))
    this.onWindowResize()
    window.addEventListener('resize', this.onWindowResize.bind(this))
    this.root.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Right') {
        this.next()
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        this.prev()
      }
    })
    if (this.options.infinite) {
      this.container.addEventListener('transitionend', this.resetInfinite.bind(this))
    }
    // Plugins
    const touch = new SliderTouchMobile(this)
    touch()
  }

  /**
   * setStyle - applique les bonne dimmention au elements du carousel
   *
   * @return {HTMLelement}  width of elements
   */
  setStyle () {
    const ratio = this.items.length / this.slidesVisible
    this.container.style.width = (ratio * 100) + '%'
    this.items.forEach(item => {
      item.style.width = ((100 / this.slidesVisible) / ratio) + '%'
    })
  }

  /**
   * @description create navigation and add eventlisteners for the slider
   * @returns {HTMLElement} navigation slider
   */
  createNavigation () {
    const nextButton = this.createDivWithClass('slider__next')
    const prevButton = this.createDivWithClass('slider__prev')
    this.root.appendChild(nextButton)
    this.root.appendChild(prevButton)
    nextButton.addEventListener('click', this.next.bind(this))
    prevButton.addEventListener('click', this.prev.bind(this))
    if (this.options.loop === true) {
      return
    }
    this.onMove(index => {
      if (index === 0) {
        prevButton.classList.add('slider__prev--hidden')
      } else {
        prevButton.classList.remove('slider__prev--hidden')
      }
      if (this.items[this.currentItem + this.options.slidesVisible] === undefined) {
        nextButton.classList.add('slider__next--hidden')
      } else {
        nextButton.classList.remove('slider__next--hidden')
      }
    })
  }

  /**
   * create pagination and eventlisteners for the slider
   * @returns {HTMLElement} pagination slider
   */
  createPagination () {
    const pagination = this.createDivWithClass('slider__pagination')
    const buttons = []
    this.root.appendChild(pagination)
    for (let i = 0; i < (this.items.length - (2 * this.offset)); i = i + this.options.slidesToScroll) {
      const button = this.createDivWithClass('slides__pagination--button')
      button.addEventListener('click', () => this.goToItem(i + this.offset))
      pagination.appendChild(button)
      buttons.push(button)
    }
    this.onMove(index => {
      const count = this.items.length - (2 * this.offset)
      const activePagination = buttons[Math.floor(((index - this.offset) % count) / this.options.slidesToScroll)]
      if (activePagination) {
        buttons.forEach(btn => btn.classList.remove('active'))
        activePagination.classList.add('active')
      }
    })
  }

  /**
   * @description call the methode goToItem to go to the next element
   */
  next () {
    this.goToItem(this.currentItem + this.slidesToScroll)
  }

  /**
   * @description call the methode goToItem to go to the previous element
   */
  prev () {
    this.goToItem(this.currentItem - this.slidesToScroll)
  }

  /**
   * @description deplacement du conteneur relativement au pourcentage ajouter comme parametre
   * @param {Number} pucentage
   */

  translate (pucentage) {
    this.container.style.transform = 'translate3d(' + pucentage + '%, 0 , 0)'
  }

  /**
   * goToItem - deplace le slider ver l'element cible
   *
   * @param  {Number} index current index
   * @param {Boolean} [animation = true] active les animations css
   * @return {Number}       target index
   */
  goToItem (index, animation = true) {
    if (index < 0) {
      if (this.options.loop) {
        index = this.items.length - this.slidesVisible
      } else {
        return
      }
    } else if (index >= this.items.length || (this.items[this.currentItem + this.slidesVisible] === undefined && index > this.currentItem)) {
      if (this.options.loop) {
        index = 0
      } else {
        return
      }
    }
    this.currentItem = index
    if (animation === false) this.disableTransition()
    const translateX = index * (-100 / this.items.length)
    this.translate(translateX)
    this.container.offsetWidth // force repaint dom
    if (animation === false) {
      this.enableTransition()
    }
    this.moveCallbacks.forEach(cd => cd(index))
  }

  /**
   * @description fonction pour creer un element "div" avec une class
   * @param {string} className
   * @memberof carousel
   * @returns {HTMLelement}
   */
  createDivWithClass (className) {
    const div = document.createElement('div')
    div.classList.add(className)
    return div
  }

  /**
   *
   * @param {moveCallBack} cb push the callback to array this.moveCallbaxks
   */
  onMove (cb) {
    this.moveCallbacks.push(cb)
  }

  /**
   * @description Verifie si la fenètre est redimentionnner ou inferieur a 800px pour
   * changer le nombre d'element afficher par slide
   */
  onWindowResize () {
    const mobile = window.innerWidth < 800
    if (mobile !== this.isMobile) {
      this.isMobile = mobile
      this.setStyle()
      this.moveCallbacks.forEach(cd => cd(this.currentItem))
    }
  }

  /**
   * @description Disable transitions
   */
  disableTransition () {
    this.container.style.transition = 'none'
  }

  /**
   * Enable transitions
  */
  enableTransition () {
    this.container.style.transition = ''
  }

  /**
   * Deplace "container" pour donner l'impression d'un slide infini
   */
  resetInfinite () {
    if (this.currentItem <= this.options.slidesToScroll) {
      this.goToItem(this.currentItem + this.items.length - (2 * this.offset), false)
    }
    if (this.currentItem >= this.items.length - this.offset) {
      this.goToItem(this.currentItem - (this.items.length - (2 * this.offset)), false)
    }
  }

  /**
   * @returns {number} Nombre de silde a slider
   */

  get slidesToScroll () {
    return this.isMobile ? 1 : this.options.slidesToScroll
  }

  /**
   * @returns {number} Nombre de silde visibel
   */
  get slidesVisible () {
    return this.isMobile ? 1 : this.options.slidesVisible
  }

  /**
   * getter needed to calculation ratios
   * @description Get the width of the container
   * @returns {Number} largeur du container
  */
  get containerWidth () {
    return this.container.offsetWidth
  }

  /**
   * @returns {Number} largeur du root
  */
  get sliderWidth () {
    return this.root.offsetWidth
  }
}

document.addEventListener('readystatechange', () => {
  const s1 = new Slider(document.querySelector('#slider'), {
    slidesVisible: 2,
    slidesToScroll: 2,
    loop: false,
    infinite: true,
    pagination: true
  })
  s1()
  const s2 = new Slider(document.querySelector('#slider2'), {
    slidesToScroll: 1,
    slidesVisible: 1,
    loop: true,
    pagination: true
  })
  s2()
})
