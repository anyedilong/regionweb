(function(window, undefined) {
    var canvas = document.getElementById('canvas')
    var ctx = canvas.getContext('2d')
    var canvasW = window.innerWidth
    var canvasH = window.innerHeight
    var particles = []
    var particles2 = []
    var maxParticles = 400
    var maxParticles2 = 20
    var random = function(min, max) {
        return Math.random() * (max - min) + min
    }
    window.requestAnimationFrame = (function() {
        var FPS = 60
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callBack) {
                window.setTimeout(callBack, 1000 / FPS)
            }
    })()
    var Particle = function() {
        this.x = Math.random() * canvasW
        this.y = Math.random() * canvasH
        this.r = random(0, 1)
        this.alpha = random(0.3, 1)
        this.velocity = {
            x: random(-0.35, 0.35),
            y: random(0.75, 1.5)
        }
        this.draw = function() {
            ctx.fillStyle = 'rgba(255, 255, 255, ' + this.alpha + ')'
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
            ctx.shadowBlur = 20;
            ctx.shadowColor = "rgba(255, 255, 255,0.5)";
            ctx.closePath()
            ctx.fill()
        }
        this.moving = function() {
            this.x -= this.velocity.x
            this.y -= this.velocity.y
            if(this.y < 0) {
                this.x = Math.random() * canvasW
                this.y = canvasH
            }
            this.draw()
        }
    }
    var Particle2 = function() {
        this.x = Math.random() * canvasW
        this.y = Math.random() * canvasH
        this.r = random(1, 5)
        this.alpha = random(0.3, 1)
        this.velocity = {
            x: random(-0.35, 0.35),
            y: random(0.75, 1.5)
        }
        this.draw = function() {
            ctx.fillStyle = 'rgba(255, 255, 255, ' + this.alpha + ')'
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
            ctx.shadowBlur = 20;
            ctx.shadowColor = "rgba(255, 255, 255,0.5)";
            ctx.closePath()
            ctx.fill()
        }
        this.moving = function() {
            this.x -= this.velocity.x
            this.y -= this.velocity.y
            if(this.y < 0) {
                this.x = Math.random() * canvasW
                this.y = canvasH
            }
            this.draw()
        }
    }
    init()
    function init() {
        canvas.width = canvasW
        canvas.height = canvasH
        for(var i = 0; i < maxParticles; i++) {
            particles.push(new Particle())
        }
        for(var i = 0; i < maxParticles2; i++) {
            particles2.push(new Particle2())
        }
        animate()
    }
    function animate() {
        ctx.clearRect(0, 0, canvasW, canvasH)
        particles.forEach(function(particle) {
            particle.moving()
        })
        particles2.forEach(function(particle) {
            particle.moving()
        })
        requestAnimationFrame(animate)
    }
})(window)