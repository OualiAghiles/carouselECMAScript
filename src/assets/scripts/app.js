class slider {
  /**

   */
  constructor (element, options = {}) {
    this.element = element
    this.options = Object.assign({}, {
      slidesToScroll : 1,

    }, options)

    })
    this.setStyle()
    this.createNavigation()
    this.moveCallbacks.forEach(cd => cd(0))
  }
  /**
   * setStyle - applique les bonne dimmention au elements du carousel
   *
   * @return {HTMLelement}  width of elements
   */
  setStyle () {
    let ratio = this.items.length / this.options.slidesVisible
    this.container.style.width = (ratio * 100) + "%"
    this.items.forEach(item =>{
      item.style.width = ((100 / this.options.slidesVisible) / ratio ) + '%'
    })
  }
  createNavigation () {
    let nextButton = this.createDivWithClass('slider__next')
    let prevButton = this.createDivWithClass('slider__prev')
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
  next () {
    this.goToItem(this.currentItem + this.options.slidesToScroll)
  }
  prev () {
    this.goToItem(this.currentItem - this.options.slidesToScroll)
  }
  /**

   *

   * @memberof carousel
   * @returns {HTMLelement}
   */
  createDivWithClass (className) {
    let div = document.createElement('div')
    div.classList.add(className)
    return div
  }

}


  new slider(document.querySelector('#slider'), {

  })

