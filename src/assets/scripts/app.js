class slider {
  /**
   * @param {HTMLelement} elment 
   * @param {object} options 
   * @param {object} options.slidesToScroll *** NBR element to scroll  ***
   * @param {object} options.slidesVisible *** NBR slides Visible  ***
   */
  constructor (element, options = {}) {
    this.element = element
    console.log(this.element);
    
    this.options = Object.assign({}, {
      slidesToScroll : 1,
      slidesVisible: 1
    }, options)
    this.children = [].slice.call(element.children)
    let root = this.createDivWithClass('slider')
    let container = this.createDivWithClass('slider__container')
    container.classList.add('columns')
    root.appendChild(container)
    this.element.appendChild(root)
    this.children.forEach(function (child) {
      container.appendChild(child)
    })
  }
  /**
   *
   * @param {string} className 
   * @memberof carousel
   * @returns {HTMLelement}
   */
  createDivWithClass (className) {
    let div = document.createElement('div')
    div.classList.add(className)
    return div
  }
}


document.addEventListener('readystatechange', function () {
  new slider(document.querySelector('#slider'), {
    slidesToScroll: 3,
    slidesVisible: 3
  })
})