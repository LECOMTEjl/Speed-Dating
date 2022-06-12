class HeartBackground extends HTMLElement {

    attributes = {
        numberHearts : 10,
        minFalling : 3,
        maxFalling : 10,
        minDelay : 3,
        maxDelay : 15,
        minRotating : 2,
        maxRotating : 5
    }

    styleCss = `
        .hb-heartcontainer {
            position: absolute;
            top:0;
            bottom: 0;
            left: 0;
            right: 0;
            pointer-events: none;
            overflow: hidden
        }

        .hb-heartfall {
            position: absolute;
            top: -270px;
            animation-duration: 10s;
            animation-name: hb-heartfall;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
        }

        .hb-heartrotate {
            animation-duration: 3s;
            animation-name: hb-heartrotate;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            /*animation-direction: normal;
            animation-direction: reverse;*/
        }

        .hb-heartbeat {
            width: 200px;
            height: 200px;
            font-size: 200px !important;
            color: #ff009d;
            animation-duration: 1s;
            animation-name: hb-heartbeat;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            text-shadow: 0px 0px 50px #ff009d;
        }

        @keyframes hb-heartfall {
            0% {
                top: -270px;
            }
        
            100% {
                top: 100%;
            }
        }

        @keyframes hb-heartrotate
        {
          0%
          {
            transform: rotate(0deg);
            transform-origin: center;
          }
      
          100%
          {
            transform: rotate(360deg);
            transform-origin: center;
          }
        }

        @keyframes hb-heartbeat
        {
          0%
          {
            transform: scale( .75 );
            text-shadow: 0px 0px 50px #ff009d;
          }
          10%
          {
            transform: scale( 1 );
            text-shadow: 0px 0px 100px #ff009d;
          }
          20%
          {
            transform: scale( .75 );
            text-shadow: 0px 0px 50px #ff009d;
          }
          30%
          {
            transform: scale( 1 );
            text-shadow: 0px 0px 100px #ff009d;
          }
          40%
          {
            transform: scale( .75 );
            text-shadow: 0px 0px 50px #ff009d;
          }
          50%
          {
            transform: scale( .75 );
            text-shadow: 0px 0px 50px #ff009d;
          }
      
          100%
          {
            transform: scale( .75 );
            text-shadow: 0px 0px 50px #ff009d;
          }
        }
    `

    constructor() {
        super()
    }

    connectedCallback() {
        if(!document.getElementById("hb-font-awesome-style"))
            document.head.innerHTML += `<link id="hb-font-awesome-style" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>`
        if(!document.getElementById("heart-background-style"))
            document.head.innerHTML += `<style id="heart-background-style">${this.styleCss}</style>`

        if(this.hasAttribute('numberHearts'))
            this.attributes.numberHearts = this.getAttribute('numberHearts')
        
        if(this.hasAttribute('minFalling'))
            this.attributes.minFalling = this.getAttribute('minFalling')

        if(this.hasAttribute('maxFalling'))
            this.attributes.maxFalling =this.getAttribute('maxFalling')
        
        if(this.hasAttribute('minDelay'))
            this.attributes.minDelay = this.getAttribute('minDelay')

        if(this.hasAttribute('maxDelay'))
            this.attributes.maxDelay = this.getAttribute('maxDelay')

        if(this.hasAttribute('minRotating'))
            this.attributes.minRotating = this.getAttribute('minRotating')
        
        if(this.hasAttribute('maxRotating'))
            this.attributes.maxRotating = this.getAttribute('maxRotating')

        this.generateHearts()
    }

    disconnectedCallback() {
        document.getElementById("hb-font-awesome-style")?.remove()
        document.getElementById("heart-background-style")?.remove()
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(newValue == undefined)
            return this.setAttribute(name, oldValue)
        
        this.attributes[name] =  newValue
    }

    static get observedAttributes() {
        return [
            "numberHearts",
            "minFalling",
            "maxFalling",
            "minDelay",
            "maxDelay",
            "minRotating",
            "maxRotating"
        ];
    }

    async generateHearts() {
        this.classList.add('hb-heartcontainer')
        for(let i = 0; i != this.attributes.numberHearts; i++) {
            this.innerHTML += `
                <div class="hb-heart_${i}"></div>
            `
            this.generate(i)
        }
    }
    
    async generate(i, addDelay = true) {
        let fallingSpeed = this.random(this.attributes.minFalling, this.attributes.maxFalling)
        let delay = addDelay ? this.random(this.attributes.minDelay, this.attributes.maxDelay) : 0
        let rotateSense = Math.random() < 0.5 ? 'reverse' : 'normal'
        let rotateSpeed = this.random(this.attributes.minRotating, this.attributes.maxRotating)
        let left = this.random(undefined, document.body.offsetWidth - 200)
    
        let container = this.getElementsByClassName('hb-heart_'+i)?.item(0)
        container.innerHTML = `
            <div style="left:${left}px; animation-delay:${delay}s; animation-duration:${fallingSpeed}s" class="hb-heartfall">
                <div style="animation-direction: ${rotateSense}; animation-delay:${delay}s; animation-duration:${rotateSpeed}s" class="hb-heartrotate">
                    <i style="animation-delay:${delay}s" class="fa fa-heart hb-heartbeat"></i>
                </div>
            </div>
        `
    
        this.setTimer(i, (delay + fallingSpeed))
    }
    
    setTimer(i, timeout) {
        setTimeout(() => {
            if(i < this.attributes.numberHearts)
                this.generate(i, false)
            else {
                let length = this.children.length
                if(i >= length)
                    this.getElementsByClassName('hb-heart_'+i)?.item(0)?.remove()
                else {
                    for(let i = 0; i != this.attributes.numberHearts; i++) {
                        if(this.getElementsByClassName('hb-heart_'+i)) return
                        this.innerHTML += `
                            <div class="hb-heart_${i}"></div>
                        `
                        this.generate(i)
                    }
                }
            }
        }, timeout * 1000)
    }
    
    random(min = 0, max) {
        let random = Math.floor((Math.random() * max) + 1)
        while(random < min)
            random = Math.floor((Math.random() * max) + 1)
        return random
    }
}

customElements.define('heart-background', HeartBackground)