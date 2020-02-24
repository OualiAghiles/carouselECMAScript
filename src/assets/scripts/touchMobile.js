/**
 * Ajoute la navigation tactile pour le Slider / pour mobile et drag
 *
 * @export
 * @class SliderTouchMobile
 */
export default class SliderTouchMobile {
  /**
   *Creates an instance of SliderTouchMobile.
    * @param {Slider} slider
    * @memberof SliderTouchMobile
    */
  constructor(slider) {
    this.slider = slider
    this.width = this.slider.containerWidth
    slider.container.addEventListener('dragstart',e => e.preventDefault())
    slider.container.addEventListener('mousedown', this.startDrag.bind(this))
    slider.container.addEventListener('touchstart', this.startDrag.bind(this))
    slider.container.addEventListener('pointerdown', this.startDrag.bind(this));

    window.addEventListener('mousemove', this.drag.bind(this))
    window.addEventListener('touchmove', this.drag.bind(this))
    window.addEventListener('pointermove', this.drag.bind(this));

    window.addEventListener('mouseup', this.endDrag.bind(this))
    window.addEventListener('touchend', this.endDrag.bind(this))
    window.addEventListener('touchcancel', this.endDrag.bind(this))
    window.addEventListener('pointerup', this.endDrag.bind(this));
  }
  
  // Methods
  
  /**
   *
   * Démarre le déplacement au touché
   * @param {MouseEvent|TouchEvent} e
   * @memberof SliderTouchMobile
   */
  startDrag(e) {    
    if(e.touches) {
      if(e.touches.length > 1) {
        return
      } else {
        e = e.touches[0]
      }  
    }
    this.origin = {
      x: e.screenX,
      y: e.screenY
    }
    this.slider.disableTransition()
  }
  /**
   *
   *
   * @param {MouseEvent|TouchEvent} e
   * @memberof SliderTouchMobile
   */
  drag(e) {
    
    if (this.origin) {
      let point = e.touches ? e.touches[0] : e
      let translate = {x: point.screenX - this.origin.x, y: point.screenY - this.origin.y}
      if (e.touches && Math.abs(translate.x) > Math.abs(translate.y)) {
        e.preventDefault()
        e.stopPropagation()
      }
      let baseTranslate = this.slider.currentItem * - 100 / this.slider.items.length
      this.lastTranslate = translate
      this.slider.translate(baseTranslate + (100 * translate.x / this.width))
    }
  }

  /**
   *
   * Fin du déplacement
   * @param {MouseEvent|TouchEvent} e
   * @memberof SliderTouchMobile
   */
  endDrag(e) {
    if (this.origin && this.lastTranslate) {
      this.slider.enableTransition()
      if(Math.abs(this.lastTranslate.x / this.slider.sliderWidth ) > 0.15) {
        if (this.lastTranslate.x < 0) {
          this.slider.next()
        } else {
          this.slider.prev()
        }
      } else {
       this.slider.goToItem(this.slider.currentItem)   
      }
    }
    this.origin = null

  }
}