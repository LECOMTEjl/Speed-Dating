class Swiper extends HTMLElement {
    attributes = {
        currPage : 0
    }

    numberPages = 0
    wrapperWidth = 0

    styleCss = `
        .swiper {
            margin-left:auto;
            margin-right:auto;
            position:relative;
            overflow:hidden;
            list-style:none;
            padding:0;
            z-index:2;
            user-select: none;
        }

        .swiper-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
            z-index: 2;
            transition-property: transform;
            box-sizing: content-box;
            overflow: hidden;
            display:flex;
        }

        .swiper-slide {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            position: relative;
            font-size:100px;
            transition-duration:0.2s;
            overflow: hidden;
          }
    `

    constructor() {
        super()
    }

    connectedCallback() {
        if(!document.getElementById("swiper-style"))
            document.head.innerHTML += `<style id="swiper-style">${this.styleCss}</style>`

        setTimeout(() => {
            this.init()
        }, 1)

        this.classList.add('swiper')

        let startX = undefined
        this.ontouchstart = (ev) => {
            startX = ev.touches[0].pageX
        }

        this.ontouchend = (ev) => {
            let endX = ev.changedTouches[0].pageX
            if(startX + 200 < endX) this.swipeLeft()
            if(startX - 200 > endX) this.swipeRight()
            startX = undefined
        }

        if(this.hasAttribute('currPage'))
            this.attributes.currPage = this.getAttribute('currPage')

        this.swipe()
    }

    disconnectedCallback() {
        document.getElementById("swiper-style")?.remove()
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(newValue == undefined)
            return this.setAttribute(name, oldValue)
        
        this.attributes[name] = newValue

        this.swipe()
    }

    static get observedAttributes() {
        return [
            "currPage"
        ];
    }

    init() {
        var wrapper = this.getElementsByClassName('swiper-wrapper')?.item(0)
        if(wrapper) {
            this.numberPages = wrapper.children.length
            this.wrapperWidth = wrapper.offsetWidth
            for(let child of wrapper.children) {
                child.style.minWidth = this.wrapperWidth + 'px'
                child.style.maxWidth = this.wrapperWidth + 'px'
            }
        }
    }

    /**
     * Events
     */
    onswipeleft() {
       //console.log('onswipeleft')
    }
    onswiperight() {
        //console.log('onswiperight')
    }
    onswipe() {
        //console.log('onswipe')
    }

    swipeLeft() {
        if(this.attributes.currPage == 0) return
        this.attributes.currPage--
        this.onswipeleft()
        this.swipe()
    }

    swipeRight() {
        if(this.attributes.currPage == this.numberPages - 1) return
        this.attributes.currPage++
        this.onswiperight()
        this.swipe()
    }

    swipe() {
        var wrapper = this.getElementsByClassName('swiper-wrapper')?.item(0)
        if(wrapper) {
            var translate = - (this.attributes.currPage * 100)
            let childs = wrapper.children
            for(let child of childs) {
                child.style.transform = `translateX(${translate}%)`
            }
        }
        this.onswipe()
    }
}

customElements.define('my-swiper', Swiper)