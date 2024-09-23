function mc(n, e, t) {
    return Math.max(n, Math.min(e, t))
}
class Bh {
    constructor() {
        this.isRunning = !1,
        this.value = 0,
        this.from = 0,
        this.to = 0,
        this.currentTime = 0
    }
    advance(e) {
        var t;
        if (!this.isRunning)
            return;
        let i = !1;
        if (this.duration && this.easing) {
            this.currentTime += e;
            const r = mc(0, this.currentTime / this.duration, 1);
            i = r >= 1;
            const s = i ? 1 : this.easing(r);
            this.value = this.from + (this.to - this.from) * s
        } else
            this.lerp ? (this.value = function(s, o, a, l) {
                return function(u, p, d) {
                    return (1 - d) * u + d * p
                }(s, o, 1 - Math.exp(-a * l))
            }(this.value, this.to, 60 * this.lerp, e),
            Math.round(this.value) === this.to && (this.value = this.to,
            i = !0)) : (this.value = this.to,
            i = !0);
        i && this.stop(),
        (t = this.onUpdate) === null || t === void 0 || t.call(this, this.value, i)
    }
    stop() {
        this.isRunning = !1
    }
    fromTo(e, t, {lerp: i, duration: r, easing: s, onStart: o, onUpdate: a}) {
        this.from = this.value = e,
        this.to = t,
        this.lerp = i,
        this.duration = r,
        this.easing = s,
        this.currentTime = 0,
        this.isRunning = !0,
        o?.(),
        this.onUpdate = a
    }
}
class Hh {
    constructor(e, t, {autoResize: i=!0, debounce: r=250}={}) {
        this.wrapper = e,
        this.content = t,
        this.width = 0,
        this.height = 0,
        this.scrollHeight = 0,
        this.scrollWidth = 0,
        this.resize = () => {
            this.onWrapperResize(),
            this.onContentResize()
        }
        ,
        this.onWrapperResize = () => {
            this.wrapper instanceof Window ? (this.width = window.innerWidth,
            this.height = window.innerHeight) : (this.width = this.wrapper.clientWidth,
            this.height = this.wrapper.clientHeight)
        }
        ,
        this.onContentResize = () => {
            this.wrapper instanceof Window ? (this.scrollHeight = this.content.scrollHeight,
            this.scrollWidth = this.content.scrollWidth) : (this.scrollHeight = this.wrapper.scrollHeight,
            this.scrollWidth = this.wrapper.scrollWidth)
        }
        ,
        i && (this.debouncedResize = function(o, a) {
            let l;
            return function(...c) {
                let u = this;
                clearTimeout(l),
                l = setTimeout( () => {
                    l = void 0,
                    o.apply(u, c)
                }
                , a)
            }
        }(this.resize, r),
        this.wrapper instanceof Window ? window.addEventListener("resize", this.debouncedResize, !1) : (this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize),
        this.wrapperResizeObserver.observe(this.wrapper)),
        this.contentResizeObserver = new ResizeObserver(this.debouncedResize),
        this.contentResizeObserver.observe(this.content)),
        this.resize()
    }
    destroy() {
        var e, t;
        (e = this.wrapperResizeObserver) === null || e === void 0 || e.disconnect(),
        (t = this.contentResizeObserver) === null || t === void 0 || t.disconnect(),
        this.wrapper === window && this.debouncedResize && window.removeEventListener("resize", this.debouncedResize, !1)
    }
    get limit() {
        return {
            x: this.scrollWidth - this.width,
            y: this.scrollHeight - this.height
        }
    }
}
class gc {
    constructor() {
        this.events = {}
    }
    emit(e, ...t) {
        var i;
        let r = this.events[e] || [];
        for (let s = 0, o = r.length; s < o; s++)
            (i = r[s]) === null || i === void 0 || i.call(r, ...t)
    }
    on(e, t) {
        var i;
        return !((i = this.events[e]) === null || i === void 0) && i.push(t) || (this.events[e] = [t]),
        () => {
            var r;
            this.events[e] = (r = this.events[e]) === null || r === void 0 ? void 0 : r.filter(s => t !== s)
        }
    }
    off(e, t) {
        var i;
        this.events[e] = (i = this.events[e]) === null || i === void 0 ? void 0 : i.filter(r => t !== r)
    }
    destroy() {
        this.events = {}
    }
}
const pl = 100 / 6
  , Hi = {
    passive: !1
};
class jh {
    constructor(e, t={
        wheelMultiplier: 1,
        touchMultiplier: 1
    }) {
        this.element = e,
        this.options = t,
        this.touchStart = {
            x: 0,
            y: 0
        },
        this.lastDelta = {
            x: 0,
            y: 0
        },
        this.window = {
            width: 0,
            height: 0
        },
        this.emitter = new gc,
        this.onTouchStart = i => {
            const {clientX: r, clientY: s} = i.targetTouches ? i.targetTouches[0] : i;
            this.touchStart.x = r,
            this.touchStart.y = s,
            this.lastDelta = {
                x: 0,
                y: 0
            },
            this.emitter.emit("scroll", {
                deltaX: 0,
                deltaY: 0,
                event: i
            })
        }
        ,
        this.onTouchMove = i => {
            const {clientX: r, clientY: s} = i.targetTouches ? i.targetTouches[0] : i
              , o = -(r - this.touchStart.x) * this.options.touchMultiplier
              , a = -(s - this.touchStart.y) * this.options.touchMultiplier;
            this.touchStart.x = r,
            this.touchStart.y = s,
            this.lastDelta = {
                x: o,
                y: a
            },
            this.emitter.emit("scroll", {
                deltaX: o,
                deltaY: a,
                event: i
            })
        }
        ,
        this.onTouchEnd = i => {
            this.emitter.emit("scroll", {
                deltaX: this.lastDelta.x,
                deltaY: this.lastDelta.y,
                event: i
            })
        }
        ,
        this.onWheel = i => {
            let {deltaX: r, deltaY: s, deltaMode: o} = i;
            r *= o === 1 ? pl : o === 2 ? this.window.width : 1,
            s *= o === 1 ? pl : o === 2 ? this.window.height : 1,
            r *= this.options.wheelMultiplier,
            s *= this.options.wheelMultiplier,
            this.emitter.emit("scroll", {
                deltaX: r,
                deltaY: s,
                event: i
            })
        }
        ,
        this.onWindowResize = () => {
            this.window = {
                width: window.innerWidth,
                height: window.innerHeight
            }
        }
        ,
        window.addEventListener("resize", this.onWindowResize, !1),
        this.onWindowResize(),
        this.element.addEventListener("wheel", this.onWheel, Hi),
        this.element.addEventListener("touchstart", this.onTouchStart, Hi),
        this.element.addEventListener("touchmove", this.onTouchMove, Hi),
        this.element.addEventListener("touchend", this.onTouchEnd, Hi)
    }
    on(e, t) {
        return this.emitter.on(e, t)
    }
    destroy() {
        this.emitter.destroy(),
        window.removeEventListener("resize", this.onWindowResize, !1),
        this.element.removeEventListener("wheel", this.onWheel, Hi),
        this.element.removeEventListener("touchstart", this.onTouchStart, Hi),
        this.element.removeEventListener("touchmove", this.onTouchMove, Hi),
        this.element.removeEventListener("touchend", this.onTouchEnd, Hi)
    }
}
class Uh {
    constructor({wrapper: e=window, content: t=document.documentElement, eventsTarget: i=e, smoothWheel: r=!0, syncTouch: s=!1, syncTouchLerp: o=.075, touchInertiaMultiplier: a=35, duration: l, easing: c=y => Math.min(1, 1.001 - Math.pow(2, -10 * y)), lerp: u=.1, infinite: p=!1, orientation: d="vertical", gestureOrientation: h="vertical", touchMultiplier: m=1, wheelMultiplier: f=1, autoResize: w=!0, prevent: _, virtualScroll: v, __experimental__naiveDimensions: b=!1}={}) {
        this._isScrolling = !1,
        this._isStopped = !1,
        this._isLocked = !1,
        this._preventNextNativeScrollEvent = !1,
        this._resetVelocityTimeout = null,
        this.time = 0,
        this.userData = {},
        this.lastVelocity = 0,
        this.velocity = 0,
        this.direction = 0,
        this.animate = new Bh,
        this.emitter = new gc,
        this.onPointerDown = y => {
            y.button === 1 && this.reset()
        }
        ,
        this.onVirtualScroll = y => {
            if (typeof this.options.virtualScroll == "function" && this.options.virtualScroll(y) === !1)
                return;
            const {deltaX: x, deltaY: k, event: T} = y;
            if (this.emitter.emit("virtual-scroll", {
                deltaX: x,
                deltaY: k,
                event: T
            }),
            T.ctrlKey)
                return;
            const M = T.type.includes("touch")
              , E = T.type.includes("wheel");
            if (this.isTouching = T.type === "touchstart" || T.type === "touchmove",
            this.options.syncTouch && M && T.type === "touchstart" && !this.isStopped && !this.isLocked)
                return void this.reset();
            const C = x === 0 && k === 0
              , N = this.options.gestureOrientation === "vertical" && k === 0 || this.options.gestureOrientation === "horizontal" && x === 0;
            if (C || N)
                return;
            let A = T.composedPath();
            A = A.slice(0, A.indexOf(this.rootElement));
            const $ = this.options.prevent;
            if (A.find(z => {
                var Q, V, S, ce, $e;
                return z instanceof HTMLElement && (typeof $ == "function" && $?.(z) || ((Q = z.hasAttribute) === null || Q === void 0 ? void 0 : Q.call(z, "data-lenis-prevent")) || M && ((V = z.hasAttribute) === null || V === void 0 ? void 0 : V.call(z, "data-lenis-prevent-touch")) || E && ((S = z.hasAttribute) === null || S === void 0 ? void 0 : S.call(z, "data-lenis-prevent-wheel")) || ((ce = z.classList) === null || ce === void 0 ? void 0 : ce.contains("lenis")) && !(!(($e = z.classList) === null || $e === void 0) && $e.contains("lenis-stopped")))
            }
            ))
                return;
            if (this.isStopped || this.isLocked)
                return void T.preventDefault();
            if (!(this.options.syncTouch && M || this.options.smoothWheel && E))
                return this.isScrolling = "native",
                void this.animate.stop();
            T.preventDefault();
            let L = k;
            this.options.gestureOrientation === "both" ? L = Math.abs(k) > Math.abs(x) ? k : x : this.options.gestureOrientation === "horizontal" && (L = x);
            const B = M && this.options.syncTouch
              , W = M && T.type === "touchend" && Math.abs(L) > 5;
            W && (L = this.velocity * this.options.touchInertiaMultiplier),
            this.scrollTo(this.targetScroll + L, Object.assign({
                programmatic: !1
            }, B ? {
                lerp: W ? this.options.syncTouchLerp : 1
            } : {
                lerp: this.options.lerp,
                duration: this.options.duration,
                easing: this.options.easing
            }))
        }
        ,
        this.onNativeScroll = () => {
            if (this._resetVelocityTimeout !== null && (clearTimeout(this._resetVelocityTimeout),
            this._resetVelocityTimeout = null),
            this._preventNextNativeScrollEvent)
                this._preventNextNativeScrollEvent = !1;
            else if (this.isScrolling === !1 || this.isScrolling === "native") {
                const y = this.animatedScroll;
                this.animatedScroll = this.targetScroll = this.actualScroll,
                this.lastVelocity = this.velocity,
                this.velocity = this.animatedScroll - y,
                this.direction = Math.sign(this.animatedScroll - y),
                this.isScrolling = "native",
                this.emit(),
                this.velocity !== 0 && (this._resetVelocityTimeout = setTimeout( () => {
                    this.lastVelocity = this.velocity,
                    this.velocity = 0,
                    this.isScrolling = !1,
                    this.emit()
                }
                , 400))
            }
        }
        ,
        window.lenisVersion = "1.1.13",
        e && e !== document.documentElement && e !== document.body || (e = window),
        this.options = {
            wrapper: e,
            content: t,
            eventsTarget: i,
            smoothWheel: r,
            syncTouch: s,
            syncTouchLerp: o,
            touchInertiaMultiplier: a,
            duration: l,
            easing: c,
            lerp: u,
            infinite: p,
            gestureOrientation: h,
            orientation: d,
            touchMultiplier: m,
            wheelMultiplier: f,
            autoResize: w,
            prevent: _,
            virtualScroll: v,
            __experimental__naiveDimensions: b
        },
        this.dimensions = new Hh(e,t,{
            autoResize: w
        }),
        this.updateClassName(),
        this.targetScroll = this.animatedScroll = this.actualScroll,
        this.options.wrapper.addEventListener("scroll", this.onNativeScroll, !1),
        this.options.wrapper.addEventListener("pointerdown", this.onPointerDown, !1),
        this.virtualScroll = new jh(i,{
            touchMultiplier: m,
            wheelMultiplier: f
        }),
        this.virtualScroll.on("scroll", this.onVirtualScroll)
    }
    destroy() {
        this.emitter.destroy(),
        this.options.wrapper.removeEventListener("scroll", this.onNativeScroll, !1),
        this.options.wrapper.removeEventListener("pointerdown", this.onPointerDown, !1),
        this.virtualScroll.destroy(),
        this.dimensions.destroy(),
        this.cleanUpClassName()
    }
    on(e, t) {
        return this.emitter.on(e, t)
    }
    off(e, t) {
        return this.emitter.off(e, t)
    }
    setScroll(e) {
        this.isHorizontal ? this.rootElement.scrollLeft = e : this.rootElement.scrollTop = e
    }
    resize() {
        this.dimensions.resize(),
        this.animatedScroll = this.targetScroll = this.actualScroll,
        this.emit()
    }
    emit() {
        this.emitter.emit("scroll", this)
    }
    reset() {
        this.isLocked = !1,
        this.isScrolling = !1,
        this.animatedScroll = this.targetScroll = this.actualScroll,
        this.lastVelocity = this.velocity = 0,
        this.animate.stop()
    }
    start() {
        this.isStopped && (this.isStopped = !1,
        this.reset())
    }
    stop() {
        this.isStopped || (this.isStopped = !0,
        this.animate.stop(),
        this.reset())
    }
    raf(e) {
        const t = e - (this.time || e);
        this.time = e,
        this.animate.advance(.001 * t)
    }
    scrollTo(e, {offset: t=0, immediate: i=!1, lock: r=!1, duration: s=this.options.duration, easing: o=this.options.easing, lerp: a=this.options.lerp, onStart: l, onComplete: c, force: u=!1, programmatic: p=!0, userData: d}={}) {
        if (!this.isStopped && !this.isLocked || u) {
            if (typeof e == "string" && ["top", "left", "start"].includes(e))
                e = 0;
            else if (typeof e == "string" && ["bottom", "right", "end"].includes(e))
                e = this.limit;
            else {
                let h;
                if (typeof e == "string" ? h = document.querySelector(e) : e instanceof HTMLElement && e?.nodeType && (h = e),
                h) {
                    if (this.options.wrapper !== window) {
                        const f = this.rootElement.getBoundingClientRect();
                        t -= this.isHorizontal ? f.left : f.top
                    }
                    const m = h.getBoundingClientRect();
                    e = (this.isHorizontal ? m.left : m.top) + this.animatedScroll
                }
            }
            if (typeof e == "number") {
                if (e += t,
                e = Math.round(e),
                this.options.infinite ? p && (this.targetScroll = this.animatedScroll = this.scroll) : e = mc(0, e, this.limit),
                e === this.targetScroll)
                    return l?.(this),
                    void (c == null || c(this));
                if (this.userData = d ?? {},
                i)
                    return this.animatedScroll = this.targetScroll = e,
                    this.setScroll(this.scroll),
                    this.reset(),
                    this.preventNextNativeScrollEvent(),
                    this.emit(),
                    c?.(this),
                    void (this.userData = {});
                p || (this.targetScroll = e),
                this.animate.fromTo(this.animatedScroll, e, {
                    duration: s,
                    easing: o,
                    lerp: a,
                    onStart: () => {
                        r && (this.isLocked = !0),
                        this.isScrolling = "smooth",
                        l?.(this)
                    }
                    ,
                    onUpdate: (h, m) => {
                        this.isScrolling = "smooth",
                        this.lastVelocity = this.velocity,
                        this.velocity = h - this.animatedScroll,
                        this.direction = Math.sign(this.velocity),
                        this.animatedScroll = h,
                        this.setScroll(this.scroll),
                        p && (this.targetScroll = h),
                        m || this.emit(),
                        m && (this.reset(),
                        this.emit(),
                        c?.(this),
                        this.userData = {},
                        this.preventNextNativeScrollEvent())
                    }
                })
            }
        }
    }
    preventNextNativeScrollEvent() {
        this._preventNextNativeScrollEvent = !0,
        requestAnimationFrame( () => {
            this._preventNextNativeScrollEvent = !1
        }
        )
    }
    get rootElement() {
        return this.options.wrapper === window ? document.documentElement : this.options.wrapper
    }
    get limit() {
        return this.options.__experimental__naiveDimensions ? this.isHorizontal ? this.rootElement.scrollWidth - this.rootElement.clientWidth : this.rootElement.scrollHeight - this.rootElement.clientHeight : this.dimensions.limit[this.isHorizontal ? "x" : "y"]
    }
    get isHorizontal() {
        return this.options.orientation === "horizontal"
    }
    get actualScroll() {
        return this.isHorizontal ? this.rootElement.scrollLeft : this.rootElement.scrollTop
    }
    get scroll() {
        return this.options.infinite ? function(t, i) {
            return (t % i + i) % i
        }(this.animatedScroll, this.limit) : this.animatedScroll
    }
    get progress() {
        return this.limit === 0 ? 1 : this.scroll / this.limit
    }
    get isScrolling() {
        return this._isScrolling
    }
    set isScrolling(e) {
        this._isScrolling !== e && (this._isScrolling = e,
        this.updateClassName())
    }
    get isStopped() {
        return this._isStopped
    }
    set isStopped(e) {
        this._isStopped !== e && (this._isStopped = e,
        this.updateClassName())
    }
    get isLocked() {
        return this._isLocked
    }
    set isLocked(e) {
        this._isLocked !== e && (this._isLocked = e,
        this.updateClassName())
    }
    get isSmooth() {
        return this.isScrolling === "smooth"
    }
    get className() {
        let e = "lenis";
        return this.isStopped && (e += " lenis-stopped"),
        this.isLocked && (e += " lenis-locked"),
        this.isScrolling && (e += " lenis-scrolling"),
        this.isScrolling === "smooth" && (e += " lenis-smooth"),
        e
    }
    updateClassName() {
        this.cleanUpClassName(),
        this.rootElement.className = `${this.rootElement.className} ${this.className}`.trim()
    }
    cleanUpClassName() {
        this.rootElement.className = this.rootElement.className.replace(/lenis(-\w+)?/g, "").trim()
    }
}
function Ci(n) {
    if (n === void 0)
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return n
}
function yc(n, e) {
    n.prototype = Object.create(e.prototype),
    n.prototype.constructor = n,
    n.__proto__ = e
}
/*!
 * GSAP 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
var zt = {
    autoSleep: 120,
    force3D: "auto",
    nullTargetWarn: 1,
    units: {
        lineHeight: ""
    }
}, cr = {
    duration: .5,
    overwrite: !1,
    delay: 0
}, Da, ct, ye, Wt = 1e8, fe = 1 / Wt, jo = Math.PI * 2, Vh = jo / 4, Wh = 0, vc = Math.sqrt, Yh = Math.cos, Xh = Math.sin, Ge = function(e) {
    return typeof e == "string"
}, Se = function(e) {
    return typeof e == "function"
}, Li = function(e) {
    return typeof e == "number"
}, Ra = function(e) {
    return typeof e > "u"
}, xi = function(e) {
    return typeof e == "object"
}, kt = function(e) {
    return e !== !1
}, Na = function() {
    return typeof window < "u"
}, vs = function(e) {
    return Se(e) || Ge(e)
}, bc = typeof ArrayBuffer == "function" && ArrayBuffer.isView || function() {}
, ut = Array.isArray, Uo = /(?:-?\.?\d|\.)+/gi, _c = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g, Jn = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g, _o = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi, wc = /[+-]=-?[.\d]+/, xc = /[^,'"\[\]\s]+/gi, Gh = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i, _e, hi, Vo, Ia, qt = {}, Vs = {}, Tc, Sc = function(e) {
    return (Vs = Dn(e, qt)) && At
}, $a = function(e, t) {
    return console.warn("Invalid property", e, "set to", t, "Missing plugin? gsap.registerPlugin()")
}, Gr = function(e, t) {
    return !t && console.warn(e)
}, kc = function(e, t) {
    return e && (qt[e] = t) && Vs && (Vs[e] = t) || qt
}, Kr = function() {
    return 0
}, Kh = {
    suppressEvents: !0,
    isStart: !0,
    kill: !1
}, Ls = {
    suppressEvents: !0,
    kill: !1
}, Qh = {
    suppressEvents: !0
}, Fa = {}, en = [], Wo = {}, Cc, Nt = {}, wo = {}, ml = 30, Ds = [], za = "", qa = function(e) {
    var t = e[0], i, r;
    if (xi(t) || Se(t) || (e = [e]),
    !(i = (t._gsap || {}).harness)) {
        for (r = Ds.length; r-- && !Ds[r].targetTest(t); )
            ;
        i = Ds[r]
    }
    for (r = e.length; r--; )
        e[r] && (e[r]._gsap || (e[r]._gsap = new Kc(e[r],i))) || e.splice(r, 1);
    return e
}, Cn = function(e) {
    return e._gsap || qa(Yt(e))[0]._gsap
}, Ec = function(e, t, i) {
    return (i = e[t]) && Se(i) ? e[t]() : Ra(i) && e.getAttribute && e.getAttribute(t) || i
}, Ct = function(e, t) {
    return (e = e.split(",")).forEach(t) || e
}, Me = function(e) {
    return Math.round(e * 1e5) / 1e5 || 0
}, Xe = function(e) {
    return Math.round(e * 1e7) / 1e7 || 0
}, ir = function(e, t) {
    var i = t.charAt(0)
      , r = parseFloat(t.substr(2));
    return e = parseFloat(e),
    i === "+" ? e + r : i === "-" ? e - r : i === "*" ? e * r : e / r
}, Jh = function(e, t) {
    for (var i = t.length, r = 0; e.indexOf(t[r]) < 0 && ++r < i; )
        ;
    return r < i
}, Ws = function() {
    var e = en.length, t = en.slice(0), i, r;
    for (Wo = {},
    en.length = 0,
    i = 0; i < e; i++)
        r = t[i],
        r && r._lazy && (r.render(r._lazy[0], r._lazy[1], !0)._lazy = 0)
}, Pc = function(e, t, i, r) {
    en.length && !ct && Ws(),
    e.render(t, i, ct && t < 0 && (e._initted || e._startAt)),
    en.length && !ct && Ws()
}, Ac = function(e) {
    var t = parseFloat(e);
    return (t || t === 0) && (e + "").match(xc).length < 2 ? t : Ge(e) ? e.trim() : e
}, Mc = function(e) {
    return e
}, Gt = function(e, t) {
    for (var i in t)
        i in e || (e[i] = t[i]);
    return e
}, Zh = function(e) {
    return function(t, i) {
        for (var r in i)
            r in t || r === "duration" && e || r === "ease" || (t[r] = i[r])
    }
}, Dn = function(e, t) {
    for (var i in t)
        e[i] = t[i];
    return e
}, gl = function n(e, t) {
    for (var i in t)
        i !== "__proto__" && i !== "constructor" && i !== "prototype" && (e[i] = xi(t[i]) ? n(e[i] || (e[i] = {}), t[i]) : t[i]);
    return e
}, Ys = function(e, t) {
    var i = {}, r;
    for (r in e)
        r in t || (i[r] = e[r]);
    return i
}, Nr = function(e) {
    var t = e.parent || _e
      , i = e.keyframes ? Zh(ut(e.keyframes)) : Gt;
    if (kt(e.inherit))
        for (; t; )
            i(e, t.vars.defaults),
            t = t.parent || t._dp;
    return e
}, ed = function(e, t) {
    for (var i = e.length, r = i === t.length; r && i-- && e[i] === t[i]; )
        ;
    return i < 0
}, Oc = function(e, t, i, r, s) {
    var o = e[r], a;
    if (s)
        for (a = t[s]; o && o[s] > a; )
            o = o._prev;
    return o ? (t._next = o._next,
    o._next = t) : (t._next = e[i],
    e[i] = t),
    t._next ? t._next._prev = t : e[r] = t,
    t._prev = o,
    t.parent = t._dp = e,
    t
}, co = function(e, t, i, r) {
    i === void 0 && (i = "_first"),
    r === void 0 && (r = "_last");
    var s = t._prev
      , o = t._next;
    s ? s._next = o : e[i] === t && (e[i] = o),
    o ? o._prev = s : e[r] === t && (e[r] = s),
    t._next = t._prev = t.parent = null
}, rn = function(e, t) {
    e.parent && (!t || e.parent.autoRemoveChildren) && e.parent.remove && e.parent.remove(e),
    e._act = 0
}, En = function(e, t) {
    if (e && (!t || t._end > e._dur || t._start < 0))
        for (var i = e; i; )
            i._dirty = 1,
            i = i.parent;
    return e
}, td = function(e) {
    for (var t = e.parent; t && t.parent; )
        t._dirty = 1,
        t.totalDuration(),
        t = t.parent;
    return e
}, Yo = function(e, t, i, r) {
    return e._startAt && (ct ? e._startAt.revert(Ls) : e.vars.immediateRender && !e.vars.autoRevert || e._startAt.render(t, !0, r))
}, id = function n(e) {
    return !e || e._ts && n(e.parent)
}, yl = function(e) {
    return e._repeat ? ur(e._tTime, e = e.duration() + e._rDelay) * e : 0
}, ur = function(e, t) {
    var i = Math.floor(e /= t);
    return e && i === e ? i - 1 : i
}, Xs = function(e, t) {
    return (e - t._start) * t._ts + (t._ts >= 0 ? 0 : t._dirty ? t.totalDuration() : t._tDur)
}, uo = function(e) {
    return e._end = Xe(e._start + (e._tDur / Math.abs(e._ts || e._rts || fe) || 0))
}, ho = function(e, t) {
    var i = e._dp;
    return i && i.smoothChildTiming && e._ts && (e._start = Xe(i._time - (e._ts > 0 ? t / e._ts : ((e._dirty ? e.totalDuration() : e._tDur) - t) / -e._ts)),
    uo(e),
    i._dirty || En(i, e)),
    e
}, Lc = function(e, t) {
    var i;
    if ((t._time || !t._dur && t._initted || t._start < e._time && (t._dur || !t.add)) && (i = Xs(e.rawTime(), t),
    (!t._dur || us(0, t.totalDuration(), i) - t._tTime > fe) && t.render(i, !0)),
    En(e, t)._dp && e._initted && e._time >= e._dur && e._ts) {
        if (e._dur < e.duration())
            for (i = e; i._dp; )
                i.rawTime() >= 0 && i.totalTime(i._tTime),
                i = i._dp;
        e._zTime = -fe
    }
}, fi = function(e, t, i, r) {
    return t.parent && rn(t),
    t._start = Xe((Li(i) ? i : i || e !== _e ? jt(e, i, t) : e._time) + t._delay),
    t._end = Xe(t._start + (t.totalDuration() / Math.abs(t.timeScale()) || 0)),
    Oc(e, t, "_first", "_last", e._sort ? "_start" : 0),
    Xo(t) || (e._recent = t),
    r || Lc(e, t),
    e._ts < 0 && ho(e, e._tTime),
    e
}, Dc = function(e, t) {
    return (qt.ScrollTrigger || $a("scrollTrigger", t)) && qt.ScrollTrigger.create(t, e)
}, Rc = function(e, t, i, r, s) {
    if (Ha(e, t, s),
    !e._initted)
        return 1;
    if (!i && e._pt && !ct && (e._dur && e.vars.lazy !== !1 || !e._dur && e.vars.lazy) && Cc !== It.frame)
        return en.push(e),
        e._lazy = [s, r],
        1
}, nd = function n(e) {
    var t = e.parent;
    return t && t._ts && t._initted && !t._lock && (t.rawTime() < 0 || n(t))
}, Xo = function(e) {
    var t = e.data;
    return t === "isFromStart" || t === "isStart"
}, rd = function(e, t, i, r) {
    var s = e.ratio, o = t < 0 || !t && (!e._start && nd(e) && !(!e._initted && Xo(e)) || (e._ts < 0 || e._dp._ts < 0) && !Xo(e)) ? 0 : 1, a = e._rDelay, l = 0, c, u, p;
    if (a && e._repeat && (l = us(0, e._tDur, t),
    u = ur(l, a),
    e._yoyo && u & 1 && (o = 1 - o),
    u !== ur(e._tTime, a) && (s = 1 - o,
    e.vars.repeatRefresh && e._initted && e.invalidate())),
    o !== s || ct || r || e._zTime === fe || !t && e._zTime) {
        if (!e._initted && Rc(e, t, r, i, l))
            return;
        for (p = e._zTime,
        e._zTime = t || (i ? fe : 0),
        i || (i = t && !p),
        e.ratio = o,
        e._from && (o = 1 - o),
        e._time = 0,
        e._tTime = l,
        c = e._pt; c; )
            c.r(o, c.d),
            c = c._next;
        t < 0 && Yo(e, t, i, !0),
        e._onUpdate && !i && Ft(e, "onUpdate"),
        l && e._repeat && !i && e.parent && Ft(e, "onRepeat"),
        (t >= e._tDur || t < 0) && e.ratio === o && (o && rn(e, 1),
        !i && !ct && (Ft(e, o ? "onComplete" : "onReverseComplete", !0),
        e._prom && e._prom()))
    } else
        e._zTime || (e._zTime = t)
}, sd = function(e, t, i) {
    var r;
    if (i > t)
        for (r = e._first; r && r._start <= i; ) {
            if (r.data === "isPause" && r._start > t)
                return r;
            r = r._next
        }
    else
        for (r = e._last; r && r._start >= i; ) {
            if (r.data === "isPause" && r._start < t)
                return r;
            r = r._prev
        }
}, hr = function(e, t, i, r) {
    var s = e._repeat
      , o = Xe(t) || 0
      , a = e._tTime / e._tDur;
    return a && !r && (e._time *= o / e._dur),
    e._dur = o,
    e._tDur = s ? s < 0 ? 1e10 : Xe(o * (s + 1) + e._rDelay * s) : o,
    a > 0 && !r && ho(e, e._tTime = e._tDur * a),
    e.parent && uo(e),
    i || En(e.parent, e),
    e
}, vl = function(e) {
    return e instanceof _t ? En(e) : hr(e, e._dur)
}, od = {
    _start: 0,
    endTime: Kr,
    totalDuration: Kr
}, jt = function n(e, t, i) {
    var r = e.labels, s = e._recent || od, o = e.duration() >= Wt ? s.endTime(!1) : e._dur, a, l, c;
    return Ge(t) && (isNaN(t) || t in r) ? (l = t.charAt(0),
    c = t.substr(-1) === "%",
    a = t.indexOf("="),
    l === "<" || l === ">" ? (a >= 0 && (t = t.replace(/=/, "")),
    (l === "<" ? s._start : s.endTime(s._repeat >= 0)) + (parseFloat(t.substr(1)) || 0) * (c ? (a < 0 ? s : i).totalDuration() / 100 : 1)) : a < 0 ? (t in r || (r[t] = o),
    r[t]) : (l = parseFloat(t.charAt(a - 1) + t.substr(a + 1)),
    c && i && (l = l / 100 * (ut(i) ? i[0] : i).totalDuration()),
    a > 1 ? n(e, t.substr(0, a - 1), i) + l : o + l)) : t == null ? o : +t
}, Ir = function(e, t, i) {
    var r = Li(t[1]), s = (r ? 2 : 1) + (e < 2 ? 0 : 1), o = t[s], a, l;
    if (r && (o.duration = t[1]),
    o.parent = i,
    e) {
        for (a = o,
        l = i; l && !("immediateRender"in a); )
            a = l.vars.defaults || {},
            l = kt(l.vars.inherit) && l.parent;
        o.immediateRender = kt(a.immediateRender),
        e < 2 ? o.runBackwards = 1 : o.startAt = t[s - 1]
    }
    return new Ie(t[0],o,t[s + 1])
}, an = function(e, t) {
    return e || e === 0 ? t(e) : t
}, us = function(e, t, i) {
    return i < e ? e : i > t ? t : i
}, lt = function(e, t) {
    return !Ge(e) || !(t = Gh.exec(e)) ? "" : t[1]
}, ad = function(e, t, i) {
    return an(i, function(r) {
        return us(e, t, r)
    })
}, Go = [].slice, Nc = function(e, t) {
    return e && xi(e) && "length"in e && (!t && !e.length || e.length - 1 in e && xi(e[0])) && !e.nodeType && e !== hi
}, ld = function(e, t, i) {
    return i === void 0 && (i = []),
    e.forEach(function(r) {
        var s;
        return Ge(r) && !t || Nc(r, 1) ? (s = i).push.apply(s, Yt(r)) : i.push(r)
    }) || i
}, Yt = function(e, t, i) {
    return ye && !t && ye.selector ? ye.selector(e) : Ge(e) && !i && (Vo || !dr()) ? Go.call((t || Ia).querySelectorAll(e), 0) : ut(e) ? ld(e, i) : Nc(e) ? Go.call(e, 0) : e ? [e] : []
}, Ko = function(e) {
    return e = Yt(e)[0] || Gr("Invalid scope") || {},
    function(t) {
        var i = e.current || e.nativeElement || e;
        return Yt(t, i.querySelectorAll ? i : i === e ? Gr("Invalid scope") || Ia.createElement("div") : e)
    }
}, Ic = function(e) {
    return e.sort(function() {
        return .5 - Math.random()
    })
}, $c = function(e) {
    if (Se(e))
        return e;
    var t = xi(e) ? e : {
        each: e
    }
      , i = Pn(t.ease)
      , r = t.from || 0
      , s = parseFloat(t.base) || 0
      , o = {}
      , a = r > 0 && r < 1
      , l = isNaN(r) || a
      , c = t.axis
      , u = r
      , p = r;
    return Ge(r) ? u = p = {
        center: .5,
        edges: .5,
        end: 1
    }[r] || 0 : !a && l && (u = r[0],
    p = r[1]),
    function(d, h, m) {
        var f = (m || t).length, w = o[f], _, v, b, y, x, k, T, M, E;
        if (!w) {
            if (E = t.grid === "auto" ? 0 : (t.grid || [1, Wt])[1],
            !E) {
                for (T = -Wt; T < (T = m[E++].getBoundingClientRect().left) && E < f; )
                    ;
                E < f && E--
            }
            for (w = o[f] = [],
            _ = l ? Math.min(E, f) * u - .5 : r % E,
            v = E === Wt ? 0 : l ? f * p / E - .5 : r / E | 0,
            T = 0,
            M = Wt,
            k = 0; k < f; k++)
                b = k % E - _,
                y = v - (k / E | 0),
                w[k] = x = c ? Math.abs(c === "y" ? y : b) : vc(b * b + y * y),
                x > T && (T = x),
                x < M && (M = x);
            r === "random" && Ic(w),
            w.max = T - M,
            w.min = M,
            w.v = f = (parseFloat(t.amount) || parseFloat(t.each) * (E > f ? f - 1 : c ? c === "y" ? f / E : E : Math.max(E, f / E)) || 0) * (r === "edges" ? -1 : 1),
            w.b = f < 0 ? s - f : s,
            w.u = lt(t.amount || t.each) || 0,
            i = i && f < 0 ? Yc(i) : i
        }
        return f = (w[d] - w.min) / w.max || 0,
        Xe(w.b + (i ? i(f) : f) * w.v) + w.u
    }
}, Qo = function(e) {
    var t = Math.pow(10, ((e + "").split(".")[1] || "").length);
    return function(i) {
        var r = Xe(Math.round(parseFloat(i) / e) * e * t);
        return (r - r % 1) / t + (Li(i) ? 0 : lt(i))
    }
}, Fc = function(e, t) {
    var i = ut(e), r, s;
    return !i && xi(e) && (r = i = e.radius || Wt,
    e.values ? (e = Yt(e.values),
    (s = !Li(e[0])) && (r *= r)) : e = Qo(e.increment)),
    an(t, i ? Se(e) ? function(o) {
        return s = e(o),
        Math.abs(s - o) <= r ? s : o
    }
    : function(o) {
        for (var a = parseFloat(s ? o.x : o), l = parseFloat(s ? o.y : 0), c = Wt, u = 0, p = e.length, d, h; p--; )
            s ? (d = e[p].x - a,
            h = e[p].y - l,
            d = d * d + h * h) : d = Math.abs(e[p] - a),
            d < c && (c = d,
            u = p);
        return u = !r || c <= r ? e[u] : o,
        s || u === o || Li(o) ? u : u + lt(o)
    }
    : Qo(e))
}, zc = function(e, t, i, r) {
    return an(ut(e) ? !t : i === !0 ? !!(i = 0) : !r, function() {
        return ut(e) ? e[~~(Math.random() * e.length)] : (i = i || 1e-5) && (r = i < 1 ? Math.pow(10, (i + "").length - 2) : 1) && Math.floor(Math.round((e - i / 2 + Math.random() * (t - e + i * .99)) / i) * i * r) / r
    })
}, cd = function() {
    for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++)
        t[i] = arguments[i];
    return function(r) {
        return t.reduce(function(s, o) {
            return o(s)
        }, r)
    }
}, ud = function(e, t) {
    return function(i) {
        return e(parseFloat(i)) + (t || lt(i))
    }
}, hd = function(e, t, i) {
    return Bc(e, t, 0, 1, i)
}, qc = function(e, t, i) {
    return an(i, function(r) {
        return e[~~t(r)]
    })
}, dd = function n(e, t, i) {
    var r = t - e;
    return ut(e) ? qc(e, n(0, e.length), t) : an(i, function(s) {
        return (r + (s - e) % r) % r + e
    })
}, fd = function n(e, t, i) {
    var r = t - e
      , s = r * 2;
    return ut(e) ? qc(e, n(0, e.length - 1), t) : an(i, function(o) {
        return o = (s + (o - e) % s) % s || 0,
        e + (o > r ? s - o : o)
    })
}, Qr = function(e) {
    for (var t = 0, i = "", r, s, o, a; ~(r = e.indexOf("random(", t)); )
        o = e.indexOf(")", r),
        a = e.charAt(r + 7) === "[",
        s = e.substr(r + 7, o - r - 7).match(a ? xc : Uo),
        i += e.substr(t, r - t) + zc(a ? s : +s[0], a ? 0 : +s[1], +s[2] || 1e-5),
        t = o + 1;
    return i + e.substr(t, e.length - t)
}, Bc = function(e, t, i, r, s) {
    var o = t - e
      , a = r - i;
    return an(s, function(l) {
        return i + ((l - e) / o * a || 0)
    })
}, pd = function n(e, t, i, r) {
    var s = isNaN(e + t) ? 0 : function(h) {
        return (1 - h) * e + h * t
    }
    ;
    if (!s) {
        var o = Ge(e), a = {}, l, c, u, p, d;
        if (i === !0 && (r = 1) && (i = null),
        o)
            e = {
                p: e
            },
            t = {
                p: t
            };
        else if (ut(e) && !ut(t)) {
            for (u = [],
            p = e.length,
            d = p - 2,
            c = 1; c < p; c++)
                u.push(n(e[c - 1], e[c]));
            p--,
            s = function(m) {
                m *= p;
                var f = Math.min(d, ~~m);
                return u[f](m - f)
            }
            ,
            i = t
        } else
            r || (e = Dn(ut(e) ? [] : {}, e));
        if (!u) {
            for (l in t)
                Ba.call(a, e, l, "get", t[l]);
            s = function(m) {
                return Va(m, a) || (o ? e.p : e)
            }
        }
    }
    return an(i, s)
}, bl = function(e, t, i) {
    var r = e.labels, s = Wt, o, a, l;
    for (o in r)
        a = r[o] - t,
        a < 0 == !!i && a && s > (a = Math.abs(a)) && (l = o,
        s = a);
    return l
}, Ft = function(e, t, i) {
    var r = e.vars, s = r[t], o = ye, a = e._ctx, l, c, u;
    if (s)
        return l = r[t + "Params"],
        c = r.callbackScope || e,
        i && en.length && Ws(),
        a && (ye = a),
        u = l ? s.apply(c, l) : s.call(c),
        ye = o,
        u
}, Pr = function(e) {
    return rn(e),
    e.scrollTrigger && e.scrollTrigger.kill(!!ct),
    e.progress() < 1 && Ft(e, "onInterrupt"),
    e
}, Zn, Hc = [], jc = function(e) {
    if (e)
        if (e = !e.name && e.default || e,
        Na() || e.headless) {
            var t = e.name
              , i = Se(e)
              , r = t && !i && e.init ? function() {
                this._props = []
            }
            : e
              , s = {
                init: Kr,
                render: Va,
                add: Ba,
                kill: Md,
                modifier: Ad,
                rawVars: 0
            }
              , o = {
                targetTest: 0,
                get: 0,
                getSetter: Ua,
                aliases: {},
                register: 0
            };
            if (dr(),
            e !== r) {
                if (Nt[t])
                    return;
                Gt(r, Gt(Ys(e, s), o)),
                Dn(r.prototype, Dn(s, Ys(e, o))),
                Nt[r.prop = t] = r,
                e.targetTest && (Ds.push(r),
                Fa[t] = 1),
                t = (t === "css" ? "CSS" : t.charAt(0).toUpperCase() + t.substr(1)) + "Plugin"
            }
            kc(t, r),
            e.register && e.register(At, r, Et)
        } else
            Hc.push(e)
}, de = 255, Ar = {
    aqua: [0, de, de],
    lime: [0, de, 0],
    silver: [192, 192, 192],
    black: [0, 0, 0],
    maroon: [128, 0, 0],
    teal: [0, 128, 128],
    blue: [0, 0, de],
    navy: [0, 0, 128],
    white: [de, de, de],
    olive: [128, 128, 0],
    yellow: [de, de, 0],
    orange: [de, 165, 0],
    gray: [128, 128, 128],
    purple: [128, 0, 128],
    green: [0, 128, 0],
    red: [de, 0, 0],
    pink: [de, 192, 203],
    cyan: [0, de, de],
    transparent: [de, de, de, 0]
}, xo = function(e, t, i) {
    return e += e < 0 ? 1 : e > 1 ? -1 : 0,
    (e * 6 < 1 ? t + (i - t) * e * 6 : e < .5 ? i : e * 3 < 2 ? t + (i - t) * (2 / 3 - e) * 6 : t) * de + .5 | 0
}, Uc = function(e, t, i) {
    var r = e ? Li(e) ? [e >> 16, e >> 8 & de, e & de] : 0 : Ar.black, s, o, a, l, c, u, p, d, h, m;
    if (!r) {
        if (e.substr(-1) === "," && (e = e.substr(0, e.length - 1)),
        Ar[e])
            r = Ar[e];
        else if (e.charAt(0) === "#") {
            if (e.length < 6 && (s = e.charAt(1),
            o = e.charAt(2),
            a = e.charAt(3),
            e = "#" + s + s + o + o + a + a + (e.length === 5 ? e.charAt(4) + e.charAt(4) : "")),
            e.length === 9)
                return r = parseInt(e.substr(1, 6), 16),
                [r >> 16, r >> 8 & de, r & de, parseInt(e.substr(7), 16) / 255];
            e = parseInt(e.substr(1), 16),
            r = [e >> 16, e >> 8 & de, e & de]
        } else if (e.substr(0, 3) === "hsl") {
            if (r = m = e.match(Uo),
            !t)
                l = +r[0] % 360 / 360,
                c = +r[1] / 100,
                u = +r[2] / 100,
                o = u <= .5 ? u * (c + 1) : u + c - u * c,
                s = u * 2 - o,
                r.length > 3 && (r[3] *= 1),
                r[0] = xo(l + 1 / 3, s, o),
                r[1] = xo(l, s, o),
                r[2] = xo(l - 1 / 3, s, o);
            else if (~e.indexOf("="))
                return r = e.match(_c),
                i && r.length < 4 && (r[3] = 1),
                r
        } else
            r = e.match(Uo) || Ar.transparent;
        r = r.map(Number)
    }
    return t && !m && (s = r[0] / de,
    o = r[1] / de,
    a = r[2] / de,
    p = Math.max(s, o, a),
    d = Math.min(s, o, a),
    u = (p + d) / 2,
    p === d ? l = c = 0 : (h = p - d,
    c = u > .5 ? h / (2 - p - d) : h / (p + d),
    l = p === s ? (o - a) / h + (o < a ? 6 : 0) : p === o ? (a - s) / h + 2 : (s - o) / h + 4,
    l *= 60),
    r[0] = ~~(l + .5),
    r[1] = ~~(c * 100 + .5),
    r[2] = ~~(u * 100 + .5)),
    i && r.length < 4 && (r[3] = 1),
    r
}, Vc = function(e) {
    var t = []
      , i = []
      , r = -1;
    return e.split(tn).forEach(function(s) {
        var o = s.match(Jn) || [];
        t.push.apply(t, o),
        i.push(r += o.length + 1)
    }),
    t.c = i,
    t
}, _l = function(e, t, i) {
    var r = "", s = (e + r).match(tn), o = t ? "hsla(" : "rgba(", a = 0, l, c, u, p;
    if (!s)
        return e;
    if (s = s.map(function(d) {
        return (d = Uc(d, t, 1)) && o + (t ? d[0] + "," + d[1] + "%," + d[2] + "%," + d[3] : d.join(",")) + ")"
    }),
    i && (u = Vc(e),
    l = i.c,
    l.join(r) !== u.c.join(r)))
        for (c = e.replace(tn, "1").split(Jn),
        p = c.length - 1; a < p; a++)
            r += c[a] + (~l.indexOf(a) ? s.shift() || o + "0,0,0,0)" : (u.length ? u : s.length ? s : i).shift());
    if (!c)
        for (c = e.split(tn),
        p = c.length - 1; a < p; a++)
            r += c[a] + s[a];
    return r + c[p]
}, tn = function() {
    var n = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", e;
    for (e in Ar)
        n += "|" + e + "\\b";
    return new RegExp(n + ")","gi")
}(), md = /hsl[a]?\(/, Wc = function(e) {
    var t = e.join(" "), i;
    if (tn.lastIndex = 0,
    tn.test(t))
        return i = md.test(t),
        e[1] = _l(e[1], i),
        e[0] = _l(e[0], i, Vc(e[1])),
        !0
}, Jr, It = function() {
    var n = Date.now, e = 500, t = 33, i = n(), r = i, s = 1e3 / 240, o = s, a = [], l, c, u, p, d, h, m = function f(w) {
        var _ = n() - r, v = w === !0, b, y, x, k;
        if ((_ > e || _ < 0) && (i += _ - t),
        r += _,
        x = r - i,
        b = x - o,
        (b > 0 || v) && (k = ++p.frame,
        d = x - p.time * 1e3,
        p.time = x = x / 1e3,
        o += b + (b >= s ? 4 : s - b),
        y = 1),
        v || (l = c(f)),
        y)
            for (h = 0; h < a.length; h++)
                a[h](x, d, k, w)
    };
    return p = {
        time: 0,
        frame: 0,
        tick: function() {
            m(!0)
        },
        deltaRatio: function(w) {
            return d / (1e3 / (w || 60))
        },
        wake: function() {
            Tc && (!Vo && Na() && (hi = Vo = window,
            Ia = hi.document || {},
            qt.gsap = At,
            (hi.gsapVersions || (hi.gsapVersions = [])).push(At.version),
            Sc(Vs || hi.GreenSockGlobals || !hi.gsap && hi || {}),
            Hc.forEach(jc)),
            u = typeof requestAnimationFrame < "u" && requestAnimationFrame,
            l && p.sleep(),
            c = u || function(w) {
                return setTimeout(w, o - p.time * 1e3 + 1 | 0)
            }
            ,
            Jr = 1,
            m(2))
        },
        sleep: function() {
            (u ? cancelAnimationFrame : clearTimeout)(l),
            Jr = 0,
            c = Kr
        },
        lagSmoothing: function(w, _) {
            e = w || 1 / 0,
            t = Math.min(_ || 33, e)
        },
        fps: function(w) {
            s = 1e3 / (w || 240),
            o = p.time * 1e3 + s
        },
        add: function(w, _, v) {
            var b = _ ? function(y, x, k, T) {
                w(y, x, k, T),
                p.remove(b)
            }
            : w;
            return p.remove(w),
            a[v ? "unshift" : "push"](b),
            dr(),
            b
        },
        remove: function(w, _) {
            ~(_ = a.indexOf(w)) && a.splice(_, 1) && h >= _ && h--
        },
        _listeners: a
    },
    p
}(), dr = function() {
    return !Jr && It.wake()
}, ne = {}, gd = /^[\d.\-M][\d.\-,\s]/, yd = /["']/g, vd = function(e) {
    for (var t = {}, i = e.substr(1, e.length - 3).split(":"), r = i[0], s = 1, o = i.length, a, l, c; s < o; s++)
        l = i[s],
        a = s !== o - 1 ? l.lastIndexOf(",") : l.length,
        c = l.substr(0, a),
        t[r] = isNaN(c) ? c.replace(yd, "").trim() : +c,
        r = l.substr(a + 1).trim();
    return t
}, bd = function(e) {
    var t = e.indexOf("(") + 1
      , i = e.indexOf(")")
      , r = e.indexOf("(", t);
    return e.substring(t, ~r && r < i ? e.indexOf(")", i + 1) : i)
}, _d = function(e) {
    var t = (e + "").split("(")
      , i = ne[t[0]];
    return i && t.length > 1 && i.config ? i.config.apply(null, ~e.indexOf("{") ? [vd(t[1])] : bd(e).split(",").map(Ac)) : ne._CE && gd.test(e) ? ne._CE("", e) : i
}, Yc = function(e) {
    return function(t) {
        return 1 - e(1 - t)
    }
}, Xc = function n(e, t) {
    for (var i = e._first, r; i; )
        i instanceof _t ? n(i, t) : i.vars.yoyoEase && (!i._yoyo || !i._repeat) && i._yoyo !== t && (i.timeline ? n(i.timeline, t) : (r = i._ease,
        i._ease = i._yEase,
        i._yEase = r,
        i._yoyo = t)),
        i = i._next
}, Pn = function(e, t) {
    return e && (Se(e) ? e : ne[e] || _d(e)) || t
}, zn = function(e, t, i, r) {
    i === void 0 && (i = function(l) {
        return 1 - t(1 - l)
    }
    ),
    r === void 0 && (r = function(l) {
        return l < .5 ? t(l * 2) / 2 : 1 - t((1 - l) * 2) / 2
    }
    );
    var s = {
        easeIn: t,
        easeOut: i,
        easeInOut: r
    }, o;
    return Ct(e, function(a) {
        ne[a] = qt[a] = s,
        ne[o = a.toLowerCase()] = i;
        for (var l in s)
            ne[o + (l === "easeIn" ? ".in" : l === "easeOut" ? ".out" : ".inOut")] = ne[a + "." + l] = s[l]
    }),
    s
}, Gc = function(e) {
    return function(t) {
        return t < .5 ? (1 - e(1 - t * 2)) / 2 : .5 + e((t - .5) * 2) / 2
    }
}, To = function n(e, t, i) {
    var r = t >= 1 ? t : 1
      , s = (i || (e ? .3 : .45)) / (t < 1 ? t : 1)
      , o = s / jo * (Math.asin(1 / r) || 0)
      , a = function(u) {
        return u === 1 ? 1 : r * Math.pow(2, -10 * u) * Xh((u - o) * s) + 1
    }
      , l = e === "out" ? a : e === "in" ? function(c) {
        return 1 - a(1 - c)
    }
    : Gc(a);
    return s = jo / s,
    l.config = function(c, u) {
        return n(e, c, u)
    }
    ,
    l
}, So = function n(e, t) {
    t === void 0 && (t = 1.70158);
    var i = function(o) {
        return o ? --o * o * ((t + 1) * o + t) + 1 : 0
    }
      , r = e === "out" ? i : e === "in" ? function(s) {
        return 1 - i(1 - s)
    }
    : Gc(i);
    return r.config = function(s) {
        return n(e, s)
    }
    ,
    r
};
Ct("Linear,Quad,Cubic,Quart,Quint,Strong", function(n, e) {
    var t = e < 5 ? e + 1 : e;
    zn(n + ",Power" + (t - 1), e ? function(i) {
        return Math.pow(i, t)
    }
    : function(i) {
        return i
    }
    , function(i) {
        return 1 - Math.pow(1 - i, t)
    }, function(i) {
        return i < .5 ? Math.pow(i * 2, t) / 2 : 1 - Math.pow((1 - i) * 2, t) / 2
    })
});
ne.Linear.easeNone = ne.none = ne.Linear.easeIn;
zn("Elastic", To("in"), To("out"), To());
(function(n, e) {
    var t = 1 / e
      , i = 2 * t
      , r = 2.5 * t
      , s = function(a) {
        return a < t ? n * a * a : a < i ? n * Math.pow(a - 1.5 / e, 2) + .75 : a < r ? n * (a -= 2.25 / e) * a + .9375 : n * Math.pow(a - 2.625 / e, 2) + .984375
    };
    zn("Bounce", function(o) {
        return 1 - s(1 - o)
    }, s)
}
)(7.5625, 2.75);
zn("Expo", function(n) {
    return n ? Math.pow(2, 10 * (n - 1)) : 0
});
zn("Circ", function(n) {
    return -(vc(1 - n * n) - 1)
});
zn("Sine", function(n) {
    return n === 1 ? 1 : -Yh(n * Vh) + 1
});
zn("Back", So("in"), So("out"), So());
ne.SteppedEase = ne.steps = qt.SteppedEase = {
    config: function(e, t) {
        e === void 0 && (e = 1);
        var i = 1 / e
          , r = e + (t ? 0 : 1)
          , s = t ? 1 : 0
          , o = 1 - fe;
        return function(a) {
            return ((r * us(0, o, a) | 0) + s) * i
        }
    }
};
cr.ease = ne["quad.out"];
Ct("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(n) {
    return za += n + "," + n + "Params,"
});
var Kc = function(e, t) {
    this.id = Wh++,
    e._gsap = this,
    this.target = e,
    this.harness = t,
    this.get = t ? t.get : Ec,
    this.set = t ? t.getSetter : Ua
}
  , Zr = function() {
    function n(t) {
        this.vars = t,
        this._delay = +t.delay || 0,
        (this._repeat = t.repeat === 1 / 0 ? -2 : t.repeat || 0) && (this._rDelay = t.repeatDelay || 0,
        this._yoyo = !!t.yoyo || !!t.yoyoEase),
        this._ts = 1,
        hr(this, +t.duration, 1, 1),
        this.data = t.data,
        ye && (this._ctx = ye,
        ye.data.push(this)),
        Jr || It.wake()
    }
    var e = n.prototype;
    return e.delay = function(i) {
        return i || i === 0 ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + i - this._delay),
        this._delay = i,
        this) : this._delay
    }
    ,
    e.duration = function(i) {
        return arguments.length ? this.totalDuration(this._repeat > 0 ? i + (i + this._rDelay) * this._repeat : i) : this.totalDuration() && this._dur
    }
    ,
    e.totalDuration = function(i) {
        return arguments.length ? (this._dirty = 0,
        hr(this, this._repeat < 0 ? i : (i - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur
    }
    ,
    e.totalTime = function(i, r) {
        if (dr(),
        !arguments.length)
            return this._tTime;
        var s = this._dp;
        if (s && s.smoothChildTiming && this._ts) {
            for (ho(this, i),
            !s._dp || s.parent || Lc(s, this); s && s.parent; )
                s.parent._time !== s._start + (s._ts >= 0 ? s._tTime / s._ts : (s.totalDuration() - s._tTime) / -s._ts) && s.totalTime(s._tTime, !0),
                s = s.parent;
            !this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && i < this._tDur || this._ts < 0 && i > 0 || !this._tDur && !i) && fi(this._dp, this, this._start - this._delay)
        }
        return (this._tTime !== i || !this._dur && !r || this._initted && Math.abs(this._zTime) === fe || !i && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = i),
        Pc(this, i, r)),
        this
    }
    ,
    e.time = function(i, r) {
        return arguments.length ? this.totalTime(Math.min(this.totalDuration(), i + yl(this)) % (this._dur + this._rDelay) || (i ? this._dur : 0), r) : this._time
    }
    ,
    e.totalProgress = function(i, r) {
        return arguments.length ? this.totalTime(this.totalDuration() * i, r) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() > 0 ? 1 : 0
    }
    ,
    e.progress = function(i, r) {
        return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - i : i) + yl(this), r) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0
    }
    ,
    e.iteration = function(i, r) {
        var s = this.duration() + this._rDelay;
        return arguments.length ? this.totalTime(this._time + (i - 1) * s, r) : this._repeat ? ur(this._tTime, s) + 1 : 1
    }
    ,
    e.timeScale = function(i, r) {
        if (!arguments.length)
            return this._rts === -fe ? 0 : this._rts;
        if (this._rts === i)
            return this;
        var s = this.parent && this._ts ? Xs(this.parent._time, this) : this._tTime;
        return this._rts = +i || 0,
        this._ts = this._ps || i === -fe ? 0 : this._rts,
        this.totalTime(us(-Math.abs(this._delay), this._tDur, s), r !== !1),
        uo(this),
        td(this)
    }
    ,
    e.paused = function(i) {
        return arguments.length ? (this._ps !== i && (this._ps = i,
        i ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()),
        this._ts = this._act = 0) : (dr(),
        this._ts = this._rts,
        this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== fe && (this._tTime -= fe)))),
        this) : this._ps
    }
    ,
    e.startTime = function(i) {
        if (arguments.length) {
            this._start = i;
            var r = this.parent || this._dp;
            return r && (r._sort || !this.parent) && fi(r, this, i - this._delay),
            this
        }
        return this._start
    }
    ,
    e.endTime = function(i) {
        return this._start + (kt(i) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1)
    }
    ,
    e.rawTime = function(i) {
        var r = this.parent || this._dp;
        return r ? i && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? Xs(r.rawTime(i), this) : this._tTime : this._tTime
    }
    ,
    e.revert = function(i) {
        i === void 0 && (i = Qh);
        var r = ct;
        return ct = i,
        (this._initted || this._startAt) && (this.timeline && this.timeline.revert(i),
        this.totalTime(-.01, i.suppressEvents)),
        this.data !== "nested" && i.kill !== !1 && this.kill(),
        ct = r,
        this
    }
    ,
    e.globalTime = function(i) {
        for (var r = this, s = arguments.length ? i : r.rawTime(); r; )
            s = r._start + s / (Math.abs(r._ts) || 1),
            r = r._dp;
        return !this.parent && this._sat ? this._sat.globalTime(i) : s
    }
    ,
    e.repeat = function(i) {
        return arguments.length ? (this._repeat = i === 1 / 0 ? -2 : i,
        vl(this)) : this._repeat === -2 ? 1 / 0 : this._repeat
    }
    ,
    e.repeatDelay = function(i) {
        if (arguments.length) {
            var r = this._time;
            return this._rDelay = i,
            vl(this),
            r ? this.time(r) : this
        }
        return this._rDelay
    }
    ,
    e.yoyo = function(i) {
        return arguments.length ? (this._yoyo = i,
        this) : this._yoyo
    }
    ,
    e.seek = function(i, r) {
        return this.totalTime(jt(this, i), kt(r))
    }
    ,
    e.restart = function(i, r) {
        return this.play().totalTime(i ? -this._delay : 0, kt(r))
    }
    ,
    e.play = function(i, r) {
        return i != null && this.seek(i, r),
        this.reversed(!1).paused(!1)
    }
    ,
    e.reverse = function(i, r) {
        return i != null && this.seek(i || this.totalDuration(), r),
        this.reversed(!0).paused(!1)
    }
    ,
    e.pause = function(i, r) {
        return i != null && this.seek(i, r),
        this.paused(!0)
    }
    ,
    e.resume = function() {
        return this.paused(!1)
    }
    ,
    e.reversed = function(i) {
        return arguments.length ? (!!i !== this.reversed() && this.timeScale(-this._rts || (i ? -fe : 0)),
        this) : this._rts < 0
    }
    ,
    e.invalidate = function() {
        return this._initted = this._act = 0,
        this._zTime = -fe,
        this
    }
    ,
    e.isActive = function() {
        var i = this.parent || this._dp, r = this._start, s;
        return !!(!i || this._ts && this._initted && i.isActive() && (s = i.rawTime(!0)) >= r && s < this.endTime(!0) - fe)
    }
    ,
    e.eventCallback = function(i, r, s) {
        var o = this.vars;
        return arguments.length > 1 ? (r ? (o[i] = r,
        s && (o[i + "Params"] = s),
        i === "onUpdate" && (this._onUpdate = r)) : delete o[i],
        this) : o[i]
    }
    ,
    e.then = function(i) {
        var r = this;
        return new Promise(function(s) {
            var o = Se(i) ? i : Mc
              , a = function() {
                var c = r.then;
                r.then = null,
                Se(o) && (o = o(r)) && (o.then || o === r) && (r.then = c),
                s(o),
                r.then = c
            };
            r._initted && r.totalProgress() === 1 && r._ts >= 0 || !r._tTime && r._ts < 0 ? a() : r._prom = a
        }
        )
    }
    ,
    e.kill = function() {
        Pr(this)
    }
    ,
    n
}();
Gt(Zr.prototype, {
    _time: 0,
    _start: 0,
    _end: 0,
    _tTime: 0,
    _tDur: 0,
    _dirty: 0,
    _repeat: 0,
    _yoyo: !1,
    parent: null,
    _initted: !1,
    _rDelay: 0,
    _ts: 1,
    _dp: 0,
    ratio: 0,
    _zTime: -fe,
    _prom: 0,
    _ps: !1,
    _rts: 1
});
var _t = function(n) {
    yc(e, n);
    function e(i, r) {
        var s;
        return i === void 0 && (i = {}),
        s = n.call(this, i) || this,
        s.labels = {},
        s.smoothChildTiming = !!i.smoothChildTiming,
        s.autoRemoveChildren = !!i.autoRemoveChildren,
        s._sort = kt(i.sortChildren),
        _e && fi(i.parent || _e, Ci(s), r),
        i.reversed && s.reverse(),
        i.paused && s.paused(!0),
        i.scrollTrigger && Dc(Ci(s), i.scrollTrigger),
        s
    }
    var t = e.prototype;
    return t.to = function(r, s, o) {
        return Ir(0, arguments, this),
        this
    }
    ,
    t.from = function(r, s, o) {
        return Ir(1, arguments, this),
        this
    }
    ,
    t.fromTo = function(r, s, o, a) {
        return Ir(2, arguments, this),
        this
    }
    ,
    t.set = function(r, s, o) {
        return s.duration = 0,
        s.parent = this,
        Nr(s).repeatDelay || (s.repeat = 0),
        s.immediateRender = !!s.immediateRender,
        new Ie(r,s,jt(this, o),1),
        this
    }
    ,
    t.call = function(r, s, o) {
        return fi(this, Ie.delayedCall(0, r, s), o)
    }
    ,
    t.staggerTo = function(r, s, o, a, l, c, u) {
        return o.duration = s,
        o.stagger = o.stagger || a,
        o.onComplete = c,
        o.onCompleteParams = u,
        o.parent = this,
        new Ie(r,o,jt(this, l)),
        this
    }
    ,
    t.staggerFrom = function(r, s, o, a, l, c, u) {
        return o.runBackwards = 1,
        Nr(o).immediateRender = kt(o.immediateRender),
        this.staggerTo(r, s, o, a, l, c, u)
    }
    ,
    t.staggerFromTo = function(r, s, o, a, l, c, u, p) {
        return a.startAt = o,
        Nr(a).immediateRender = kt(a.immediateRender),
        this.staggerTo(r, s, a, l, c, u, p)
    }
    ,
    t.render = function(r, s, o) {
        var a = this._time, l = this._dirty ? this.totalDuration() : this._tDur, c = this._dur, u = r <= 0 ? 0 : Xe(r), p = this._zTime < 0 != r < 0 && (this._initted || !c), d, h, m, f, w, _, v, b, y, x, k, T;
        if (this !== _e && u > l && r >= 0 && (u = l),
        u !== this._tTime || o || p) {
            if (a !== this._time && c && (u += this._time - a,
            r += this._time - a),
            d = u,
            y = this._start,
            b = this._ts,
            _ = !b,
            p && (c || (a = this._zTime),
            (r || !s) && (this._zTime = r)),
            this._repeat) {
                if (k = this._yoyo,
                w = c + this._rDelay,
                this._repeat < -1 && r < 0)
                    return this.totalTime(w * 100 + r, s, o);
                if (d = Xe(u % w),
                u === l ? (f = this._repeat,
                d = c) : (f = ~~(u / w),
                f && f === u / w && (d = c,
                f--),
                d > c && (d = c)),
                x = ur(this._tTime, w),
                !a && this._tTime && x !== f && this._tTime - x * w - this._dur <= 0 && (x = f),
                k && f & 1 && (d = c - d,
                T = 1),
                f !== x && !this._lock) {
                    var M = k && x & 1
                      , E = M === (k && f & 1);
                    if (f < x && (M = !M),
                    a = M ? 0 : u % c ? c : u,
                    this._lock = 1,
                    this.render(a || (T ? 0 : Xe(f * w)), s, !c)._lock = 0,
                    this._tTime = u,
                    !s && this.parent && Ft(this, "onRepeat"),
                    this.vars.repeatRefresh && !T && (this.invalidate()._lock = 1),
                    a && a !== this._time || _ !== !this._ts || this.vars.onRepeat && !this.parent && !this._act)
                        return this;
                    if (c = this._dur,
                    l = this._tDur,
                    E && (this._lock = 2,
                    a = M ? c : -1e-4,
                    this.render(a, !0),
                    this.vars.repeatRefresh && !T && this.invalidate()),
                    this._lock = 0,
                    !this._ts && !_)
                        return this;
                    Xc(this, T)
                }
            }
            if (this._hasPause && !this._forcing && this._lock < 2 && (v = sd(this, Xe(a), Xe(d)),
            v && (u -= d - (d = v._start))),
            this._tTime = u,
            this._time = d,
            this._act = !b,
            this._initted || (this._onUpdate = this.vars.onUpdate,
            this._initted = 1,
            this._zTime = r,
            a = 0),
            !a && d && !s && !f && (Ft(this, "onStart"),
            this._tTime !== u))
                return this;
            if (d >= a && r >= 0)
                for (h = this._first; h; ) {
                    if (m = h._next,
                    (h._act || d >= h._start) && h._ts && v !== h) {
                        if (h.parent !== this)
                            return this.render(r, s, o);
                        if (h.render(h._ts > 0 ? (d - h._start) * h._ts : (h._dirty ? h.totalDuration() : h._tDur) + (d - h._start) * h._ts, s, o),
                        d !== this._time || !this._ts && !_) {
                            v = 0,
                            m && (u += this._zTime = -fe);
                            break
                        }
                    }
                    h = m
                }
            else {
                h = this._last;
                for (var C = r < 0 ? r : d; h; ) {
                    if (m = h._prev,
                    (h._act || C <= h._end) && h._ts && v !== h) {
                        if (h.parent !== this)
                            return this.render(r, s, o);
                        if (h.render(h._ts > 0 ? (C - h._start) * h._ts : (h._dirty ? h.totalDuration() : h._tDur) + (C - h._start) * h._ts, s, o || ct && (h._initted || h._startAt)),
                        d !== this._time || !this._ts && !_) {
                            v = 0,
                            m && (u += this._zTime = C ? -fe : fe);
                            break
                        }
                    }
                    h = m
                }
            }
            if (v && !s && (this.pause(),
            v.render(d >= a ? 0 : -fe)._zTime = d >= a ? 1 : -1,
            this._ts))
                return this._start = y,
                uo(this),
                this.render(r, s, o);
            this._onUpdate && !s && Ft(this, "onUpdate", !0),
            (u === l && this._tTime >= this.totalDuration() || !u && a) && (y === this._start || Math.abs(b) !== Math.abs(this._ts)) && (this._lock || ((r || !c) && (u === l && this._ts > 0 || !u && this._ts < 0) && rn(this, 1),
            !s && !(r < 0 && !a) && (u || a || !l) && (Ft(this, u === l && r >= 0 ? "onComplete" : "onReverseComplete", !0),
            this._prom && !(u < l && this.timeScale() > 0) && this._prom())))
        }
        return this
    }
    ,
    t.add = function(r, s) {
        var o = this;
        if (Li(s) || (s = jt(this, s, r)),
        !(r instanceof Zr)) {
            if (ut(r))
                return r.forEach(function(a) {
                    return o.add(a, s)
                }),
                this;
            if (Ge(r))
                return this.addLabel(r, s);
            if (Se(r))
                r = Ie.delayedCall(0, r);
            else
                return this
        }
        return this !== r ? fi(this, r, s) : this
    }
    ,
    t.getChildren = function(r, s, o, a) {
        r === void 0 && (r = !0),
        s === void 0 && (s = !0),
        o === void 0 && (o = !0),
        a === void 0 && (a = -Wt);
        for (var l = [], c = this._first; c; )
            c._start >= a && (c instanceof Ie ? s && l.push(c) : (o && l.push(c),
            r && l.push.apply(l, c.getChildren(!0, s, o)))),
            c = c._next;
        return l
    }
    ,
    t.getById = function(r) {
        for (var s = this.getChildren(1, 1, 1), o = s.length; o--; )
            if (s[o].vars.id === r)
                return s[o]
    }
    ,
    t.remove = function(r) {
        return Ge(r) ? this.removeLabel(r) : Se(r) ? this.killTweensOf(r) : (co(this, r),
        r === this._recent && (this._recent = this._last),
        En(this))
    }
    ,
    t.totalTime = function(r, s) {
        return arguments.length ? (this._forcing = 1,
        !this._dp && this._ts && (this._start = Xe(It.time - (this._ts > 0 ? r / this._ts : (this.totalDuration() - r) / -this._ts))),
        n.prototype.totalTime.call(this, r, s),
        this._forcing = 0,
        this) : this._tTime
    }
    ,
    t.addLabel = function(r, s) {
        return this.labels[r] = jt(this, s),
        this
    }
    ,
    t.removeLabel = function(r) {
        return delete this.labels[r],
        this
    }
    ,
    t.addPause = function(r, s, o) {
        var a = Ie.delayedCall(0, s || Kr, o);
        return a.data = "isPause",
        this._hasPause = 1,
        fi(this, a, jt(this, r))
    }
    ,
    t.removePause = function(r) {
        var s = this._first;
        for (r = jt(this, r); s; )
            s._start === r && s.data === "isPause" && rn(s),
            s = s._next
    }
    ,
    t.killTweensOf = function(r, s, o) {
        for (var a = this.getTweensOf(r, o), l = a.length; l--; )
            Xi !== a[l] && a[l].kill(r, s);
        return this
    }
    ,
    t.getTweensOf = function(r, s) {
        for (var o = [], a = Yt(r), l = this._first, c = Li(s), u; l; )
            l instanceof Ie ? Jh(l._targets, a) && (c ? (!Xi || l._initted && l._ts) && l.globalTime(0) <= s && l.globalTime(l.totalDuration()) > s : !s || l.isActive()) && o.push(l) : (u = l.getTweensOf(a, s)).length && o.push.apply(o, u),
            l = l._next;
        return o
    }
    ,
    t.tweenTo = function(r, s) {
        s = s || {};
        var o = this, a = jt(o, r), l = s, c = l.startAt, u = l.onStart, p = l.onStartParams, d = l.immediateRender, h, m = Ie.to(o, Gt({
            ease: s.ease || "none",
            lazy: !1,
            immediateRender: !1,
            time: a,
            overwrite: "auto",
            duration: s.duration || Math.abs((a - (c && "time"in c ? c.time : o._time)) / o.timeScale()) || fe,
            onStart: function() {
                if (o.pause(),
                !h) {
                    var w = s.duration || Math.abs((a - (c && "time"in c ? c.time : o._time)) / o.timeScale());
                    m._dur !== w && hr(m, w, 0, 1).render(m._time, !0, !0),
                    h = 1
                }
                u && u.apply(m, p || [])
            }
        }, s));
        return d ? m.render(0) : m
    }
    ,
    t.tweenFromTo = function(r, s, o) {
        return this.tweenTo(s, Gt({
            startAt: {
                time: jt(this, r)
            }
        }, o))
    }
    ,
    t.recent = function() {
        return this._recent
    }
    ,
    t.nextLabel = function(r) {
        return r === void 0 && (r = this._time),
        bl(this, jt(this, r))
    }
    ,
    t.previousLabel = function(r) {
        return r === void 0 && (r = this._time),
        bl(this, jt(this, r), 1)
    }
    ,
    t.currentLabel = function(r) {
        return arguments.length ? this.seek(r, !0) : this.previousLabel(this._time + fe)
    }
    ,
    t.shiftChildren = function(r, s, o) {
        o === void 0 && (o = 0);
        for (var a = this._first, l = this.labels, c; a; )
            a._start >= o && (a._start += r,
            a._end += r),
            a = a._next;
        if (s)
            for (c in l)
                l[c] >= o && (l[c] += r);
        return En(this)
    }
    ,
    t.invalidate = function(r) {
        var s = this._first;
        for (this._lock = 0; s; )
            s.invalidate(r),
            s = s._next;
        return n.prototype.invalidate.call(this, r)
    }
    ,
    t.clear = function(r) {
        r === void 0 && (r = !0);
        for (var s = this._first, o; s; )
            o = s._next,
            this.remove(s),
            s = o;
        return this._dp && (this._time = this._tTime = this._pTime = 0),
        r && (this.labels = {}),
        En(this)
    }
    ,
    t.totalDuration = function(r) {
        var s = 0, o = this, a = o._last, l = Wt, c, u, p;
        if (arguments.length)
            return o.timeScale((o._repeat < 0 ? o.duration() : o.totalDuration()) / (o.reversed() ? -r : r));
        if (o._dirty) {
            for (p = o.parent; a; )
                c = a._prev,
                a._dirty && a.totalDuration(),
                u = a._start,
                u > l && o._sort && a._ts && !o._lock ? (o._lock = 1,
                fi(o, a, u - a._delay, 1)._lock = 0) : l = u,
                u < 0 && a._ts && (s -= u,
                (!p && !o._dp || p && p.smoothChildTiming) && (o._start += u / o._ts,
                o._time -= u,
                o._tTime -= u),
                o.shiftChildren(-u, !1, -1 / 0),
                l = 0),
                a._end > s && a._ts && (s = a._end),
                a = c;
            hr(o, o === _e && o._time > s ? o._time : s, 1, 1),
            o._dirty = 0
        }
        return o._tDur
    }
    ,
    e.updateRoot = function(r) {
        if (_e._ts && (Pc(_e, Xs(r, _e)),
        Cc = It.frame),
        It.frame >= ml) {
            ml += zt.autoSleep || 120;
            var s = _e._first;
            if ((!s || !s._ts) && zt.autoSleep && It._listeners.length < 2) {
                for (; s && !s._ts; )
                    s = s._next;
                s || It.sleep()
            }
        }
    }
    ,
    e
}(Zr);
Gt(_t.prototype, {
    _lock: 0,
    _hasPause: 0,
    _forcing: 0
});
var wd = function(e, t, i, r, s, o, a) {
    var l = new Et(this._pt,e,t,0,1,iu,null,s), c = 0, u = 0, p, d, h, m, f, w, _, v;
    for (l.b = i,
    l.e = r,
    i += "",
    r += "",
    (_ = ~r.indexOf("random(")) && (r = Qr(r)),
    o && (v = [i, r],
    o(v, e, t),
    i = v[0],
    r = v[1]),
    d = i.match(_o) || []; p = _o.exec(r); )
        m = p[0],
        f = r.substring(c, p.index),
        h ? h = (h + 1) % 5 : f.substr(-5) === "rgba(" && (h = 1),
        m !== d[u++] && (w = parseFloat(d[u - 1]) || 0,
        l._pt = {
            _next: l._pt,
            p: f || u === 1 ? f : ",",
            s: w,
            c: m.charAt(1) === "=" ? ir(w, m) - w : parseFloat(m) - w,
            m: h && h < 4 ? Math.round : 0
        },
        c = _o.lastIndex);
    return l.c = c < r.length ? r.substring(c, r.length) : "",
    l.fp = a,
    (wc.test(r) || _) && (l.e = 0),
    this._pt = l,
    l
}, Ba = function(e, t, i, r, s, o, a, l, c, u) {
    Se(r) && (r = r(s || 0, e, o));
    var p = e[t], d = i !== "get" ? i : Se(p) ? c ? e[t.indexOf("set") || !Se(e["get" + t.substr(3)]) ? t : "get" + t.substr(3)](c) : e[t]() : p, h = Se(p) ? c ? Cd : eu : ja, m;
    if (Ge(r) && (~r.indexOf("random(") && (r = Qr(r)),
    r.charAt(1) === "=" && (m = ir(d, r) + (lt(d) || 0),
    (m || m === 0) && (r = m))),
    !u || d !== r || Jo)
        return !isNaN(d * r) && r !== "" ? (m = new Et(this._pt,e,t,+d || 0,r - (d || 0),typeof p == "boolean" ? Pd : tu,0,h),
        c && (m.fp = c),
        a && m.modifier(a, this, e),
        this._pt = m) : (!p && !(t in e) && $a(t, r),
        wd.call(this, e, t, d, r, h, l || zt.stringFilter, c))
}, xd = function(e, t, i, r, s) {
    if (Se(e) && (e = $r(e, s, t, i, r)),
    !xi(e) || e.style && e.nodeType || ut(e) || bc(e))
        return Ge(e) ? $r(e, s, t, i, r) : e;
    var o = {}, a;
    for (a in e)
        o[a] = $r(e[a], s, t, i, r);
    return o
}, Qc = function(e, t, i, r, s, o) {
    var a, l, c, u;
    if (Nt[e] && (a = new Nt[e]).init(s, a.rawVars ? t[e] : xd(t[e], r, s, o, i), i, r, o) !== !1 && (i._pt = l = new Et(i._pt,s,e,0,1,a.render,a,0,a.priority),
    i !== Zn))
        for (c = i._ptLookup[i._targets.indexOf(s)],
        u = a._props.length; u--; )
            c[a._props[u]] = l;
    return a
}, Xi, Jo, Ha = function n(e, t, i) {
    var r = e.vars, s = r.ease, o = r.startAt, a = r.immediateRender, l = r.lazy, c = r.onUpdate, u = r.runBackwards, p = r.yoyoEase, d = r.keyframes, h = r.autoRevert, m = e._dur, f = e._startAt, w = e._targets, _ = e.parent, v = _ && _.data === "nested" ? _.vars.targets : w, b = e._overwrite === "auto" && !Da, y = e.timeline, x, k, T, M, E, C, N, A, $, L, B, W, z;
    if (y && (!d || !s) && (s = "none"),
    e._ease = Pn(s, cr.ease),
    e._yEase = p ? Yc(Pn(p === !0 ? s : p, cr.ease)) : 0,
    p && e._yoyo && !e._repeat && (p = e._yEase,
    e._yEase = e._ease,
    e._ease = p),
    e._from = !y && !!r.runBackwards,
    !y || d && !r.stagger) {
        if (A = w[0] ? Cn(w[0]).harness : 0,
        W = A && r[A.prop],
        x = Ys(r, Fa),
        f && (f._zTime < 0 && f.progress(1),
        t < 0 && u && a && !h ? f.render(-1, !0) : f.revert(u && m ? Ls : Kh),
        f._lazy = 0),
        o) {
            if (rn(e._startAt = Ie.set(w, Gt({
                data: "isStart",
                overwrite: !1,
                parent: _,
                immediateRender: !0,
                lazy: !f && kt(l),
                startAt: null,
                delay: 0,
                onUpdate: c && function() {
                    return Ft(e, "onUpdate")
                }
                ,
                stagger: 0
            }, o))),
            e._startAt._dp = 0,
            e._startAt._sat = e,
            t < 0 && (ct || !a && !h) && e._startAt.revert(Ls),
            a && m && t <= 0 && i <= 0) {
                t && (e._zTime = t);
                return
            }
        } else if (u && m && !f) {
            if (t && (a = !1),
            T = Gt({
                overwrite: !1,
                data: "isFromStart",
                lazy: a && !f && kt(l),
                immediateRender: a,
                stagger: 0,
                parent: _
            }, x),
            W && (T[A.prop] = W),
            rn(e._startAt = Ie.set(w, T)),
            e._startAt._dp = 0,
            e._startAt._sat = e,
            t < 0 && (ct ? e._startAt.revert(Ls) : e._startAt.render(-1, !0)),
            e._zTime = t,
            !a)
                n(e._startAt, fe, fe);
            else if (!t)
                return
        }
        for (e._pt = e._ptCache = 0,
        l = m && kt(l) || l && !m,
        k = 0; k < w.length; k++) {
            if (E = w[k],
            N = E._gsap || qa(w)[k]._gsap,
            e._ptLookup[k] = L = {},
            Wo[N.id] && en.length && Ws(),
            B = v === w ? k : v.indexOf(E),
            A && ($ = new A).init(E, W || x, e, B, v) !== !1 && (e._pt = M = new Et(e._pt,E,$.name,0,1,$.render,$,0,$.priority),
            $._props.forEach(function(Q) {
                L[Q] = M
            }),
            $.priority && (C = 1)),
            !A || W)
                for (T in x)
                    Nt[T] && ($ = Qc(T, x, e, B, E, v)) ? $.priority && (C = 1) : L[T] = M = Ba.call(e, E, T, "get", x[T], B, v, 0, r.stringFilter);
            e._op && e._op[k] && e.kill(E, e._op[k]),
            b && e._pt && (Xi = e,
            _e.killTweensOf(E, L, e.globalTime(t)),
            z = !e.parent,
            Xi = 0),
            e._pt && l && (Wo[N.id] = 1)
        }
        C && nu(e),
        e._onInit && e._onInit(e)
    }
    e._onUpdate = c,
    e._initted = (!e._op || e._pt) && !z,
    d && t <= 0 && y.render(Wt, !0, !0)
}, Td = function(e, t, i, r, s, o, a, l) {
    var c = (e._pt && e._ptCache || (e._ptCache = {}))[t], u, p, d, h;
    if (!c)
        for (c = e._ptCache[t] = [],
        d = e._ptLookup,
        h = e._targets.length; h--; ) {
            if (u = d[h][t],
            u && u.d && u.d._pt)
                for (u = u.d._pt; u && u.p !== t && u.fp !== t; )
                    u = u._next;
            if (!u)
                return Jo = 1,
                e.vars[t] = "+=0",
                Ha(e, a),
                Jo = 0,
                l ? Gr(t + " not eligible for reset") : 1;
            c.push(u)
        }
    for (h = c.length; h--; )
        p = c[h],
        u = p._pt || p,
        u.s = (r || r === 0) && !s ? r : u.s + (r || 0) + o * u.c,
        u.c = i - u.s,
        p.e && (p.e = Me(i) + lt(p.e)),
        p.b && (p.b = u.s + lt(p.b))
}, Sd = function(e, t) {
    var i = e[0] ? Cn(e[0]).harness : 0, r = i && i.aliases, s, o, a, l;
    if (!r)
        return t;
    s = Dn({}, t);
    for (o in r)
        if (o in s)
            for (l = r[o].split(","),
            a = l.length; a--; )
                s[l[a]] = s[o];
    return s
}, kd = function(e, t, i, r) {
    var s = t.ease || r || "power1.inOut", o, a;
    if (ut(t))
        a = i[e] || (i[e] = []),
        t.forEach(function(l, c) {
            return a.push({
                t: c / (t.length - 1) * 100,
                v: l,
                e: s
            })
        });
    else
        for (o in t)
            a = i[o] || (i[o] = []),
            o === "ease" || a.push({
                t: parseFloat(e),
                v: t[o],
                e: s
            })
}, $r = function(e, t, i, r, s) {
    return Se(e) ? e.call(t, i, r, s) : Ge(e) && ~e.indexOf("random(") ? Qr(e) : e
}, Jc = za + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert", Zc = {};
Ct(Jc + ",id,stagger,delay,duration,paused,scrollTrigger", function(n) {
    return Zc[n] = 1
});
var Ie = function(n) {
    yc(e, n);
    function e(i, r, s, o) {
        var a;
        typeof r == "number" && (s.duration = r,
        r = s,
        s = null),
        a = n.call(this, o ? r : Nr(r)) || this;
        var l = a.vars, c = l.duration, u = l.delay, p = l.immediateRender, d = l.stagger, h = l.overwrite, m = l.keyframes, f = l.defaults, w = l.scrollTrigger, _ = l.yoyoEase, v = r.parent || _e, b = (ut(i) || bc(i) ? Li(i[0]) : "length"in r) ? [i] : Yt(i), y, x, k, T, M, E, C, N;
        if (a._targets = b.length ? qa(b) : Gr("GSAP target " + i + " not found. https://gsap.com", !zt.nullTargetWarn) || [],
        a._ptLookup = [],
        a._overwrite = h,
        m || d || vs(c) || vs(u)) {
            if (r = a.vars,
            y = a.timeline = new _t({
                data: "nested",
                defaults: f || {},
                targets: v && v.data === "nested" ? v.vars.targets : b
            }),
            y.kill(),
            y.parent = y._dp = Ci(a),
            y._start = 0,
            d || vs(c) || vs(u)) {
                if (T = b.length,
                C = d && $c(d),
                xi(d))
                    for (M in d)
                        ~Jc.indexOf(M) && (N || (N = {}),
                        N[M] = d[M]);
                for (x = 0; x < T; x++)
                    k = Ys(r, Zc),
                    k.stagger = 0,
                    _ && (k.yoyoEase = _),
                    N && Dn(k, N),
                    E = b[x],
                    k.duration = +$r(c, Ci(a), x, E, b),
                    k.delay = (+$r(u, Ci(a), x, E, b) || 0) - a._delay,
                    !d && T === 1 && k.delay && (a._delay = u = k.delay,
                    a._start += u,
                    k.delay = 0),
                    y.to(E, k, C ? C(x, E, b) : 0),
                    y._ease = ne.none;
                y.duration() ? c = u = 0 : a.timeline = 0
            } else if (m) {
                Nr(Gt(y.vars.defaults, {
                    ease: "none"
                })),
                y._ease = Pn(m.ease || r.ease || "none");
                var A = 0, $, L, B;
                if (ut(m))
                    m.forEach(function(W) {
                        return y.to(b, W, ">")
                    }),
                    y.duration();
                else {
                    k = {};
                    for (M in m)
                        M === "ease" || M === "easeEach" || kd(M, m[M], k, m.easeEach);
                    for (M in k)
                        for ($ = k[M].sort(function(W, z) {
                            return W.t - z.t
                        }),
                        A = 0,
                        x = 0; x < $.length; x++)
                            L = $[x],
                            B = {
                                ease: L.e,
                                duration: (L.t - (x ? $[x - 1].t : 0)) / 100 * c
                            },
                            B[M] = L.v,
                            y.to(b, B, A),
                            A += B.duration;
                    y.duration() < c && y.to({}, {
                        duration: c - y.duration()
                    })
                }
            }
            c || a.duration(c = y.duration())
        } else
            a.timeline = 0;
        return h === !0 && !Da && (Xi = Ci(a),
        _e.killTweensOf(b),
        Xi = 0),
        fi(v, Ci(a), s),
        r.reversed && a.reverse(),
        r.paused && a.paused(!0),
        (p || !c && !m && a._start === Xe(v._time) && kt(p) && id(Ci(a)) && v.data !== "nested") && (a._tTime = -fe,
        a.render(Math.max(0, -u) || 0)),
        w && Dc(Ci(a), w),
        a
    }
    var t = e.prototype;
    return t.render = function(r, s, o) {
        var a = this._time, l = this._tDur, c = this._dur, u = r < 0, p = r > l - fe && !u ? l : r < fe ? 0 : r, d, h, m, f, w, _, v, b, y;
        if (!c)
            rd(this, r, s, o);
        else if (p !== this._tTime || !r || o || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== u) {
            if (d = p,
            b = this.timeline,
            this._repeat) {
                if (f = c + this._rDelay,
                this._repeat < -1 && u)
                    return this.totalTime(f * 100 + r, s, o);
                if (d = Xe(p % f),
                p === l ? (m = this._repeat,
                d = c) : (m = ~~(p / f),
                m && m === Xe(p / f) && (d = c,
                m--),
                d > c && (d = c)),
                _ = this._yoyo && m & 1,
                _ && (y = this._yEase,
                d = c - d),
                w = ur(this._tTime, f),
                d === a && !o && this._initted && m === w)
                    return this._tTime = p,
                    this;
                m !== w && (b && this._yEase && Xc(b, _),
                this.vars.repeatRefresh && !_ && !this._lock && this._time !== f && this._initted && (this._lock = o = 1,
                this.render(Xe(f * m), !0).invalidate()._lock = 0))
            }
            if (!this._initted) {
                if (Rc(this, u ? r : d, o, s, p))
                    return this._tTime = 0,
                    this;
                if (a !== this._time && !(o && this.vars.repeatRefresh && m !== w))
                    return this;
                if (c !== this._dur)
                    return this.render(r, s, o)
            }
            if (this._tTime = p,
            this._time = d,
            !this._act && this._ts && (this._act = 1,
            this._lazy = 0),
            this.ratio = v = (y || this._ease)(d / c),
            this._from && (this.ratio = v = 1 - v),
            d && !a && !s && !m && (Ft(this, "onStart"),
            this._tTime !== p))
                return this;
            for (h = this._pt; h; )
                h.r(v, h.d),
                h = h._next;
            b && b.render(r < 0 ? r : b._dur * b._ease(d / this._dur), s, o) || this._startAt && (this._zTime = r),
            this._onUpdate && !s && (u && Yo(this, r, s, o),
            Ft(this, "onUpdate")),
            this._repeat && m !== w && this.vars.onRepeat && !s && this.parent && Ft(this, "onRepeat"),
            (p === this._tDur || !p) && this._tTime === p && (u && !this._onUpdate && Yo(this, r, !0, !0),
            (r || !c) && (p === this._tDur && this._ts > 0 || !p && this._ts < 0) && rn(this, 1),
            !s && !(u && !a) && (p || a || _) && (Ft(this, p === l ? "onComplete" : "onReverseComplete", !0),
            this._prom && !(p < l && this.timeScale() > 0) && this._prom()))
        }
        return this
    }
    ,
    t.targets = function() {
        return this._targets
    }
    ,
    t.invalidate = function(r) {
        return (!r || !this.vars.runBackwards) && (this._startAt = 0),
        this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0,
        this._ptLookup = [],
        this.timeline && this.timeline.invalidate(r),
        n.prototype.invalidate.call(this, r)
    }
    ,
    t.resetTo = function(r, s, o, a, l) {
        Jr || It.wake(),
        this._ts || this.play();
        var c = Math.min(this._dur, (this._dp._time - this._start) * this._ts), u;
        return this._initted || Ha(this, c),
        u = this._ease(c / this._dur),
        Td(this, r, s, o, a, u, c, l) ? this.resetTo(r, s, o, a, 1) : (ho(this, 0),
        this.parent || Oc(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0),
        this.render(0))
    }
    ,
    t.kill = function(r, s) {
        if (s === void 0 && (s = "all"),
        !r && (!s || s === "all"))
            return this._lazy = this._pt = 0,
            this.parent ? Pr(this) : this;
        if (this.timeline) {
            var o = this.timeline.totalDuration();
            return this.timeline.killTweensOf(r, s, Xi && Xi.vars.overwrite !== !0)._first || Pr(this),
            this.parent && o !== this.timeline.totalDuration() && hr(this, this._dur * this.timeline._tDur / o, 0, 1),
            this
        }
        var a = this._targets, l = r ? Yt(r) : a, c = this._ptLookup, u = this._pt, p, d, h, m, f, w, _;
        if ((!s || s === "all") && ed(a, l))
            return s === "all" && (this._pt = 0),
            Pr(this);
        for (p = this._op = this._op || [],
        s !== "all" && (Ge(s) && (f = {},
        Ct(s, function(v) {
            return f[v] = 1
        }),
        s = f),
        s = Sd(a, s)),
        _ = a.length; _--; )
            if (~l.indexOf(a[_])) {
                d = c[_],
                s === "all" ? (p[_] = s,
                m = d,
                h = {}) : (h = p[_] = p[_] || {},
                m = s);
                for (f in m)
                    w = d && d[f],
                    w && ((!("kill"in w.d) || w.d.kill(f) === !0) && co(this, w, "_pt"),
                    delete d[f]),
                    h !== "all" && (h[f] = 1)
            }
        return this._initted && !this._pt && u && Pr(this),
        this
    }
    ,
    e.to = function(r, s) {
        return new e(r,s,arguments[2])
    }
    ,
    e.from = function(r, s) {
        return Ir(1, arguments)
    }
    ,
    e.delayedCall = function(r, s, o, a) {
        return new e(s,0,{
            immediateRender: !1,
            lazy: !1,
            overwrite: !1,
            delay: r,
            onComplete: s,
            onReverseComplete: s,
            onCompleteParams: o,
            onReverseCompleteParams: o,
            callbackScope: a
        })
    }
    ,
    e.fromTo = function(r, s, o) {
        return Ir(2, arguments)
    }
    ,
    e.set = function(r, s) {
        return s.duration = 0,
        s.repeatDelay || (s.repeat = 0),
        new e(r,s)
    }
    ,
    e.killTweensOf = function(r, s, o) {
        return _e.killTweensOf(r, s, o)
    }
    ,
    e
}(Zr);
Gt(Ie.prototype, {
    _targets: [],
    _lazy: 0,
    _startAt: 0,
    _op: 0,
    _onInit: 0
});
Ct("staggerTo,staggerFrom,staggerFromTo", function(n) {
    Ie[n] = function() {
        var e = new _t
          , t = Go.call(arguments, 0);
        return t.splice(n === "staggerFromTo" ? 5 : 4, 0, 0),
        e[n].apply(e, t)
    }
});
var ja = function(e, t, i) {
    return e[t] = i
}
  , eu = function(e, t, i) {
    return e[t](i)
}
  , Cd = function(e, t, i, r) {
    return e[t](r.fp, i)
}
  , Ed = function(e, t, i) {
    return e.setAttribute(t, i)
}
  , Ua = function(e, t) {
    return Se(e[t]) ? eu : Ra(e[t]) && e.setAttribute ? Ed : ja
}
  , tu = function(e, t) {
    return t.set(t.t, t.p, Math.round((t.s + t.c * e) * 1e6) / 1e6, t)
}
  , Pd = function(e, t) {
    return t.set(t.t, t.p, !!(t.s + t.c * e), t)
}
  , iu = function(e, t) {
    var i = t._pt
      , r = "";
    if (!e && t.b)
        r = t.b;
    else if (e === 1 && t.e)
        r = t.e;
    else {
        for (; i; )
            r = i.p + (i.m ? i.m(i.s + i.c * e) : Math.round((i.s + i.c * e) * 1e4) / 1e4) + r,
            i = i._next;
        r += t.c
    }
    t.set(t.t, t.p, r, t)
}
  , Va = function(e, t) {
    for (var i = t._pt; i; )
        i.r(e, i.d),
        i = i._next
}
  , Ad = function(e, t, i, r) {
    for (var s = this._pt, o; s; )
        o = s._next,
        s.p === r && s.modifier(e, t, i),
        s = o
}
  , Md = function(e) {
    for (var t = this._pt, i, r; t; )
        r = t._next,
        t.p === e && !t.op || t.op === e ? co(this, t, "_pt") : t.dep || (i = 1),
        t = r;
    return !i
}
  , Od = function(e, t, i, r) {
    r.mSet(e, t, r.m.call(r.tween, i, r.mt), r)
}
  , nu = function(e) {
    for (var t = e._pt, i, r, s, o; t; ) {
        for (i = t._next,
        r = s; r && r.pr > t.pr; )
            r = r._next;
        (t._prev = r ? r._prev : o) ? t._prev._next = t : s = t,
        (t._next = r) ? r._prev = t : o = t,
        t = i
    }
    e._pt = s
}
  , Et = function() {
    function n(t, i, r, s, o, a, l, c, u) {
        this.t = i,
        this.s = s,
        this.c = o,
        this.p = r,
        this.r = a || tu,
        this.d = l || this,
        this.set = c || ja,
        this.pr = u || 0,
        this._next = t,
        t && (t._prev = this)
    }
    var e = n.prototype;
    return e.modifier = function(i, r, s) {
        this.mSet = this.mSet || this.set,
        this.set = Od,
        this.m = i,
        this.mt = s,
        this.tween = r
    }
    ,
    n
}();
Ct(za + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function(n) {
    return Fa[n] = 1
});
qt.TweenMax = qt.TweenLite = Ie;
qt.TimelineLite = qt.TimelineMax = _t;
_e = new _t({
    sortChildren: !1,
    defaults: cr,
    autoRemoveChildren: !0,
    id: "root",
    smoothChildTiming: !0
});
zt.stringFilter = Wc;
var An = []
  , Rs = {}
  , Ld = []
  , wl = 0
  , Dd = 0
  , ko = function(e) {
    return (Rs[e] || Ld).map(function(t) {
        return t()
    })
}
  , Zo = function() {
    var e = Date.now()
      , t = [];
    e - wl > 2 && (ko("matchMediaInit"),
    An.forEach(function(i) {
        var r = i.queries, s = i.conditions, o, a, l, c;
        for (a in r)
            o = hi.matchMedia(r[a]).matches,
            o && (l = 1),
            o !== s[a] && (s[a] = o,
            c = 1);
        c && (i.revert(),
        l && t.push(i))
    }),
    ko("matchMediaRevert"),
    t.forEach(function(i) {
        return i.onMatch(i, function(r) {
            return i.add(null, r)
        })
    }),
    wl = e,
    ko("matchMedia"))
}
  , ru = function() {
    function n(t, i) {
        this.selector = i && Ko(i),
        this.data = [],
        this._r = [],
        this.isReverted = !1,
        this.id = Dd++,
        t && this.add(t)
    }
    var e = n.prototype;
    return e.add = function(i, r, s) {
        Se(i) && (s = r,
        r = i,
        i = Se);
        var o = this
          , a = function() {
            var c = ye, u = o.selector, p;
            return c && c !== o && c.data.push(o),
            s && (o.selector = Ko(s)),
            ye = o,
            p = r.apply(o, arguments),
            Se(p) && o._r.push(p),
            ye = c,
            o.selector = u,
            o.isReverted = !1,
            p
        };
        return o.last = a,
        i === Se ? a(o, function(l) {
            return o.add(null, l)
        }) : i ? o[i] = a : a
    }
    ,
    e.ignore = function(i) {
        var r = ye;
        ye = null,
        i(this),
        ye = r
    }
    ,
    e.getTweens = function() {
        var i = [];
        return this.data.forEach(function(r) {
            return r instanceof n ? i.push.apply(i, r.getTweens()) : r instanceof Ie && !(r.parent && r.parent.data === "nested") && i.push(r)
        }),
        i
    }
    ,
    e.clear = function() {
        this._r.length = this.data.length = 0
    }
    ,
    e.kill = function(i, r) {
        var s = this;
        if (i ? function() {
            for (var a = s.getTweens(), l = s.data.length, c; l--; )
                c = s.data[l],
                c.data === "isFlip" && (c.revert(),
                c.getChildren(!0, !0, !1).forEach(function(u) {
                    return a.splice(a.indexOf(u), 1)
                }));
            for (a.map(function(u) {
                return {
                    g: u._dur || u._delay || u._sat && !u._sat.vars.immediateRender ? u.globalTime(0) : -1 / 0,
                    t: u
                }
            }).sort(function(u, p) {
                return p.g - u.g || -1 / 0
            }).forEach(function(u) {
                return u.t.revert(i)
            }),
            l = s.data.length; l--; )
                c = s.data[l],
                c instanceof _t ? c.data !== "nested" && (c.scrollTrigger && c.scrollTrigger.revert(),
                c.kill()) : !(c instanceof Ie) && c.revert && c.revert(i);
            s._r.forEach(function(u) {
                return u(i, s)
            }),
            s.isReverted = !0
        }() : this.data.forEach(function(a) {
            return a.kill && a.kill()
        }),
        this.clear(),
        r)
            for (var o = An.length; o--; )
                An[o].id === this.id && An.splice(o, 1)
    }
    ,
    e.revert = function(i) {
        this.kill(i || {})
    }
    ,
    n
}()
  , Rd = function() {
    function n(t) {
        this.contexts = [],
        this.scope = t,
        ye && ye.data.push(this)
    }
    var e = n.prototype;
    return e.add = function(i, r, s) {
        xi(i) || (i = {
            matches: i
        });
        var o = new ru(0,s || this.scope), a = o.conditions = {}, l, c, u;
        ye && !o.selector && (o.selector = ye.selector),
        this.contexts.push(o),
        r = o.add("onMatch", r),
        o.queries = i;
        for (c in i)
            c === "all" ? u = 1 : (l = hi.matchMedia(i[c]),
            l && (An.indexOf(o) < 0 && An.push(o),
            (a[c] = l.matches) && (u = 1),
            l.addListener ? l.addListener(Zo) : l.addEventListener("change", Zo)));
        return u && r(o, function(p) {
            return o.add(null, p)
        }),
        this
    }
    ,
    e.revert = function(i) {
        this.kill(i || {})
    }
    ,
    e.kill = function(i) {
        this.contexts.forEach(function(r) {
            return r.kill(i, !0)
        })
    }
    ,
    n
}()
  , Gs = {
    registerPlugin: function() {
        for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++)
            t[i] = arguments[i];
        t.forEach(function(r) {
            return jc(r)
        })
    },
    timeline: function(e) {
        return new _t(e)
    },
    getTweensOf: function(e, t) {
        return _e.getTweensOf(e, t)
    },
    getProperty: function(e, t, i, r) {
        Ge(e) && (e = Yt(e)[0]);
        var s = Cn(e || {}).get
          , o = i ? Mc : Ac;
        return i === "native" && (i = ""),
        e && (t ? o((Nt[t] && Nt[t].get || s)(e, t, i, r)) : function(a, l, c) {
            return o((Nt[a] && Nt[a].get || s)(e, a, l, c))
        }
        )
    },
    quickSetter: function(e, t, i) {
        if (e = Yt(e),
        e.length > 1) {
            var r = e.map(function(u) {
                return At.quickSetter(u, t, i)
            })
              , s = r.length;
            return function(u) {
                for (var p = s; p--; )
                    r[p](u)
            }
        }
        e = e[0] || {};
        var o = Nt[t]
          , a = Cn(e)
          , l = a.harness && (a.harness.aliases || {})[t] || t
          , c = o ? function(u) {
            var p = new o;
            Zn._pt = 0,
            p.init(e, i ? u + i : u, Zn, 0, [e]),
            p.render(1, p),
            Zn._pt && Va(1, Zn)
        }
        : a.set(e, l);
        return o ? c : function(u) {
            return c(e, l, i ? u + i : u, a, 1)
        }
    },
    quickTo: function(e, t, i) {
        var r, s = At.to(e, Dn((r = {},
        r[t] = "+=0.1",
        r.paused = !0,
        r), i || {})), o = function(l, c, u) {
            return s.resetTo(t, l, c, u)
        };
        return o.tween = s,
        o
    },
    isTweening: function(e) {
        return _e.getTweensOf(e, !0).length > 0
    },
    defaults: function(e) {
        return e && e.ease && (e.ease = Pn(e.ease, cr.ease)),
        gl(cr, e || {})
    },
    config: function(e) {
        return gl(zt, e || {})
    },
    registerEffect: function(e) {
        var t = e.name
          , i = e.effect
          , r = e.plugins
          , s = e.defaults
          , o = e.extendTimeline;
        (r || "").split(",").forEach(function(a) {
            return a && !Nt[a] && !qt[a] && Gr(t + " effect requires " + a + " plugin.")
        }),
        wo[t] = function(a, l, c) {
            return i(Yt(a), Gt(l || {}, s), c)
        }
        ,
        o && (_t.prototype[t] = function(a, l, c) {
            return this.add(wo[t](a, xi(l) ? l : (c = l) && {}, this), c)
        }
        )
    },
    registerEase: function(e, t) {
        ne[e] = Pn(t)
    },
    parseEase: function(e, t) {
        return arguments.length ? Pn(e, t) : ne
    },
    getById: function(e) {
        return _e.getById(e)
    },
    exportRoot: function(e, t) {
        e === void 0 && (e = {});
        var i = new _t(e), r, s;
        for (i.smoothChildTiming = kt(e.smoothChildTiming),
        _e.remove(i),
        i._dp = 0,
        i._time = i._tTime = _e._time,
        r = _e._first; r; )
            s = r._next,
            (t || !(!r._dur && r instanceof Ie && r.vars.onComplete === r._targets[0])) && fi(i, r, r._start - r._delay),
            r = s;
        return fi(_e, i, 0),
        i
    },
    context: function(e, t) {
        return e ? new ru(e,t) : ye
    },
    matchMedia: function(e) {
        return new Rd(e)
    },
    matchMediaRefresh: function() {
        return An.forEach(function(e) {
            var t = e.conditions, i, r;
            for (r in t)
                t[r] && (t[r] = !1,
                i = 1);
            i && e.revert()
        }) || Zo()
    },
    addEventListener: function(e, t) {
        var i = Rs[e] || (Rs[e] = []);
        ~i.indexOf(t) || i.push(t)
    },
    removeEventListener: function(e, t) {
        var i = Rs[e]
          , r = i && i.indexOf(t);
        r >= 0 && i.splice(r, 1)
    },
    utils: {
        wrap: dd,
        wrapYoyo: fd,
        distribute: $c,
        random: zc,
        snap: Fc,
        normalize: hd,
        getUnit: lt,
        clamp: ad,
        splitColor: Uc,
        toArray: Yt,
        selector: Ko,
        mapRange: Bc,
        pipe: cd,
        unitize: ud,
        interpolate: pd,
        shuffle: Ic
    },
    install: Sc,
    effects: wo,
    ticker: It,
    updateRoot: _t.updateRoot,
    plugins: Nt,
    globalTimeline: _e,
    core: {
        PropTween: Et,
        globals: kc,
        Tween: Ie,
        Timeline: _t,
        Animation: Zr,
        getCache: Cn,
        _removeLinkedListItem: co,
        reverting: function() {
            return ct
        },
        context: function(e) {
            return e && ye && (ye.data.push(e),
            e._ctx = ye),
            ye
        },
        suppressOverwrites: function(e) {
            return Da = e
        }
    }
};
Ct("to,from,fromTo,delayedCall,set,killTweensOf", function(n) {
    return Gs[n] = Ie[n]
});
It.add(_t.updateRoot);
Zn = Gs.to({}, {
    duration: 0
});
var Nd = function(e, t) {
    for (var i = e._pt; i && i.p !== t && i.op !== t && i.fp !== t; )
        i = i._next;
    return i
}
  , Id = function(e, t) {
    var i = e._targets, r, s, o;
    for (r in t)
        for (s = i.length; s--; )
            o = e._ptLookup[s][r],
            o && (o = o.d) && (o._pt && (o = Nd(o, r)),
            o && o.modifier && o.modifier(t[r], e, i[s], r))
}
  , Co = function(e, t) {
    return {
        name: e,
        rawVars: 1,
        init: function(r, s, o) {
            o._onInit = function(a) {
                var l, c;
                if (Ge(s) && (l = {},
                Ct(s, function(u) {
                    return l[u] = 1
                }),
                s = l),
                t) {
                    l = {};
                    for (c in s)
                        l[c] = t(s[c]);
                    s = l
                }
                Id(a, s)
            }
        }
    }
}
  , At = Gs.registerPlugin({
    name: "attr",
    init: function(e, t, i, r, s) {
        var o, a, l;
        this.tween = i;
        for (o in t)
            l = e.getAttribute(o) || "",
            a = this.add(e, "setAttribute", (l || 0) + "", t[o], r, s, 0, 0, o),
            a.op = o,
            a.b = l,
            this._props.push(o)
    },
    render: function(e, t) {
        for (var i = t._pt; i; )
            ct ? i.set(i.t, i.p, i.b, i) : i.r(e, i.d),
            i = i._next
    }
}, {
    name: "endArray",
    init: function(e, t) {
        for (var i = t.length; i--; )
            this.add(e, i, e[i] || 0, t[i], 0, 0, 0, 0, 0, 1)
    }
}, Co("roundProps", Qo), Co("modifiers"), Co("snap", Fc)) || Gs;
Ie.version = _t.version = At.version = "3.12.5";
Tc = 1;
Na() && dr();
ne.Power0;
ne.Power1;
ne.Power2;
ne.Power3;
ne.Power4;
ne.Linear;
ne.Quad;
ne.Cubic;
ne.Quart;
ne.Quint;
ne.Strong;
ne.Elastic;
ne.Back;
ne.SteppedEase;
ne.Bounce;
ne.Sine;
ne.Expo;
ne.Circ;
/*!
 * CSSPlugin 3.12.5
 * https://gsap.com
 *
 * Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
var xl, Gi, nr, Wa, bn, Tl, Ya, $d = function() {
    return typeof window < "u"
}, Di = {}, gn = 180 / Math.PI, rr = Math.PI / 180, Vn = Math.atan2, Sl = 1e8, Xa = /([A-Z])/g, Fd = /(left|right|width|margin|padding|x)/i, zd = /[\s,\(]\S/, mi = {
    autoAlpha: "opacity,visibility",
    scale: "scaleX,scaleY",
    alpha: "opacity"
}, ea = function(e, t) {
    return t.set(t.t, t.p, Math.round((t.s + t.c * e) * 1e4) / 1e4 + t.u, t)
}, qd = function(e, t) {
    return t.set(t.t, t.p, e === 1 ? t.e : Math.round((t.s + t.c * e) * 1e4) / 1e4 + t.u, t)
}, Bd = function(e, t) {
    return t.set(t.t, t.p, e ? Math.round((t.s + t.c * e) * 1e4) / 1e4 + t.u : t.b, t)
}, Hd = function(e, t) {
    var i = t.s + t.c * e;
    t.set(t.t, t.p, ~~(i + (i < 0 ? -.5 : .5)) + t.u, t)
}, su = function(e, t) {
    return t.set(t.t, t.p, e ? t.e : t.b, t)
}, ou = function(e, t) {
    return t.set(t.t, t.p, e !== 1 ? t.b : t.e, t)
}, jd = function(e, t, i) {
    return e.style[t] = i
}, Ud = function(e, t, i) {
    return e.style.setProperty(t, i)
}, Vd = function(e, t, i) {
    return e._gsap[t] = i
}, Wd = function(e, t, i) {
    return e._gsap.scaleX = e._gsap.scaleY = i
}, Yd = function(e, t, i, r, s) {
    var o = e._gsap;
    o.scaleX = o.scaleY = i,
    o.renderTransform(s, o)
}, Xd = function(e, t, i, r, s) {
    var o = e._gsap;
    o[t] = i,
    o.renderTransform(s, o)
}, we = "transform", Pt = we + "Origin", Gd = function n(e, t) {
    var i = this
      , r = this.target
      , s = r.style
      , o = r._gsap;
    if (e in Di && s) {
        if (this.tfm = this.tfm || {},
        e !== "transform")
            e = mi[e] || e,
            ~e.indexOf(",") ? e.split(",").forEach(function(a) {
                return i.tfm[a] = Ei(r, a)
            }) : this.tfm[e] = o.x ? o[e] : Ei(r, e),
            e === Pt && (this.tfm.zOrigin = o.zOrigin);
        else
            return mi.transform.split(",").forEach(function(a) {
                return n.call(i, a, t)
            });
        if (this.props.indexOf(we) >= 0)
            return;
        o.svg && (this.svgo = r.getAttribute("data-svg-origin"),
        this.props.push(Pt, t, "")),
        e = we
    }
    (s || t) && this.props.push(e, t, s[e])
}, au = function(e) {
    e.translate && (e.removeProperty("translate"),
    e.removeProperty("scale"),
    e.removeProperty("rotate"))
}, Kd = function() {
    var e = this.props, t = this.target, i = t.style, r = t._gsap, s, o;
    for (s = 0; s < e.length; s += 3)
        e[s + 1] ? t[e[s]] = e[s + 2] : e[s + 2] ? i[e[s]] = e[s + 2] : i.removeProperty(e[s].substr(0, 2) === "--" ? e[s] : e[s].replace(Xa, "-$1").toLowerCase());
    if (this.tfm) {
        for (o in this.tfm)
            r[o] = this.tfm[o];
        r.svg && (r.renderTransform(),
        t.setAttribute("data-svg-origin", this.svgo || "")),
        s = Ya(),
        (!s || !s.isStart) && !i[we] && (au(i),
        r.zOrigin && i[Pt] && (i[Pt] += " " + r.zOrigin + "px",
        r.zOrigin = 0,
        r.renderTransform()),
        r.uncache = 1)
    }
}, lu = function(e, t) {
    var i = {
        target: e,
        props: [],
        revert: Kd,
        save: Gd
    };
    return e._gsap || At.core.getCache(e),
    t && t.split(",").forEach(function(r) {
        return i.save(r)
    }),
    i
}, cu, ta = function(e, t) {
    var i = Gi.createElementNS ? Gi.createElementNS((t || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), e) : Gi.createElement(e);
    return i && i.style ? i : Gi.createElement(e)
}, bi = function n(e, t, i) {
    var r = getComputedStyle(e);
    return r[t] || r.getPropertyValue(t.replace(Xa, "-$1").toLowerCase()) || r.getPropertyValue(t) || !i && n(e, fr(t) || t, 1) || ""
}, kl = "O,Moz,ms,Ms,Webkit".split(","), fr = function(e, t, i) {
    var r = t || bn
      , s = r.style
      , o = 5;
    if (e in s && !i)
        return e;
    for (e = e.charAt(0).toUpperCase() + e.substr(1); o-- && !(kl[o] + e in s); )
        ;
    return o < 0 ? null : (o === 3 ? "ms" : o >= 0 ? kl[o] : "") + e
}, ia = function() {
    $d() && window.document && (xl = window,
    Gi = xl.document,
    nr = Gi.documentElement,
    bn = ta("div") || {
        style: {}
    },
    ta("div"),
    we = fr(we),
    Pt = we + "Origin",
    bn.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0",
    cu = !!fr("perspective"),
    Ya = At.core.reverting,
    Wa = 1)
}, Eo = function n(e) {
    var t = ta("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), i = this.parentNode, r = this.nextSibling, s = this.style.cssText, o;
    if (nr.appendChild(t),
    t.appendChild(this),
    this.style.display = "block",
    e)
        try {
            o = this.getBBox(),
            this._gsapBBox = this.getBBox,
            this.getBBox = n
        } catch {}
    else
        this._gsapBBox && (o = this._gsapBBox());
    return i && (r ? i.insertBefore(this, r) : i.appendChild(this)),
    nr.removeChild(t),
    this.style.cssText = s,
    o
}, Cl = function(e, t) {
    for (var i = t.length; i--; )
        if (e.hasAttribute(t[i]))
            return e.getAttribute(t[i])
}, uu = function(e) {
    var t;
    try {
        t = e.getBBox()
    } catch {
        t = Eo.call(e, !0)
    }
    return t && (t.width || t.height) || e.getBBox === Eo || (t = Eo.call(e, !0)),
    t && !t.width && !t.x && !t.y ? {
        x: +Cl(e, ["x", "cx", "x1"]) || 0,
        y: +Cl(e, ["y", "cy", "y1"]) || 0,
        width: 0,
        height: 0
    } : t
}, hu = function(e) {
    return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && uu(e))
}, Rn = function(e, t) {
    if (t) {
        var i = e.style, r;
        t in Di && t !== Pt && (t = we),
        i.removeProperty ? (r = t.substr(0, 2),
        (r === "ms" || t.substr(0, 6) === "webkit") && (t = "-" + t),
        i.removeProperty(r === "--" ? t : t.replace(Xa, "-$1").toLowerCase())) : i.removeAttribute(t)
    }
}, Ki = function(e, t, i, r, s, o) {
    var a = new Et(e._pt,t,i,0,1,o ? ou : su);
    return e._pt = a,
    a.b = r,
    a.e = s,
    e._props.push(i),
    a
}, El = {
    deg: 1,
    rad: 1,
    turn: 1
}, Qd = {
    grid: 1,
    flex: 1
}, sn = function n(e, t, i, r) {
    var s = parseFloat(i) || 0, o = (i + "").trim().substr((s + "").length) || "px", a = bn.style, l = Fd.test(t), c = e.tagName.toLowerCase() === "svg", u = (c ? "client" : "offset") + (l ? "Width" : "Height"), p = 100, d = r === "px", h = r === "%", m, f, w, _;
    if (r === o || !s || El[r] || El[o])
        return s;
    if (o !== "px" && !d && (s = n(e, t, i, "px")),
    _ = e.getCTM && hu(e),
    (h || o === "%") && (Di[t] || ~t.indexOf("adius")))
        return m = _ ? e.getBBox()[l ? "width" : "height"] : e[u],
        Me(h ? s / m * p : s / 100 * m);
    if (a[l ? "width" : "height"] = p + (d ? o : r),
    f = ~t.indexOf("adius") || r === "em" && e.appendChild && !c ? e : e.parentNode,
    _ && (f = (e.ownerSVGElement || {}).parentNode),
    (!f || f === Gi || !f.appendChild) && (f = Gi.body),
    w = f._gsap,
    w && h && w.width && l && w.time === It.time && !w.uncache)
        return Me(s / w.width * p);
    if (h && (t === "height" || t === "width")) {
        var v = e.style[t];
        e.style[t] = p + r,
        m = e[u],
        v ? e.style[t] = v : Rn(e, t)
    } else
        (h || o === "%") && !Qd[bi(f, "display")] && (a.position = bi(e, "position")),
        f === e && (a.position = "static"),
        f.appendChild(bn),
        m = bn[u],
        f.removeChild(bn),
        a.position = "absolute";
    return l && h && (w = Cn(f),
    w.time = It.time,
    w.width = f[u]),
    Me(d ? m * s / p : m && s ? p / m * s : 0)
}, Ei = function(e, t, i, r) {
    var s;
    return Wa || ia(),
    t in mi && t !== "transform" && (t = mi[t],
    ~t.indexOf(",") && (t = t.split(",")[0])),
    Di[t] && t !== "transform" ? (s = ts(e, r),
    s = t !== "transformOrigin" ? s[t] : s.svg ? s.origin : Qs(bi(e, Pt)) + " " + s.zOrigin + "px") : (s = e.style[t],
    (!s || s === "auto" || r || ~(s + "").indexOf("calc(")) && (s = Ks[t] && Ks[t](e, t, i) || bi(e, t) || Ec(e, t) || (t === "opacity" ? 1 : 0))),
    i && !~(s + "").trim().indexOf(" ") ? sn(e, t, s, i) + i : s
}, Jd = function(e, t, i, r) {
    if (!i || i === "none") {
        var s = fr(t, e, 1)
          , o = s && bi(e, s, 1);
        o && o !== i ? (t = s,
        i = o) : t === "borderColor" && (i = bi(e, "borderTopColor"))
    }
    var a = new Et(this._pt,e.style,t,0,1,iu), l = 0, c = 0, u, p, d, h, m, f, w, _, v, b, y, x;
    if (a.b = i,
    a.e = r,
    i += "",
    r += "",
    r === "auto" && (f = e.style[t],
    e.style[t] = r,
    r = bi(e, t) || r,
    f ? e.style[t] = f : Rn(e, t)),
    u = [i, r],
    Wc(u),
    i = u[0],
    r = u[1],
    d = i.match(Jn) || [],
    x = r.match(Jn) || [],
    x.length) {
        for (; p = Jn.exec(r); )
            w = p[0],
            v = r.substring(l, p.index),
            m ? m = (m + 1) % 5 : (v.substr(-5) === "rgba(" || v.substr(-5) === "hsla(") && (m = 1),
            w !== (f = d[c++] || "") && (h = parseFloat(f) || 0,
            y = f.substr((h + "").length),
            w.charAt(1) === "=" && (w = ir(h, w) + y),
            _ = parseFloat(w),
            b = w.substr((_ + "").length),
            l = Jn.lastIndex - b.length,
            b || (b = b || zt.units[t] || y,
            l === r.length && (r += b,
            a.e += b)),
            y !== b && (h = sn(e, t, f, b) || 0),
            a._pt = {
                _next: a._pt,
                p: v || c === 1 ? v : ",",
                s: h,
                c: _ - h,
                m: m && m < 4 || t === "zIndex" ? Math.round : 0
            });
        a.c = l < r.length ? r.substring(l, r.length) : ""
    } else
        a.r = t === "display" && r === "none" ? ou : su;
    return wc.test(r) && (a.e = 0),
    this._pt = a,
    a
}, Pl = {
    top: "0%",
    bottom: "100%",
    left: "0%",
    right: "100%",
    center: "50%"
}, Zd = function(e) {
    var t = e.split(" ")
      , i = t[0]
      , r = t[1] || "50%";
    return (i === "top" || i === "bottom" || r === "left" || r === "right") && (e = i,
    i = r,
    r = e),
    t[0] = Pl[i] || i,
    t[1] = Pl[r] || r,
    t.join(" ")
}, ef = function(e, t) {
    if (t.tween && t.tween._time === t.tween._dur) {
        var i = t.t, r = i.style, s = t.u, o = i._gsap, a, l, c;
        if (s === "all" || s === !0)
            r.cssText = "",
            l = 1;
        else
            for (s = s.split(","),
            c = s.length; --c > -1; )
                a = s[c],
                Di[a] && (l = 1,
                a = a === "transformOrigin" ? Pt : we),
                Rn(i, a);
        l && (Rn(i, we),
        o && (o.svg && i.removeAttribute("transform"),
        ts(i, 1),
        o.uncache = 1,
        au(r)))
    }
}, Ks = {
    clearProps: function(e, t, i, r, s) {
        if (s.data !== "isFromStart") {
            var o = e._pt = new Et(e._pt,t,i,0,0,ef);
            return o.u = r,
            o.pr = -10,
            o.tween = s,
            e._props.push(i),
            1
        }
    }
}, es = [1, 0, 0, 1, 0, 0], du = {}, fu = function(e) {
    return e === "matrix(1, 0, 0, 1, 0, 0)" || e === "none" || !e
}, Al = function(e) {
    var t = bi(e, we);
    return fu(t) ? es : t.substr(7).match(_c).map(Me)
}, Ga = function(e, t) {
    var i = e._gsap || Cn(e), r = e.style, s = Al(e), o, a, l, c;
    return i.svg && e.getAttribute("transform") ? (l = e.transform.baseVal.consolidate().matrix,
    s = [l.a, l.b, l.c, l.d, l.e, l.f],
    s.join(",") === "1,0,0,1,0,0" ? es : s) : (s === es && !e.offsetParent && e !== nr && !i.svg && (l = r.display,
    r.display = "block",
    o = e.parentNode,
    (!o || !e.offsetParent) && (c = 1,
    a = e.nextElementSibling,
    nr.appendChild(e)),
    s = Al(e),
    l ? r.display = l : Rn(e, "display"),
    c && (a ? o.insertBefore(e, a) : o ? o.appendChild(e) : nr.removeChild(e))),
    t && s.length > 6 ? [s[0], s[1], s[4], s[5], s[12], s[13]] : s)
}, na = function(e, t, i, r, s, o) {
    var a = e._gsap, l = s || Ga(e, !0), c = a.xOrigin || 0, u = a.yOrigin || 0, p = a.xOffset || 0, d = a.yOffset || 0, h = l[0], m = l[1], f = l[2], w = l[3], _ = l[4], v = l[5], b = t.split(" "), y = parseFloat(b[0]) || 0, x = parseFloat(b[1]) || 0, k, T, M, E;
    i ? l !== es && (T = h * w - m * f) && (M = y * (w / T) + x * (-f / T) + (f * v - w * _) / T,
    E = y * (-m / T) + x * (h / T) - (h * v - m * _) / T,
    y = M,
    x = E) : (k = uu(e),
    y = k.x + (~b[0].indexOf("%") ? y / 100 * k.width : y),
    x = k.y + (~(b[1] || b[0]).indexOf("%") ? x / 100 * k.height : x)),
    r || r !== !1 && a.smooth ? (_ = y - c,
    v = x - u,
    a.xOffset = p + (_ * h + v * f) - _,
    a.yOffset = d + (_ * m + v * w) - v) : a.xOffset = a.yOffset = 0,
    a.xOrigin = y,
    a.yOrigin = x,
    a.smooth = !!r,
    a.origin = t,
    a.originIsAbsolute = !!i,
    e.style[Pt] = "0px 0px",
    o && (Ki(o, a, "xOrigin", c, y),
    Ki(o, a, "yOrigin", u, x),
    Ki(o, a, "xOffset", p, a.xOffset),
    Ki(o, a, "yOffset", d, a.yOffset)),
    e.setAttribute("data-svg-origin", y + " " + x)
}, ts = function(e, t) {
    var i = e._gsap || new Kc(e);
    if ("x"in i && !t && !i.uncache)
        return i;
    var r = e.style, s = i.scaleX < 0, o = "px", a = "deg", l = getComputedStyle(e), c = bi(e, Pt) || "0", u, p, d, h, m, f, w, _, v, b, y, x, k, T, M, E, C, N, A, $, L, B, W, z, Q, V, S, ce, $e, Kt, xe, Ke;
    return u = p = d = f = w = _ = v = b = y = 0,
    h = m = 1,
    i.svg = !!(e.getCTM && hu(e)),
    l.translate && ((l.translate !== "none" || l.scale !== "none" || l.rotate !== "none") && (r[we] = (l.translate !== "none" ? "translate3d(" + (l.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (l.rotate !== "none" ? "rotate(" + l.rotate + ") " : "") + (l.scale !== "none" ? "scale(" + l.scale.split(" ").join(",") + ") " : "") + (l[we] !== "none" ? l[we] : "")),
    r.scale = r.rotate = r.translate = "none"),
    T = Ga(e, i.svg),
    i.svg && (i.uncache ? (Q = e.getBBox(),
    c = i.xOrigin - Q.x + "px " + (i.yOrigin - Q.y) + "px",
    z = "") : z = !t && e.getAttribute("data-svg-origin"),
    na(e, z || c, !!z || i.originIsAbsolute, i.smooth !== !1, T)),
    x = i.xOrigin || 0,
    k = i.yOrigin || 0,
    T !== es && (N = T[0],
    A = T[1],
    $ = T[2],
    L = T[3],
    u = B = T[4],
    p = W = T[5],
    T.length === 6 ? (h = Math.sqrt(N * N + A * A),
    m = Math.sqrt(L * L + $ * $),
    f = N || A ? Vn(A, N) * gn : 0,
    v = $ || L ? Vn($, L) * gn + f : 0,
    v && (m *= Math.abs(Math.cos(v * rr))),
    i.svg && (u -= x - (x * N + k * $),
    p -= k - (x * A + k * L))) : (Ke = T[6],
    Kt = T[7],
    S = T[8],
    ce = T[9],
    $e = T[10],
    xe = T[11],
    u = T[12],
    p = T[13],
    d = T[14],
    M = Vn(Ke, $e),
    w = M * gn,
    M && (E = Math.cos(-M),
    C = Math.sin(-M),
    z = B * E + S * C,
    Q = W * E + ce * C,
    V = Ke * E + $e * C,
    S = B * -C + S * E,
    ce = W * -C + ce * E,
    $e = Ke * -C + $e * E,
    xe = Kt * -C + xe * E,
    B = z,
    W = Q,
    Ke = V),
    M = Vn(-$, $e),
    _ = M * gn,
    M && (E = Math.cos(-M),
    C = Math.sin(-M),
    z = N * E - S * C,
    Q = A * E - ce * C,
    V = $ * E - $e * C,
    xe = L * C + xe * E,
    N = z,
    A = Q,
    $ = V),
    M = Vn(A, N),
    f = M * gn,
    M && (E = Math.cos(M),
    C = Math.sin(M),
    z = N * E + A * C,
    Q = B * E + W * C,
    A = A * E - N * C,
    W = W * E - B * C,
    N = z,
    B = Q),
    w && Math.abs(w) + Math.abs(f) > 359.9 && (w = f = 0,
    _ = 180 - _),
    h = Me(Math.sqrt(N * N + A * A + $ * $)),
    m = Me(Math.sqrt(W * W + Ke * Ke)),
    M = Vn(B, W),
    v = Math.abs(M) > 2e-4 ? M * gn : 0,
    y = xe ? 1 / (xe < 0 ? -xe : xe) : 0),
    i.svg && (z = e.getAttribute("transform"),
    i.forceCSS = e.setAttribute("transform", "") || !fu(bi(e, we)),
    z && e.setAttribute("transform", z))),
    Math.abs(v) > 90 && Math.abs(v) < 270 && (s ? (h *= -1,
    v += f <= 0 ? 180 : -180,
    f += f <= 0 ? 180 : -180) : (m *= -1,
    v += v <= 0 ? 180 : -180)),
    t = t || i.uncache,
    i.x = u - ((i.xPercent = u && (!t && i.xPercent || (Math.round(e.offsetWidth / 2) === Math.round(-u) ? -50 : 0))) ? e.offsetWidth * i.xPercent / 100 : 0) + o,
    i.y = p - ((i.yPercent = p && (!t && i.yPercent || (Math.round(e.offsetHeight / 2) === Math.round(-p) ? -50 : 0))) ? e.offsetHeight * i.yPercent / 100 : 0) + o,
    i.z = d + o,
    i.scaleX = Me(h),
    i.scaleY = Me(m),
    i.rotation = Me(f) + a,
    i.rotationX = Me(w) + a,
    i.rotationY = Me(_) + a,
    i.skewX = v + a,
    i.skewY = b + a,
    i.transformPerspective = y + o,
    (i.zOrigin = parseFloat(c.split(" ")[2]) || !t && i.zOrigin || 0) && (r[Pt] = Qs(c)),
    i.xOffset = i.yOffset = 0,
    i.force3D = zt.force3D,
    i.renderTransform = i.svg ? nf : cu ? pu : tf,
    i.uncache = 0,
    i
}, Qs = function(e) {
    return (e = e.split(" "))[0] + " " + e[1]
}, Po = function(e, t, i) {
    var r = lt(t);
    return Me(parseFloat(t) + parseFloat(sn(e, "x", i + "px", r))) + r
}, tf = function(e, t) {
    t.z = "0px",
    t.rotationY = t.rotationX = "0deg",
    t.force3D = 0,
    pu(e, t)
}, fn = "0deg", wr = "0px", pn = ") ", pu = function(e, t) {
    var i = t || this
      , r = i.xPercent
      , s = i.yPercent
      , o = i.x
      , a = i.y
      , l = i.z
      , c = i.rotation
      , u = i.rotationY
      , p = i.rotationX
      , d = i.skewX
      , h = i.skewY
      , m = i.scaleX
      , f = i.scaleY
      , w = i.transformPerspective
      , _ = i.force3D
      , v = i.target
      , b = i.zOrigin
      , y = ""
      , x = _ === "auto" && e && e !== 1 || _ === !0;
    if (b && (p !== fn || u !== fn)) {
        var k = parseFloat(u) * rr, T = Math.sin(k), M = Math.cos(k), E;
        k = parseFloat(p) * rr,
        E = Math.cos(k),
        o = Po(v, o, T * E * -b),
        a = Po(v, a, -Math.sin(k) * -b),
        l = Po(v, l, M * E * -b + b)
    }
    w !== wr && (y += "perspective(" + w + pn),
    (r || s) && (y += "translate(" + r + "%, " + s + "%) "),
    (x || o !== wr || a !== wr || l !== wr) && (y += l !== wr || x ? "translate3d(" + o + ", " + a + ", " + l + ") " : "translate(" + o + ", " + a + pn),
    c !== fn && (y += "rotate(" + c + pn),
    u !== fn && (y += "rotateY(" + u + pn),
    p !== fn && (y += "rotateX(" + p + pn),
    (d !== fn || h !== fn) && (y += "skew(" + d + ", " + h + pn),
    (m !== 1 || f !== 1) && (y += "scale(" + m + ", " + f + pn),
    v.style[we] = y || "translate(0, 0)"
}, nf = function(e, t) {
    var i = t || this, r = i.xPercent, s = i.yPercent, o = i.x, a = i.y, l = i.rotation, c = i.skewX, u = i.skewY, p = i.scaleX, d = i.scaleY, h = i.target, m = i.xOrigin, f = i.yOrigin, w = i.xOffset, _ = i.yOffset, v = i.forceCSS, b = parseFloat(o), y = parseFloat(a), x, k, T, M, E;
    l = parseFloat(l),
    c = parseFloat(c),
    u = parseFloat(u),
    u && (u = parseFloat(u),
    c += u,
    l += u),
    l || c ? (l *= rr,
    c *= rr,
    x = Math.cos(l) * p,
    k = Math.sin(l) * p,
    T = Math.sin(l - c) * -d,
    M = Math.cos(l - c) * d,
    c && (u *= rr,
    E = Math.tan(c - u),
    E = Math.sqrt(1 + E * E),
    T *= E,
    M *= E,
    u && (E = Math.tan(u),
    E = Math.sqrt(1 + E * E),
    x *= E,
    k *= E)),
    x = Me(x),
    k = Me(k),
    T = Me(T),
    M = Me(M)) : (x = p,
    M = d,
    k = T = 0),
    (b && !~(o + "").indexOf("px") || y && !~(a + "").indexOf("px")) && (b = sn(h, "x", o, "px"),
    y = sn(h, "y", a, "px")),
    (m || f || w || _) && (b = Me(b + m - (m * x + f * T) + w),
    y = Me(y + f - (m * k + f * M) + _)),
    (r || s) && (E = h.getBBox(),
    b = Me(b + r / 100 * E.width),
    y = Me(y + s / 100 * E.height)),
    E = "matrix(" + x + "," + k + "," + T + "," + M + "," + b + "," + y + ")",
    h.setAttribute("transform", E),
    v && (h.style[we] = E)
}, rf = function(e, t, i, r, s) {
    var o = 360, a = Ge(s), l = parseFloat(s) * (a && ~s.indexOf("rad") ? gn : 1), c = l - r, u = r + c + "deg", p, d;
    return a && (p = s.split("_")[1],
    p === "short" && (c %= o,
    c !== c % (o / 2) && (c += c < 0 ? o : -o)),
    p === "cw" && c < 0 ? c = (c + o * Sl) % o - ~~(c / o) * o : p === "ccw" && c > 0 && (c = (c - o * Sl) % o - ~~(c / o) * o)),
    e._pt = d = new Et(e._pt,t,i,r,c,qd),
    d.e = u,
    d.u = "deg",
    e._props.push(i),
    d
}, Ml = function(e, t) {
    for (var i in t)
        e[i] = t[i];
    return e
}, sf = function(e, t, i) {
    var r = Ml({}, i._gsap), s = "perspective,force3D,transformOrigin,svgOrigin", o = i.style, a, l, c, u, p, d, h, m;
    r.svg ? (c = i.getAttribute("transform"),
    i.setAttribute("transform", ""),
    o[we] = t,
    a = ts(i, 1),
    Rn(i, we),
    i.setAttribute("transform", c)) : (c = getComputedStyle(i)[we],
    o[we] = t,
    a = ts(i, 1),
    o[we] = c);
    for (l in Di)
        c = r[l],
        u = a[l],
        c !== u && s.indexOf(l) < 0 && (h = lt(c),
        m = lt(u),
        p = h !== m ? sn(i, l, c, m) : parseFloat(c),
        d = parseFloat(u),
        e._pt = new Et(e._pt,a,l,p,d - p,ea),
        e._pt.u = m || 0,
        e._props.push(l));
    Ml(a, r)
};
Ct("padding,margin,Width,Radius", function(n, e) {
    var t = "Top"
      , i = "Right"
      , r = "Bottom"
      , s = "Left"
      , o = (e < 3 ? [t, i, r, s] : [t + s, t + i, r + i, r + s]).map(function(a) {
        return e < 2 ? n + a : "border" + a + n
    });
    Ks[e > 1 ? "border" + n : n] = function(a, l, c, u, p) {
        var d, h;
        if (arguments.length < 4)
            return d = o.map(function(m) {
                return Ei(a, m, c)
            }),
            h = d.join(" "),
            h.split(d[0]).length === 5 ? d[0] : h;
        d = (u + "").split(" "),
        h = {},
        o.forEach(function(m, f) {
            return h[m] = d[f] = d[f] || d[(f - 1) / 2 | 0]
        }),
        a.init(l, h, p)
    }
});
var mu = {
    name: "css",
    register: ia,
    targetTest: function(e) {
        return e.style && e.nodeType
    },
    init: function(e, t, i, r, s) {
        var o = this._props, a = e.style, l = i.vars.startAt, c, u, p, d, h, m, f, w, _, v, b, y, x, k, T, M;
        Wa || ia(),
        this.styles = this.styles || lu(e),
        M = this.styles.props,
        this.tween = i;
        for (f in t)
            if (f !== "autoRound" && (u = t[f],
            !(Nt[f] && Qc(f, t, i, r, e, s)))) {
                if (h = typeof u,
                m = Ks[f],
                h === "function" && (u = u.call(i, r, e, s),
                h = typeof u),
                h === "string" && ~u.indexOf("random(") && (u = Qr(u)),
                m)
                    m(this, e, f, u, i) && (T = 1);
                else if (f.substr(0, 2) === "--")
                    c = (getComputedStyle(e).getPropertyValue(f) + "").trim(),
                    u += "",
                    tn.lastIndex = 0,
                    tn.test(c) || (w = lt(c),
                    _ = lt(u)),
                    _ ? w !== _ && (c = sn(e, f, c, _) + _) : w && (u += w),
                    this.add(a, "setProperty", c, u, r, s, 0, 0, f),
                    o.push(f),
                    M.push(f, 0, a[f]);
                else if (h !== "undefined") {
                    if (l && f in l ? (c = typeof l[f] == "function" ? l[f].call(i, r, e, s) : l[f],
                    Ge(c) && ~c.indexOf("random(") && (c = Qr(c)),
                    lt(c + "") || c === "auto" || (c += zt.units[f] || lt(Ei(e, f)) || ""),
                    (c + "").charAt(1) === "=" && (c = Ei(e, f))) : c = Ei(e, f),
                    d = parseFloat(c),
                    v = h === "string" && u.charAt(1) === "=" && u.substr(0, 2),
                    v && (u = u.substr(2)),
                    p = parseFloat(u),
                    f in mi && (f === "autoAlpha" && (d === 1 && Ei(e, "visibility") === "hidden" && p && (d = 0),
                    M.push("visibility", 0, a.visibility),
                    Ki(this, a, "visibility", d ? "inherit" : "hidden", p ? "inherit" : "hidden", !p)),
                    f !== "scale" && f !== "transform" && (f = mi[f],
                    ~f.indexOf(",") && (f = f.split(",")[0]))),
                    b = f in Di,
                    b) {
                        if (this.styles.save(f),
                        y || (x = e._gsap,
                        x.renderTransform && !t.parseTransform || ts(e, t.parseTransform),
                        k = t.smoothOrigin !== !1 && x.smooth,
                        y = this._pt = new Et(this._pt,a,we,0,1,x.renderTransform,x,0,-1),
                        y.dep = 1),
                        f === "scale")
                            this._pt = new Et(this._pt,x,"scaleY",x.scaleY,(v ? ir(x.scaleY, v + p) : p) - x.scaleY || 0,ea),
                            this._pt.u = 0,
                            o.push("scaleY", f),
                            f += "X";
                        else if (f === "transformOrigin") {
                            M.push(Pt, 0, a[Pt]),
                            u = Zd(u),
                            x.svg ? na(e, u, 0, k, 0, this) : (_ = parseFloat(u.split(" ")[2]) || 0,
                            _ !== x.zOrigin && Ki(this, x, "zOrigin", x.zOrigin, _),
                            Ki(this, a, f, Qs(c), Qs(u)));
                            continue
                        } else if (f === "svgOrigin") {
                            na(e, u, 1, k, 0, this);
                            continue
                        } else if (f in du) {
                            rf(this, x, f, d, v ? ir(d, v + u) : u);
                            continue
                        } else if (f === "smoothOrigin") {
                            Ki(this, x, "smooth", x.smooth, u);
                            continue
                        } else if (f === "force3D") {
                            x[f] = u;
                            continue
                        } else if (f === "transform") {
                            sf(this, u, e);
                            continue
                        }
                    } else
                        f in a || (f = fr(f) || f);
                    if (b || (p || p === 0) && (d || d === 0) && !zd.test(u) && f in a)
                        w = (c + "").substr((d + "").length),
                        p || (p = 0),
                        _ = lt(u) || (f in zt.units ? zt.units[f] : w),
                        w !== _ && (d = sn(e, f, c, _)),
                        this._pt = new Et(this._pt,b ? x : a,f,d,(v ? ir(d, v + p) : p) - d,!b && (_ === "px" || f === "zIndex") && t.autoRound !== !1 ? Hd : ea),
                        this._pt.u = _ || 0,
                        w !== _ && _ !== "%" && (this._pt.b = c,
                        this._pt.r = Bd);
                    else if (f in a)
                        Jd.call(this, e, f, c, v ? v + u : u);
                    else if (f in e)
                        this.add(e, f, c || e[f], v ? v + u : u, r, s);
                    else if (f !== "parseTransform") {
                        $a(f, u);
                        continue
                    }
                    b || (f in a ? M.push(f, 0, a[f]) : M.push(f, 1, c || e[f])),
                    o.push(f)
                }
            }
        T && nu(this)
    },
    render: function(e, t) {
        if (t.tween._time || !Ya())
            for (var i = t._pt; i; )
                i.r(e, i.d),
                i = i._next;
        else
            t.styles.revert()
    },
    get: Ei,
    aliases: mi,
    getSetter: function(e, t, i) {
        var r = mi[t];
        return r && r.indexOf(",") < 0 && (t = r),
        t in Di && t !== Pt && (e._gsap.x || Ei(e, "x")) ? i && Tl === i ? t === "scale" ? Wd : Vd : (Tl = i || {}) && (t === "scale" ? Yd : Xd) : e.style && !Ra(e.style[t]) ? jd : ~t.indexOf("-") ? Ud : Ua(e, t)
    },
    core: {
        _removeProperty: Rn,
        _getMatrix: Ga
    }
};
At.utils.checkPrefix = fr;
At.core.getStyleSaver = lu;
(function(n, e, t, i) {
    var r = Ct(n + "," + e + "," + t, function(s) {
        Di[s] = 1
    });
    Ct(e, function(s) {
        zt.units[s] = "deg",
        du[s] = 1
    }),
    mi[r[13]] = n + "," + e,
    Ct(i, function(s) {
        var o = s.split(":");
        mi[o[1]] = r[o[0]]
    })
}
)("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
Ct("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(n) {
    zt.units[n] = "px"
});
At.registerPlugin(mu);
var F = At.registerPlugin(mu) || At;
F.core.Tween;
function of(n, e) {
    for (var t = 0; t < e.length; t++) {
        var i = e[t];
        i.enumerable = i.enumerable || !1,
        i.configurable = !0,
        "value"in i && (i.writable = !0),
        Object.defineProperty(n, i.key, i)
    }
}
function af(n, e, t) {
    return e && of(n.prototype, e),
    n
}
/*!
 * Observer 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
var et, Ns, $t, Qi, Ji, sr, gu, yn, Fr, yu, Ai, ni, vu, bu = function() {
    return et || typeof window < "u" && (et = window.gsap) && et.registerPlugin && et
}, _u = 1, er = [], ee = [], _i = [], zr = Date.now, ra = function(e, t) {
    return t
}, lf = function() {
    var e = Fr.core
      , t = e.bridge || {}
      , i = e._scrollers
      , r = e._proxies;
    i.push.apply(i, ee),
    r.push.apply(r, _i),
    ee = i,
    _i = r,
    ra = function(o, a) {
        return t[o](a)
    }
}, nn = function(e, t) {
    return ~_i.indexOf(e) && _i[_i.indexOf(e) + 1][t]
}, qr = function(e) {
    return !!~yu.indexOf(e)
}, mt = function(e, t, i, r, s) {
    return e.addEventListener(t, i, {
        passive: r !== !1,
        capture: !!s
    })
}, pt = function(e, t, i, r) {
    return e.removeEventListener(t, i, !!r)
}, bs = "scrollLeft", _s = "scrollTop", sa = function() {
    return Ai && Ai.isPressed || ee.cache++
}, Js = function(e, t) {
    var i = function r(s) {
        if (s || s === 0) {
            _u && ($t.history.scrollRestoration = "manual");
            var o = Ai && Ai.isPressed;
            s = r.v = Math.round(s) || (Ai && Ai.iOS ? 1 : 0),
            e(s),
            r.cacheID = ee.cache,
            o && ra("ss", s)
        } else
            (t || ee.cache !== r.cacheID || ra("ref")) && (r.cacheID = ee.cache,
            r.v = e());
        return r.v + r.offset
    };
    return i.offset = 0,
    e && i
}, wt = {
    s: bs,
    p: "left",
    p2: "Left",
    os: "right",
    os2: "Right",
    d: "width",
    d2: "Width",
    a: "x",
    sc: Js(function(n) {
        return arguments.length ? $t.scrollTo(n, Be.sc()) : $t.pageXOffset || Qi[bs] || Ji[bs] || sr[bs] || 0
    })
}, Be = {
    s: _s,
    p: "top",
    p2: "Top",
    os: "bottom",
    os2: "Bottom",
    d: "height",
    d2: "Height",
    a: "y",
    op: wt,
    sc: Js(function(n) {
        return arguments.length ? $t.scrollTo(wt.sc(), n) : $t.pageYOffset || Qi[_s] || Ji[_s] || sr[_s] || 0
    })
}, St = function(e, t) {
    return (t && t._ctx && t._ctx.selector || et.utils.toArray)(e)[0] || (typeof e == "string" && et.config().nullTargetWarn !== !1 ? console.warn("Element not found:", e) : null)
}, on = function(e, t) {
    var i = t.s
      , r = t.sc;
    qr(e) && (e = Qi.scrollingElement || Ji);
    var s = ee.indexOf(e)
      , o = r === Be.sc ? 1 : 2;
    !~s && (s = ee.push(e) - 1),
    ee[s + o] || mt(e, "scroll", sa);
    var a = ee[s + o]
      , l = a || (ee[s + o] = Js(nn(e, i), !0) || (qr(e) ? r : Js(function(c) {
        return arguments.length ? e[i] = c : e[i]
    })));
    return l.target = e,
    a || (l.smooth = et.getProperty(e, "scrollBehavior") === "smooth"),
    l
}, oa = function(e, t, i) {
    var r = e
      , s = e
      , o = zr()
      , a = o
      , l = t || 50
      , c = Math.max(500, l * 3)
      , u = function(m, f) {
        var w = zr();
        f || w - o > l ? (s = r,
        r = m,
        a = o,
        o = w) : i ? r += m : r = s + (m - s) / (w - a) * (o - a)
    }
      , p = function() {
        s = r = i ? 0 : r,
        a = o = 0
    }
      , d = function(m) {
        var f = a
          , w = s
          , _ = zr();
        return (m || m === 0) && m !== r && u(m),
        o === a || _ - a > c ? 0 : (r + (i ? w : -w)) / ((i ? _ : o) - f) * 1e3
    };
    return {
        update: u,
        reset: p,
        getVelocity: d
    }
}, xr = function(e, t) {
    return t && !e._gsapAllow && e.preventDefault(),
    e.changedTouches ? e.changedTouches[0] : e
}, Ol = function(e) {
    var t = Math.max.apply(Math, e)
      , i = Math.min.apply(Math, e);
    return Math.abs(t) >= Math.abs(i) ? t : i
}, wu = function() {
    Fr = et.core.globals().ScrollTrigger,
    Fr && Fr.core && lf()
}, xu = function(e) {
    return et = e || bu(),
    !Ns && et && typeof document < "u" && document.body && ($t = window,
    Qi = document,
    Ji = Qi.documentElement,
    sr = Qi.body,
    yu = [$t, Qi, Ji, sr],
    et.utils.clamp,
    vu = et.core.context || function() {}
    ,
    yn = "onpointerenter"in sr ? "pointer" : "mouse",
    gu = Oe.isTouch = $t.matchMedia && $t.matchMedia("(hover: none), (pointer: coarse)").matches ? 1 : "ontouchstart"in $t || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ? 2 : 0,
    ni = Oe.eventTypes = ("ontouchstart"in Ji ? "touchstart,touchmove,touchcancel,touchend" : "onpointerdown"in Ji ? "pointerdown,pointermove,pointercancel,pointerup" : "mousedown,mousemove,mouseup,mouseup").split(","),
    setTimeout(function() {
        return _u = 0
    }, 500),
    wu(),
    Ns = 1),
    Ns
};
wt.op = Be;
ee.cache = 0;
var Oe = function() {
    function n(t) {
        this.init(t)
    }
    var e = n.prototype;
    return e.init = function(i) {
        Ns || xu(et) || console.warn("Please gsap.registerPlugin(Observer)"),
        Fr || wu();
        var r = i.tolerance
          , s = i.dragMinimum
          , o = i.type
          , a = i.target
          , l = i.lineHeight
          , c = i.debounce
          , u = i.preventDefault
          , p = i.onStop
          , d = i.onStopDelay
          , h = i.ignore
          , m = i.wheelSpeed
          , f = i.event
          , w = i.onDragStart
          , _ = i.onDragEnd
          , v = i.onDrag
          , b = i.onPress
          , y = i.onRelease
          , x = i.onRight
          , k = i.onLeft
          , T = i.onUp
          , M = i.onDown
          , E = i.onChangeX
          , C = i.onChangeY
          , N = i.onChange
          , A = i.onToggleX
          , $ = i.onToggleY
          , L = i.onHover
          , B = i.onHoverEnd
          , W = i.onMove
          , z = i.ignoreCheck
          , Q = i.isNormalizer
          , V = i.onGestureStart
          , S = i.onGestureEnd
          , ce = i.onWheel
          , $e = i.onEnable
          , Kt = i.onDisable
          , xe = i.onClick
          , Ke = i.scrollSpeed
          , ht = i.capture
          , Le = i.allowClicks
          , dt = i.lockAxis
          , tt = i.onLockAxis;
        this.target = a = St(a) || Ji,
        this.vars = i,
        h && (h = et.utils.toArray(h)),
        r = r || 1e-9,
        s = s || 0,
        m = m || 1,
        Ke = Ke || 1,
        o = o || "wheel,touch,pointer",
        c = c !== !1,
        l || (l = parseFloat($t.getComputedStyle(sr).lineHeight) || 22);
        var Ii, ft, Qt, se, ke, Tt, Mt, P = this, Ot = 0, Ti = 0, $i = i.passive || !u, De = on(a, wt), Fi = on(a, Be), ln = De(), Bn = Fi(), He = ~o.indexOf("touch") && !~o.indexOf("pointer") && ni[0] === "pointerdown", zi = qr(a), Ce = a.ownerDocument || Qi, Jt = [0, 0, 0], Bt = [0, 0, 0], Si = 0, gr = function() {
            return Si = zr()
        }, Re = function(H, ae) {
            return (P.event = H) && h && ~h.indexOf(H.target) || ae && He && H.pointerType !== "touch" || z && z(H, ae)
        }, ms = function() {
            P._vx.reset(),
            P._vy.reset(),
            ft.pause(),
            p && p(P)
        }, qi = function() {
            var H = P.deltaX = Ol(Jt)
              , ae = P.deltaY = Ol(Bt)
              , R = Math.abs(H) >= r
              , K = Math.abs(ae) >= r;
            N && (R || K) && N(P, H, ae, Jt, Bt),
            R && (x && P.deltaX > 0 && x(P),
            k && P.deltaX < 0 && k(P),
            E && E(P),
            A && P.deltaX < 0 != Ot < 0 && A(P),
            Ot = P.deltaX,
            Jt[0] = Jt[1] = Jt[2] = 0),
            K && (M && P.deltaY > 0 && M(P),
            T && P.deltaY < 0 && T(P),
            C && C(P),
            $ && P.deltaY < 0 != Ti < 0 && $(P),
            Ti = P.deltaY,
            Bt[0] = Bt[1] = Bt[2] = 0),
            (se || Qt) && (W && W(P),
            Qt && (v(P),
            Qt = !1),
            se = !1),
            Tt && !(Tt = !1) && tt && tt(P),
            ke && (ce(P),
            ke = !1),
            Ii = 0
        }, Hn = function(H, ae, R) {
            Jt[R] += H,
            Bt[R] += ae,
            P._vx.update(H),
            P._vy.update(ae),
            c ? Ii || (Ii = requestAnimationFrame(qi)) : qi()
        }, jn = function(H, ae) {
            dt && !Mt && (P.axis = Mt = Math.abs(H) > Math.abs(ae) ? "x" : "y",
            Tt = !0),
            Mt !== "y" && (Jt[2] += H,
            P._vx.update(H, !0)),
            Mt !== "x" && (Bt[2] += ae,
            P._vy.update(ae, !0)),
            c ? Ii || (Ii = requestAnimationFrame(qi)) : qi()
        }, Bi = function(H) {
            if (!Re(H, 1)) {
                H = xr(H, u);
                var ae = H.clientX
                  , R = H.clientY
                  , K = ae - P.x
                  , q = R - P.y
                  , X = P.isDragging;
                P.x = ae,
                P.y = R,
                (X || Math.abs(P.startX - ae) >= s || Math.abs(P.startY - R) >= s) && (v && (Qt = !0),
                X || (P.isDragging = !0),
                jn(K, q),
                X || w && w(P))
            }
        }, cn = P.onPress = function(G) {
            Re(G, 1) || G && G.button || (P.axis = Mt = null,
            ft.pause(),
            P.isPressed = !0,
            G = xr(G),
            Ot = Ti = 0,
            P.startX = P.x = G.clientX,
            P.startY = P.y = G.clientY,
            P._vx.reset(),
            P._vy.reset(),
            mt(Q ? a : Ce, ni[1], Bi, $i, !0),
            P.deltaX = P.deltaY = 0,
            b && b(P))
        }
        , Z = P.onRelease = function(G) {
            if (!Re(G, 1)) {
                pt(Q ? a : Ce, ni[1], Bi, !0);
                var H = !isNaN(P.y - P.startY)
                  , ae = P.isDragging
                  , R = ae && (Math.abs(P.x - P.startX) > 3 || Math.abs(P.y - P.startY) > 3)
                  , K = xr(G);
                !R && H && (P._vx.reset(),
                P._vy.reset(),
                u && Le && et.delayedCall(.08, function() {
                    if (zr() - Si > 300 && !G.defaultPrevented) {
                        if (G.target.click)
                            G.target.click();
                        else if (Ce.createEvent) {
                            var q = Ce.createEvent("MouseEvents");
                            q.initMouseEvent("click", !0, !0, $t, 1, K.screenX, K.screenY, K.clientX, K.clientY, !1, !1, !1, !1, 0, null),
                            G.target.dispatchEvent(q)
                        }
                    }
                })),
                P.isDragging = P.isGesturing = P.isPressed = !1,
                p && ae && !Q && ft.restart(!0),
                _ && ae && _(P),
                y && y(P, R)
            }
        }
        , un = function(H) {
            return H.touches && H.touches.length > 1 && (P.isGesturing = !0) && V(H, P.isDragging)
        }, Zt = function() {
            return (P.isGesturing = !1) || S(P)
        }, ei = function(H) {
            if (!Re(H)) {
                var ae = De()
                  , R = Fi();
                Hn((ae - ln) * Ke, (R - Bn) * Ke, 1),
                ln = ae,
                Bn = R,
                p && ft.restart(!0)
            }
        }, ti = function(H) {
            if (!Re(H)) {
                H = xr(H, u),
                ce && (ke = !0);
                var ae = (H.deltaMode === 1 ? l : H.deltaMode === 2 ? $t.innerHeight : 1) * m;
                Hn(H.deltaX * ae, H.deltaY * ae, 0),
                p && !Q && ft.restart(!0)
            }
        }, hn = function(H) {
            if (!Re(H)) {
                var ae = H.clientX
                  , R = H.clientY
                  , K = ae - P.x
                  , q = R - P.y;
                P.x = ae,
                P.y = R,
                se = !0,
                p && ft.restart(!0),
                (K || q) && jn(K, q)
            }
        }, Un = function(H) {
            P.event = H,
            L(P)
        }, ki = function(H) {
            P.event = H,
            B(P)
        }, yr = function(H) {
            return Re(H) || xr(H, u) && xe(P)
        };
        ft = P._dc = et.delayedCall(d || .25, ms).pause(),
        P.deltaX = P.deltaY = 0,
        P._vx = oa(0, 50, !0),
        P._vy = oa(0, 50, !0),
        P.scrollX = De,
        P.scrollY = Fi,
        P.isDragging = P.isGesturing = P.isPressed = !1,
        vu(this),
        P.enable = function(G) {
            return P.isEnabled || (mt(zi ? Ce : a, "scroll", sa),
            o.indexOf("scroll") >= 0 && mt(zi ? Ce : a, "scroll", ei, $i, ht),
            o.indexOf("wheel") >= 0 && mt(a, "wheel", ti, $i, ht),
            (o.indexOf("touch") >= 0 && gu || o.indexOf("pointer") >= 0) && (mt(a, ni[0], cn, $i, ht),
            mt(Ce, ni[2], Z),
            mt(Ce, ni[3], Z),
            Le && mt(a, "click", gr, !0, !0),
            xe && mt(a, "click", yr),
            V && mt(Ce, "gesturestart", un),
            S && mt(Ce, "gestureend", Zt),
            L && mt(a, yn + "enter", Un),
            B && mt(a, yn + "leave", ki),
            W && mt(a, yn + "move", hn)),
            P.isEnabled = !0,
            G && G.type && cn(G),
            $e && $e(P)),
            P
        }
        ,
        P.disable = function() {
            P.isEnabled && (er.filter(function(G) {
                return G !== P && qr(G.target)
            }).length || pt(zi ? Ce : a, "scroll", sa),
            P.isPressed && (P._vx.reset(),
            P._vy.reset(),
            pt(Q ? a : Ce, ni[1], Bi, !0)),
            pt(zi ? Ce : a, "scroll", ei, ht),
            pt(a, "wheel", ti, ht),
            pt(a, ni[0], cn, ht),
            pt(Ce, ni[2], Z),
            pt(Ce, ni[3], Z),
            pt(a, "click", gr, !0),
            pt(a, "click", yr),
            pt(Ce, "gesturestart", un),
            pt(Ce, "gestureend", Zt),
            pt(a, yn + "enter", Un),
            pt(a, yn + "leave", ki),
            pt(a, yn + "move", hn),
            P.isEnabled = P.isPressed = P.isDragging = !1,
            Kt && Kt(P))
        }
        ,
        P.kill = P.revert = function() {
            P.disable();
            var G = er.indexOf(P);
            G >= 0 && er.splice(G, 1),
            Ai === P && (Ai = 0)
        }
        ,
        er.push(P),
        Q && qr(a) && (Ai = P),
        P.enable(f)
    }
    ,
    af(n, [{
        key: "velocityX",
        get: function() {
            return this._vx.getVelocity()
        }
    }, {
        key: "velocityY",
        get: function() {
            return this._vy.getVelocity()
        }
    }]),
    n
}();
Oe.version = "3.12.5";
Oe.create = function(n) {
    return new Oe(n)
}
;
Oe.register = xu;
Oe.getAll = function() {
    return er.slice()
}
;
Oe.getById = function(n) {
    return er.filter(function(e) {
        return e.vars.id === n
    })[0]
}
;
bu() && et.registerPlugin(Oe);
/*!
 * ScrollTrigger 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
var I, Kn, ie, be, si, me, Tu, Zs, is, Br, Mr, ws, ot, fo, aa, yt, Ll, Dl, Qn, Su, Ao, ku, gt, la, Cu, Eu, ji, ca, Ka, or, Qa, eo, ua, Mo, xs = 1, at = Date.now, Oo = at(), Xt = 0, Or = 0, Rl = function(e, t, i) {
    var r = Rt(e) && (e.substr(0, 6) === "clamp(" || e.indexOf("max") > -1);
    return i["_" + t + "Clamp"] = r,
    r ? e.substr(6, e.length - 7) : e
}, Nl = function(e, t) {
    return t && (!Rt(e) || e.substr(0, 6) !== "clamp(") ? "clamp(" + e + ")" : e
}, cf = function n() {
    return Or && requestAnimationFrame(n)
}, Il = function() {
    return fo = 1
}, $l = function() {
    return fo = 0
}, di = function(e) {
    return e
}, Lr = function(e) {
    return Math.round(e * 1e5) / 1e5 || 0
}, Pu = function() {
    return typeof window < "u"
}, Au = function() {
    return I || Pu() && (I = window.gsap) && I.registerPlugin && I
}, Nn = function(e) {
    return !!~Tu.indexOf(e)
}, Mu = function(e) {
    return (e === "Height" ? Qa : ie["inner" + e]) || si["client" + e] || me["client" + e]
}, Ou = function(e) {
    return nn(e, "getBoundingClientRect") || (Nn(e) ? function() {
        return qs.width = ie.innerWidth,
        qs.height = Qa,
        qs
    }
    : function() {
        return Pi(e)
    }
    )
}, uf = function(e, t, i) {
    var r = i.d
      , s = i.d2
      , o = i.a;
    return (o = nn(e, "getBoundingClientRect")) ? function() {
        return o()[r]
    }
    : function() {
        return (t ? Mu(s) : e["client" + s]) || 0
    }
}, hf = function(e, t) {
    return !t || ~_i.indexOf(e) ? Ou(e) : function() {
        return qs
    }
}, gi = function(e, t) {
    var i = t.s
      , r = t.d2
      , s = t.d
      , o = t.a;
    return Math.max(0, (i = "scroll" + r) && (o = nn(e, i)) ? o() - Ou(e)()[s] : Nn(e) ? (si[i] || me[i]) - Mu(r) : e[i] - e["offset" + r])
}, Ts = function(e, t) {
    for (var i = 0; i < Qn.length; i += 3)
        (!t || ~t.indexOf(Qn[i + 1])) && e(Qn[i], Qn[i + 1], Qn[i + 2])
}, Rt = function(e) {
    return typeof e == "string"
}, xt = function(e) {
    return typeof e == "function"
}, Dr = function(e) {
    return typeof e == "number"
}, vn = function(e) {
    return typeof e == "object"
}, Tr = function(e, t, i) {
    return e && e.progress(t ? 0 : 1) && i && e.pause()
}, Lo = function(e, t) {
    if (e.enabled) {
        var i = e._ctx ? e._ctx.add(function() {
            return t(e)
        }) : t(e);
        i && i.totalTime && (e.callbackAnimation = i)
    }
}, Wn = Math.abs, Lu = "left", Du = "top", Ja = "right", Za = "bottom", Mn = "width", On = "height", Hr = "Right", jr = "Left", Ur = "Top", Vr = "Bottom", Ne = "padding", Ut = "margin", pr = "Width", el = "Height", qe = "px", Vt = function(e) {
    return ie.getComputedStyle(e)
}, df = function(e) {
    var t = Vt(e).position;
    e.style.position = t === "absolute" || t === "fixed" ? t : "relative"
}, Fl = function(e, t) {
    for (var i in t)
        i in e || (e[i] = t[i]);
    return e
}, Pi = function(e, t) {
    var i = t && Vt(e)[aa] !== "matrix(1, 0, 0, 1, 0, 0)" && I.to(e, {
        x: 0,
        y: 0,
        xPercent: 0,
        yPercent: 0,
        rotation: 0,
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        skewX: 0,
        skewY: 0
    }).progress(1)
      , r = e.getBoundingClientRect();
    return i && i.progress(0).kill(),
    r
}, to = function(e, t) {
    var i = t.d2;
    return e["offset" + i] || e["client" + i] || 0
}, Ru = function(e) {
    var t = [], i = e.labels, r = e.duration(), s;
    for (s in i)
        t.push(i[s] / r);
    return t
}, ff = function(e) {
    return function(t) {
        return I.utils.snap(Ru(e), t)
    }
}, tl = function(e) {
    var t = I.utils.snap(e)
      , i = Array.isArray(e) && e.slice(0).sort(function(r, s) {
        return r - s
    });
    return i ? function(r, s, o) {
        o === void 0 && (o = .001);
        var a;
        if (!s)
            return t(r);
        if (s > 0) {
            for (r -= o,
            a = 0; a < i.length; a++)
                if (i[a] >= r)
                    return i[a];
            return i[a - 1]
        } else
            for (a = i.length,
            r += o; a--; )
                if (i[a] <= r)
                    return i[a];
        return i[0]
    }
    : function(r, s, o) {
        o === void 0 && (o = .001);
        var a = t(r);
        return !s || Math.abs(a - r) < o || a - r < 0 == s < 0 ? a : t(s < 0 ? r - e : r + e)
    }
}, pf = function(e) {
    return function(t, i) {
        return tl(Ru(e))(t, i.direction)
    }
}, Ss = function(e, t, i, r) {
    return i.split(",").forEach(function(s) {
        return e(t, s, r)
    })
}, Ve = function(e, t, i, r, s) {
    return e.addEventListener(t, i, {
        passive: !r,
        capture: !!s
    })
}, Ue = function(e, t, i, r) {
    return e.removeEventListener(t, i, !!r)
}, ks = function(e, t, i) {
    i = i && i.wheelHandler,
    i && (e(t, "wheel", i),
    e(t, "touchmove", i))
}, zl = {
    startColor: "green",
    endColor: "red",
    indent: 0,
    fontSize: "16px",
    fontWeight: "normal"
}, Cs = {
    toggleActions: "play",
    anticipatePin: 0
}, io = {
    top: 0,
    left: 0,
    center: .5,
    bottom: 1,
    right: 1
}, Is = function(e, t) {
    if (Rt(e)) {
        var i = e.indexOf("=")
          , r = ~i ? +(e.charAt(i - 1) + 1) * parseFloat(e.substr(i + 1)) : 0;
        ~i && (e.indexOf("%") > i && (r *= t / 100),
        e = e.substr(0, i - 1)),
        e = r + (e in io ? io[e] * t : ~e.indexOf("%") ? parseFloat(e) * t / 100 : parseFloat(e) || 0)
    }
    return e
}, Es = function(e, t, i, r, s, o, a, l) {
    var c = s.startColor
      , u = s.endColor
      , p = s.fontSize
      , d = s.indent
      , h = s.fontWeight
      , m = be.createElement("div")
      , f = Nn(i) || nn(i, "pinType") === "fixed"
      , w = e.indexOf("scroller") !== -1
      , _ = f ? me : i
      , v = e.indexOf("start") !== -1
      , b = v ? c : u
      , y = "border-color:" + b + ";font-size:" + p + ";color:" + b + ";font-weight:" + h + ";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";
    return y += "position:" + ((w || l) && f ? "fixed;" : "absolute;"),
    (w || l || !f) && (y += (r === Be ? Ja : Za) + ":" + (o + parseFloat(d)) + "px;"),
    a && (y += "box-sizing:border-box;text-align:left;width:" + a.offsetWidth + "px;"),
    m._isStart = v,
    m.setAttribute("class", "gsap-marker-" + e + (t ? " marker-" + t : "")),
    m.style.cssText = y,
    m.innerText = t || t === 0 ? e + "-" + t : e,
    _.children[0] ? _.insertBefore(m, _.children[0]) : _.appendChild(m),
    m._offset = m["offset" + r.op.d2],
    $s(m, 0, r, v),
    m
}, $s = function(e, t, i, r) {
    var s = {
        display: "block"
    }
      , o = i[r ? "os2" : "p2"]
      , a = i[r ? "p2" : "os2"];
    e._isFlipped = r,
    s[i.a + "Percent"] = r ? -100 : 0,
    s[i.a] = r ? "1px" : 0,
    s["border" + o + pr] = 1,
    s["border" + a + pr] = 0,
    s[i.p] = t + "px",
    I.set(e, s)
}, J = [], ha = {}, ns, ql = function() {
    return at() - Xt > 34 && (ns || (ns = requestAnimationFrame(Oi)))
}, Yn = function() {
    (!gt || !gt.isPressed || gt.startX > me.clientWidth) && (ee.cache++,
    gt ? ns || (ns = requestAnimationFrame(Oi)) : Oi(),
    Xt || $n("scrollStart"),
    Xt = at())
}, Do = function() {
    Eu = ie.innerWidth,
    Cu = ie.innerHeight
}, Rr = function() {
    ee.cache++,
    !ot && !ku && !be.fullscreenElement && !be.webkitFullscreenElement && (!la || Eu !== ie.innerWidth || Math.abs(ie.innerHeight - Cu) > ie.innerHeight * .25) && Zs.restart(!0)
}, In = {}, mf = [], Nu = function n() {
    return Ue(Y, "scrollEnd", n) || _n(!0)
}, $n = function(e) {
    return In[e] && In[e].map(function(t) {
        return t()
    }) || mf
}, Dt = [], Iu = function(e) {
    for (var t = 0; t < Dt.length; t += 5)
        (!e || Dt[t + 4] && Dt[t + 4].query === e) && (Dt[t].style.cssText = Dt[t + 1],
        Dt[t].getBBox && Dt[t].setAttribute("transform", Dt[t + 2] || ""),
        Dt[t + 3].uncache = 1)
}, il = function(e, t) {
    var i;
    for (yt = 0; yt < J.length; yt++)
        i = J[yt],
        i && (!t || i._ctx === t) && (e ? i.kill(1) : i.revert(!0, !0));
    eo = !0,
    t && Iu(t),
    t || $n("revert")
}, $u = function(e, t) {
    ee.cache++,
    (t || !vt) && ee.forEach(function(i) {
        return xt(i) && i.cacheID++ && (i.rec = 0)
    }),
    Rt(e) && (ie.history.scrollRestoration = Ka = e)
}, vt, Ln = 0, Bl, gf = function() {
    if (Bl !== Ln) {
        var e = Bl = Ln;
        requestAnimationFrame(function() {
            return e === Ln && _n(!0)
        })
    }
}, Fu = function() {
    me.appendChild(or),
    Qa = !gt && or.offsetHeight || ie.innerHeight,
    me.removeChild(or)
}, Hl = function(e) {
    return is(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end").forEach(function(t) {
        return t.style.display = e ? "none" : "block"
    })
}, _n = function(e, t) {
    if (Xt && !e && !eo) {
        Ve(Y, "scrollEnd", Nu);
        return
    }
    Fu(),
    vt = Y.isRefreshing = !0,
    ee.forEach(function(r) {
        return xt(r) && ++r.cacheID && (r.rec = r())
    });
    var i = $n("refreshInit");
    Su && Y.sort(),
    t || il(),
    ee.forEach(function(r) {
        xt(r) && (r.smooth && (r.target.style.scrollBehavior = "auto"),
        r(0))
    }),
    J.slice(0).forEach(function(r) {
        return r.refresh()
    }),
    eo = !1,
    J.forEach(function(r) {
        if (r._subPinOffset && r.pin) {
            var s = r.vars.horizontal ? "offsetWidth" : "offsetHeight"
              , o = r.pin[s];
            r.revert(!0, 1),
            r.adjustPinSpacing(r.pin[s] - o),
            r.refresh()
        }
    }),
    ua = 1,
    Hl(!0),
    J.forEach(function(r) {
        var s = gi(r.scroller, r._dir)
          , o = r.vars.end === "max" || r._endClamp && r.end > s
          , a = r._startClamp && r.start >= s;
        (o || a) && r.setPositions(a ? s - 1 : r.start, o ? Math.max(a ? s : r.start + 1, s) : r.end, !0)
    }),
    Hl(!1),
    ua = 0,
    i.forEach(function(r) {
        return r && r.render && r.render(-1)
    }),
    ee.forEach(function(r) {
        xt(r) && (r.smooth && requestAnimationFrame(function() {
            return r.target.style.scrollBehavior = "smooth"
        }),
        r.rec && r(r.rec))
    }),
    $u(Ka, 1),
    Zs.pause(),
    Ln++,
    vt = 2,
    Oi(2),
    J.forEach(function(r) {
        return xt(r.vars.onRefresh) && r.vars.onRefresh(r)
    }),
    vt = Y.isRefreshing = !1,
    $n("refresh")
}, da = 0, Fs = 1, Wr, Oi = function(e) {
    if (e === 2 || !vt && !eo) {
        Y.isUpdating = !0,
        Wr && Wr.update(0);
        var t = J.length
          , i = at()
          , r = i - Oo >= 50
          , s = t && J[0].scroll();
        if (Fs = da > s ? -1 : 1,
        vt || (da = s),
        r && (Xt && !fo && i - Xt > 200 && (Xt = 0,
        $n("scrollEnd")),
        Mr = Oo,
        Oo = i),
        Fs < 0) {
            for (yt = t; yt-- > 0; )
                J[yt] && J[yt].update(0, r);
            Fs = 1
        } else
            for (yt = 0; yt < t; yt++)
                J[yt] && J[yt].update(0, r);
        Y.isUpdating = !1
    }
    ns = 0
}, fa = [Lu, Du, Za, Ja, Ut + Vr, Ut + Hr, Ut + Ur, Ut + jr, "display", "flexShrink", "float", "zIndex", "gridColumnStart", "gridColumnEnd", "gridRowStart", "gridRowEnd", "gridArea", "justifySelf", "alignSelf", "placeSelf", "order"], zs = fa.concat([Mn, On, "boxSizing", "max" + pr, "max" + el, "position", Ut, Ne, Ne + Ur, Ne + Hr, Ne + Vr, Ne + jr]), yf = function(e, t, i) {
    ar(i);
    var r = e._gsap;
    if (r.spacerIsNative)
        ar(r.spacerState);
    else if (e._gsap.swappedIn) {
        var s = t.parentNode;
        s && (s.insertBefore(e, t),
        s.removeChild(t))
    }
    e._gsap.swappedIn = !1
}, Ro = function(e, t, i, r) {
    if (!e._gsap.swappedIn) {
        for (var s = fa.length, o = t.style, a = e.style, l; s--; )
            l = fa[s],
            o[l] = i[l];
        o.position = i.position === "absolute" ? "absolute" : "relative",
        i.display === "inline" && (o.display = "inline-block"),
        a[Za] = a[Ja] = "auto",
        o.flexBasis = i.flexBasis || "auto",
        o.overflow = "visible",
        o.boxSizing = "border-box",
        o[Mn] = to(e, wt) + qe,
        o[On] = to(e, Be) + qe,
        o[Ne] = a[Ut] = a[Du] = a[Lu] = "0",
        ar(r),
        a[Mn] = a["max" + pr] = i[Mn],
        a[On] = a["max" + el] = i[On],
        a[Ne] = i[Ne],
        e.parentNode !== t && (e.parentNode.insertBefore(t, e),
        t.appendChild(e)),
        e._gsap.swappedIn = !0
    }
}, vf = /([A-Z])/g, ar = function(e) {
    if (e) {
        var t = e.t.style, i = e.length, r = 0, s, o;
        for ((e.t._gsap || I.core.getCache(e.t)).uncache = 1; r < i; r += 2)
            o = e[r + 1],
            s = e[r],
            o ? t[s] = o : t[s] && t.removeProperty(s.replace(vf, "-$1").toLowerCase())
    }
}, Ps = function(e) {
    for (var t = zs.length, i = e.style, r = [], s = 0; s < t; s++)
        r.push(zs[s], i[zs[s]]);
    return r.t = e,
    r
}, bf = function(e, t, i) {
    for (var r = [], s = e.length, o = i ? 8 : 0, a; o < s; o += 2)
        a = e[o],
        r.push(a, a in t ? t[a] : e[o + 1]);
    return r.t = e.t,
    r
}, qs = {
    left: 0,
    top: 0
}, jl = function(e, t, i, r, s, o, a, l, c, u, p, d, h, m) {
    xt(e) && (e = e(l)),
    Rt(e) && e.substr(0, 3) === "max" && (e = d + (e.charAt(4) === "=" ? Is("0" + e.substr(3), i) : 0));
    var f = h ? h.time() : 0, w, _, v;
    if (h && h.seek(0),
    isNaN(e) || (e = +e),
    Dr(e))
        h && (e = I.utils.mapRange(h.scrollTrigger.start, h.scrollTrigger.end, 0, d, e)),
        a && $s(a, i, r, !0);
    else {
        xt(t) && (t = t(l));
        var b = (e || "0").split(" "), y, x, k, T;
        v = St(t, l) || me,
        y = Pi(v) || {},
        (!y || !y.left && !y.top) && Vt(v).display === "none" && (T = v.style.display,
        v.style.display = "block",
        y = Pi(v),
        T ? v.style.display = T : v.style.removeProperty("display")),
        x = Is(b[0], y[r.d]),
        k = Is(b[1] || "0", i),
        e = y[r.p] - c[r.p] - u + x + s - k,
        a && $s(a, k, r, i - k < 20 || a._isStart && k > 20),
        i -= i - k
    }
    if (m && (l[m] = e || -.001,
    e < 0 && (e = 0)),
    o) {
        var M = e + i
          , E = o._isStart;
        w = "scroll" + r.d2,
        $s(o, M, r, E && M > 20 || !E && (p ? Math.max(me[w], si[w]) : o.parentNode[w]) <= M + 1),
        p && (c = Pi(a),
        p && (o.style[r.op.p] = c[r.op.p] - r.op.m - o._offset + qe))
    }
    return h && v && (w = Pi(v),
    h.seek(d),
    _ = Pi(v),
    h._caScrollDist = w[r.p] - _[r.p],
    e = e / h._caScrollDist * d),
    h && h.seek(f),
    h ? e : Math.round(e)
}, _f = /(webkit|moz|length|cssText|inset)/i, Ul = function(e, t, i, r) {
    if (e.parentNode !== t) {
        var s = e.style, o, a;
        if (t === me) {
            e._stOrig = s.cssText,
            a = Vt(e);
            for (o in a)
                !+o && !_f.test(o) && a[o] && typeof s[o] == "string" && o !== "0" && (s[o] = a[o]);
            s.top = i,
            s.left = r
        } else
            s.cssText = e._stOrig;
        I.core.getCache(e).uncache = 1,
        t.appendChild(e)
    }
}, zu = function(e, t, i) {
    var r = t
      , s = r;
    return function(o) {
        var a = Math.round(e());
        return a !== r && a !== s && Math.abs(a - r) > 3 && Math.abs(a - s) > 3 && (o = a,
        i && i()),
        s = r,
        r = o,
        o
    }
}, As = function(e, t, i) {
    var r = {};
    r[t.p] = "+=" + i,
    I.set(e, r)
}, Vl = function(e, t) {
    var i = on(e, t)
      , r = "_scroll" + t.p2
      , s = function o(a, l, c, u, p) {
        var d = o.tween
          , h = l.onComplete
          , m = {};
        c = c || i();
        var f = zu(i, c, function() {
            d.kill(),
            o.tween = 0
        });
        return p = u && p || 0,
        u = u || a - c,
        d && d.kill(),
        l[r] = a,
        l.inherit = !1,
        l.modifiers = m,
        m[r] = function() {
            return f(c + u * d.ratio + p * d.ratio * d.ratio)
        }
        ,
        l.onUpdate = function() {
            ee.cache++,
            o.tween && Oi()
        }
        ,
        l.onComplete = function() {
            o.tween = 0,
            h && h.call(d)
        }
        ,
        d = o.tween = I.to(e, l),
        d
    };
    return e[r] = i,
    i.wheelHandler = function() {
        return s.tween && s.tween.kill() && (s.tween = 0)
    }
    ,
    Ve(e, "wheel", i.wheelHandler),
    Y.isTouch && Ve(e, "touchmove", i.wheelHandler),
    s
}, Y = function() {
    function n(t, i) {
        Kn || n.register(I) || console.warn("Please gsap.registerPlugin(ScrollTrigger)"),
        ca(this),
        this.init(t, i)
    }
    var e = n.prototype;
    return e.init = function(i, r) {
        if (this.progress = this.start = 0,
        this.vars && this.kill(!0, !0),
        !Or) {
            this.update = this.refresh = this.kill = di;
            return
        }
        i = Fl(Rt(i) || Dr(i) || i.nodeType ? {
            trigger: i
        } : i, Cs);
        var s = i, o = s.onUpdate, a = s.toggleClass, l = s.id, c = s.onToggle, u = s.onRefresh, p = s.scrub, d = s.trigger, h = s.pin, m = s.pinSpacing, f = s.invalidateOnRefresh, w = s.anticipatePin, _ = s.onScrubComplete, v = s.onSnapComplete, b = s.once, y = s.snap, x = s.pinReparent, k = s.pinSpacer, T = s.containerAnimation, M = s.fastScrollEnd, E = s.preventOverlaps, C = i.horizontal || i.containerAnimation && i.horizontal !== !1 ? wt : Be, N = !p && p !== 0, A = St(i.scroller || ie), $ = I.core.getCache(A), L = Nn(A), B = ("pinType"in i ? i.pinType : nn(A, "pinType") || L && "fixed") === "fixed", W = [i.onEnter, i.onLeave, i.onEnterBack, i.onLeaveBack], z = N && i.toggleActions.split(" "), Q = "markers"in i ? i.markers : Cs.markers, V = L ? 0 : parseFloat(Vt(A)["border" + C.p2 + pr]) || 0, S = this, ce = i.onRefreshInit && function() {
            return i.onRefreshInit(S)
        }
        , $e = uf(A, L, C), Kt = hf(A, L), xe = 0, Ke = 0, ht = 0, Le = on(A, C), dt, tt, Ii, ft, Qt, se, ke, Tt, Mt, P, Ot, Ti, $i, De, Fi, ln, Bn, He, zi, Ce, Jt, Bt, Si, gr, Re, ms, qi, Hn, jn, Bi, cn, Z, un, Zt, ei, ti, hn, Un, ki;
        if (S._startClamp = S._endClamp = !1,
        S._dir = C,
        w *= 45,
        S.scroller = A,
        S.scroll = T ? T.time.bind(T) : Le,
        ft = Le(),
        S.vars = i,
        r = r || i.animation,
        "refreshPriority"in i && (Su = 1,
        i.refreshPriority === -9999 && (Wr = S)),
        $.tweenScroll = $.tweenScroll || {
            top: Vl(A, Be),
            left: Vl(A, wt)
        },
        S.tweenTo = dt = $.tweenScroll[C.p],
        S.scrubDuration = function(R) {
            un = Dr(R) && R,
            un ? Z ? Z.duration(R) : Z = I.to(r, {
                ease: "expo",
                totalProgress: "+=0",
                inherit: !1,
                duration: un,
                paused: !0,
                onComplete: function() {
                    return _ && _(S)
                }
            }) : (Z && Z.progress(1).kill(),
            Z = 0)
        }
        ,
        r && (r.vars.lazy = !1,
        r._initted && !S.isReverted || r.vars.immediateRender !== !1 && i.immediateRender !== !1 && r.duration() && r.render(0, !0, !0),
        S.animation = r.pause(),
        r.scrollTrigger = S,
        S.scrubDuration(p),
        Bi = 0,
        l || (l = r.vars.id)),
        y && ((!vn(y) || y.push) && (y = {
            snapTo: y
        }),
        "scrollBehavior"in me.style && I.set(L ? [me, si] : A, {
            scrollBehavior: "auto"
        }),
        ee.forEach(function(R) {
            return xt(R) && R.target === (L ? be.scrollingElement || si : A) && (R.smooth = !1)
        }),
        Ii = xt(y.snapTo) ? y.snapTo : y.snapTo === "labels" ? ff(r) : y.snapTo === "labelsDirectional" ? pf(r) : y.directional !== !1 ? function(R, K) {
            return tl(y.snapTo)(R, at() - Ke < 500 ? 0 : K.direction)
        }
        : I.utils.snap(y.snapTo),
        Zt = y.duration || {
            min: .1,
            max: 2
        },
        Zt = vn(Zt) ? Br(Zt.min, Zt.max) : Br(Zt, Zt),
        ei = I.delayedCall(y.delay || un / 2 || .1, function() {
            var R = Le()
              , K = at() - Ke < 500
              , q = dt.tween;
            if ((K || Math.abs(S.getVelocity()) < 10) && !q && !fo && xe !== R) {
                var X = (R - se) / De, je = r && !N ? r.totalProgress() : X, te = K ? 0 : (je - cn) / (at() - Mr) * 1e3 || 0, Ee = I.utils.clamp(-X, 1 - X, Wn(te / 2) * te / .185), it = X + (y.inertia === !1 ? 0 : Ee), Te, ge, he = y, ii = he.onStart, ve = he.onInterrupt, Lt = he.onComplete;
                if (Te = Ii(it, S),
                Dr(Te) || (Te = it),
                ge = Math.round(se + Te * De),
                R <= ke && R >= se && ge !== R) {
                    if (q && !q._initted && q.data <= Wn(ge - R))
                        return;
                    y.inertia === !1 && (Ee = Te - X),
                    dt(ge, {
                        duration: Zt(Wn(Math.max(Wn(it - je), Wn(Te - je)) * .185 / te / .05 || 0)),
                        ease: y.ease || "power3",
                        data: Wn(ge - R),
                        onInterrupt: function() {
                            return ei.restart(!0) && ve && ve(S)
                        },
                        onComplete: function() {
                            S.update(),
                            xe = Le(),
                            r && (Z ? Z.resetTo("totalProgress", Te, r._tTime / r._tDur) : r.progress(Te)),
                            Bi = cn = r && !N ? r.totalProgress() : S.progress,
                            v && v(S),
                            Lt && Lt(S)
                        }
                    }, R, Ee * De, ge - R - Ee * De),
                    ii && ii(S, dt.tween)
                }
            } else
                S.isActive && xe !== R && ei.restart(!0)
        }).pause()),
        l && (ha[l] = S),
        d = S.trigger = St(d || h !== !0 && h),
        ki = d && d._gsap && d._gsap.stRevert,
        ki && (ki = ki(S)),
        h = h === !0 ? d : St(h),
        Rt(a) && (a = {
            targets: d,
            className: a
        }),
        h && (m === !1 || m === Ut || (m = !m && h.parentNode && h.parentNode.style && Vt(h.parentNode).display === "flex" ? !1 : Ne),
        S.pin = h,
        tt = I.core.getCache(h),
        tt.spacer ? Fi = tt.pinState : (k && (k = St(k),
        k && !k.nodeType && (k = k.current || k.nativeElement),
        tt.spacerIsNative = !!k,
        k && (tt.spacerState = Ps(k))),
        tt.spacer = He = k || be.createElement("div"),
        He.classList.add("pin-spacer"),
        l && He.classList.add("pin-spacer-" + l),
        tt.pinState = Fi = Ps(h)),
        i.force3D !== !1 && I.set(h, {
            force3D: !0
        }),
        S.spacer = He = tt.spacer,
        jn = Vt(h),
        gr = jn[m + C.os2],
        Ce = I.getProperty(h),
        Jt = I.quickSetter(h, C.a, qe),
        Ro(h, He, jn),
        Bn = Ps(h)),
        Q) {
            Ti = vn(Q) ? Fl(Q, zl) : zl,
            P = Es("scroller-start", l, A, C, Ti, 0),
            Ot = Es("scroller-end", l, A, C, Ti, 0, P),
            zi = P["offset" + C.op.d2];
            var yr = St(nn(A, "content") || A);
            Tt = this.markerStart = Es("start", l, yr, C, Ti, zi, 0, T),
            Mt = this.markerEnd = Es("end", l, yr, C, Ti, zi, 0, T),
            T && (Un = I.quickSetter([Tt, Mt], C.a, qe)),
            !B && !(_i.length && nn(A, "fixedMarkers") === !0) && (df(L ? me : A),
            I.set([P, Ot], {
                force3D: !0
            }),
            ms = I.quickSetter(P, C.a, qe),
            Hn = I.quickSetter(Ot, C.a, qe))
        }
        if (T) {
            var G = T.vars.onUpdate
              , H = T.vars.onUpdateParams;
            T.eventCallback("onUpdate", function() {
                S.update(0, 0, 1),
                G && G.apply(T, H || [])
            })
        }
        if (S.previous = function() {
            return J[J.indexOf(S) - 1]
        }
        ,
        S.next = function() {
            return J[J.indexOf(S) + 1]
        }
        ,
        S.revert = function(R, K) {
            if (!K)
                return S.kill(!0);
            var q = R !== !1 || !S.enabled
              , X = ot;
            q !== S.isReverted && (q && (ti = Math.max(Le(), S.scroll.rec || 0),
            ht = S.progress,
            hn = r && r.progress()),
            Tt && [Tt, Mt, P, Ot].forEach(function(je) {
                return je.style.display = q ? "none" : "block"
            }),
            q && (ot = S,
            S.update(q)),
            h && (!x || !S.isActive) && (q ? yf(h, He, Fi) : Ro(h, He, Vt(h), Re)),
            q || S.update(q),
            ot = X,
            S.isReverted = q)
        }
        ,
        S.refresh = function(R, K, q, X) {
            if (!((ot || !S.enabled) && !K)) {
                if (h && R && Xt) {
                    Ve(n, "scrollEnd", Nu);
                    return
                }
                !vt && ce && ce(S),
                ot = S,
                dt.tween && !q && (dt.tween.kill(),
                dt.tween = 0),
                Z && Z.pause(),
                f && r && r.revert({
                    kill: !1
                }).invalidate(),
                S.isReverted || S.revert(!0, !0),
                S._subPinOffset = !1;
                var je = $e(), te = Kt(), Ee = T ? T.duration() : gi(A, C), it = De <= .01, Te = 0, ge = X || 0, he = vn(q) ? q.end : i.end, ii = i.endTrigger || d, ve = vn(q) ? q.start : i.start || (i.start === 0 || !d ? 0 : h ? "0 0" : "0 100%"), Lt = S.pinnedContainer = i.pinnedContainer && St(i.pinnedContainer, S), ai = d && Math.max(0, J.indexOf(S)) || 0, Qe = ai, Je, nt, dn, gs, rt, Fe, li, bo, fl, vr, ci, br, ys;
                for (Q && vn(q) && (br = I.getProperty(P, C.p),
                ys = I.getProperty(Ot, C.p)); Qe--; )
                    Fe = J[Qe],
                    Fe.end || Fe.refresh(0, 1) || (ot = S),
                    li = Fe.pin,
                    li && (li === d || li === h || li === Lt) && !Fe.isReverted && (vr || (vr = []),
                    vr.unshift(Fe),
                    Fe.revert(!0, !0)),
                    Fe !== J[Qe] && (ai--,
                    Qe--);
                for (xt(ve) && (ve = ve(S)),
                ve = Rl(ve, "start", S),
                se = jl(ve, d, je, C, Le(), Tt, P, S, te, V, B, Ee, T, S._startClamp && "_startClamp") || (h ? -.001 : 0),
                xt(he) && (he = he(S)),
                Rt(he) && !he.indexOf("+=") && (~he.indexOf(" ") ? he = (Rt(ve) ? ve.split(" ")[0] : "") + he : (Te = Is(he.substr(2), je),
                he = Rt(ve) ? ve : (T ? I.utils.mapRange(0, T.duration(), T.scrollTrigger.start, T.scrollTrigger.end, se) : se) + Te,
                ii = d)),
                he = Rl(he, "end", S),
                ke = Math.max(se, jl(he || (ii ? "100% 0" : Ee), ii, je, C, Le() + Te, Mt, Ot, S, te, V, B, Ee, T, S._endClamp && "_endClamp")) || -.001,
                Te = 0,
                Qe = ai; Qe--; )
                    Fe = J[Qe],
                    li = Fe.pin,
                    li && Fe.start - Fe._pinPush <= se && !T && Fe.end > 0 && (Je = Fe.end - (S._startClamp ? Math.max(0, Fe.start) : Fe.start),
                    (li === d && Fe.start - Fe._pinPush < se || li === Lt) && isNaN(ve) && (Te += Je * (1 - Fe.progress)),
                    li === h && (ge += Je));
                if (se += Te,
                ke += Te,
                S._startClamp && (S._startClamp += Te),
                S._endClamp && !vt && (S._endClamp = ke || -.001,
                ke = Math.min(ke, gi(A, C))),
                De = ke - se || (se -= .01) && .001,
                it && (ht = I.utils.clamp(0, 1, I.utils.normalize(se, ke, ti))),
                S._pinPush = ge,
                Tt && Te && (Je = {},
                Je[C.a] = "+=" + Te,
                Lt && (Je[C.p] = "-=" + Le()),
                I.set([Tt, Mt], Je)),
                h && !(ua && S.end >= gi(A, C)))
                    Je = Vt(h),
                    gs = C === Be,
                    dn = Le(),
                    Bt = parseFloat(Ce(C.a)) + ge,
                    !Ee && ke > 1 && (ci = (L ? be.scrollingElement || si : A).style,
                    ci = {
                        style: ci,
                        value: ci["overflow" + C.a.toUpperCase()]
                    },
                    L && Vt(me)["overflow" + C.a.toUpperCase()] !== "scroll" && (ci.style["overflow" + C.a.toUpperCase()] = "scroll")),
                    Ro(h, He, Je),
                    Bn = Ps(h),
                    nt = Pi(h, !0),
                    bo = B && on(A, gs ? wt : Be)(),
                    m ? (Re = [m + C.os2, De + ge + qe],
                    Re.t = He,
                    Qe = m === Ne ? to(h, C) + De + ge : 0,
                    Qe && (Re.push(C.d, Qe + qe),
                    He.style.flexBasis !== "auto" && (He.style.flexBasis = Qe + qe)),
                    ar(Re),
                    Lt && J.forEach(function(_r) {
                        _r.pin === Lt && _r.vars.pinSpacing !== !1 && (_r._subPinOffset = !0)
                    }),
                    B && Le(ti)) : (Qe = to(h, C),
                    Qe && He.style.flexBasis !== "auto" && (He.style.flexBasis = Qe + qe)),
                    B && (rt = {
                        top: nt.top + (gs ? dn - se : bo) + qe,
                        left: nt.left + (gs ? bo : dn - se) + qe,
                        boxSizing: "border-box",
                        position: "fixed"
                    },
                    rt[Mn] = rt["max" + pr] = Math.ceil(nt.width) + qe,
                    rt[On] = rt["max" + el] = Math.ceil(nt.height) + qe,
                    rt[Ut] = rt[Ut + Ur] = rt[Ut + Hr] = rt[Ut + Vr] = rt[Ut + jr] = "0",
                    rt[Ne] = Je[Ne],
                    rt[Ne + Ur] = Je[Ne + Ur],
                    rt[Ne + Hr] = Je[Ne + Hr],
                    rt[Ne + Vr] = Je[Ne + Vr],
                    rt[Ne + jr] = Je[Ne + jr],
                    ln = bf(Fi, rt, x),
                    vt && Le(0)),
                    r ? (fl = r._initted,
                    Ao(1),
                    r.render(r.duration(), !0, !0),
                    Si = Ce(C.a) - Bt + De + ge,
                    qi = Math.abs(De - Si) > 1,
                    B && qi && ln.splice(ln.length - 2, 2),
                    r.render(0, !0, !0),
                    fl || r.invalidate(!0),
                    r.parent || r.totalTime(r.totalTime()),
                    Ao(0)) : Si = De,
                    ci && (ci.value ? ci.style["overflow" + C.a.toUpperCase()] = ci.value : ci.style.removeProperty("overflow-" + C.a));
                else if (d && Le() && !T)
                    for (nt = d.parentNode; nt && nt !== me; )
                        nt._pinOffset && (se -= nt._pinOffset,
                        ke -= nt._pinOffset),
                        nt = nt.parentNode;
                vr && vr.forEach(function(_r) {
                    return _r.revert(!1, !0)
                }),
                S.start = se,
                S.end = ke,
                ft = Qt = vt ? ti : Le(),
                !T && !vt && (ft < ti && Le(ti),
                S.scroll.rec = 0),
                S.revert(!1, !0),
                Ke = at(),
                ei && (xe = -1,
                ei.restart(!0)),
                ot = 0,
                r && N && (r._initted || hn) && r.progress() !== hn && r.progress(hn || 0, !0).render(r.time(), !0, !0),
                (it || ht !== S.progress || T || f) && (r && !N && r.totalProgress(T && se < -.001 && !ht ? I.utils.normalize(se, ke, 0) : ht, !0),
                S.progress = it || (ft - se) / De === ht ? 0 : ht),
                h && m && (He._pinOffset = Math.round(S.progress * Si)),
                Z && Z.invalidate(),
                isNaN(br) || (br -= I.getProperty(P, C.p),
                ys -= I.getProperty(Ot, C.p),
                As(P, C, br),
                As(Tt, C, br - (X || 0)),
                As(Ot, C, ys),
                As(Mt, C, ys - (X || 0))),
                it && !vt && S.update(),
                u && !vt && !$i && ($i = !0,
                u(S),
                $i = !1)
            }
        }
        ,
        S.getVelocity = function() {
            return (Le() - Qt) / (at() - Mr) * 1e3 || 0
        }
        ,
        S.endAnimation = function() {
            Tr(S.callbackAnimation),
            r && (Z ? Z.progress(1) : r.paused() ? N || Tr(r, S.direction < 0, 1) : Tr(r, r.reversed()))
        }
        ,
        S.labelToScroll = function(R) {
            return r && r.labels && (se || S.refresh() || se) + r.labels[R] / r.duration() * De || 0
        }
        ,
        S.getTrailing = function(R) {
            var K = J.indexOf(S)
              , q = S.direction > 0 ? J.slice(0, K).reverse() : J.slice(K + 1);
            return (Rt(R) ? q.filter(function(X) {
                return X.vars.preventOverlaps === R
            }) : q).filter(function(X) {
                return S.direction > 0 ? X.end <= se : X.start >= ke
            })
        }
        ,
        S.update = function(R, K, q) {
            if (!(T && !q && !R)) {
                var X = vt === !0 ? ti : S.scroll(), je = R ? 0 : (X - se) / De, te = je < 0 ? 0 : je > 1 ? 1 : je || 0, Ee = S.progress, it, Te, ge, he, ii, ve, Lt, ai;
                if (K && (Qt = ft,
                ft = T ? Le() : X,
                y && (cn = Bi,
                Bi = r && !N ? r.totalProgress() : te)),
                w && h && !ot && !xs && Xt && (!te && se < X + (X - Qt) / (at() - Mr) * w ? te = 1e-4 : te === 1 && ke > X + (X - Qt) / (at() - Mr) * w && (te = .9999)),
                te !== Ee && S.enabled) {
                    if (it = S.isActive = !!te && te < 1,
                    Te = !!Ee && Ee < 1,
                    ve = it !== Te,
                    ii = ve || !!te != !!Ee,
                    S.direction = te > Ee ? 1 : -1,
                    S.progress = te,
                    ii && !ot && (ge = te && !Ee ? 0 : te === 1 ? 1 : Ee === 1 ? 2 : 3,
                    N && (he = !ve && z[ge + 1] !== "none" && z[ge + 1] || z[ge],
                    ai = r && (he === "complete" || he === "reset" || he in r))),
                    E && (ve || ai) && (ai || p || !r) && (xt(E) ? E(S) : S.getTrailing(E).forEach(function(dn) {
                        return dn.endAnimation()
                    })),
                    N || (Z && !ot && !xs ? (Z._dp._time - Z._start !== Z._time && Z.render(Z._dp._time - Z._start),
                    Z.resetTo ? Z.resetTo("totalProgress", te, r._tTime / r._tDur) : (Z.vars.totalProgress = te,
                    Z.invalidate().restart())) : r && r.totalProgress(te, !!(ot && (Ke || R)))),
                    h) {
                        if (R && m && (He.style[m + C.os2] = gr),
                        !B)
                            Jt(Lr(Bt + Si * te));
                        else if (ii) {
                            if (Lt = !R && te > Ee && ke + 1 > X && X + 1 >= gi(A, C),
                            x)
                                if (!R && (it || Lt)) {
                                    var Qe = Pi(h, !0)
                                      , Je = X - se;
                                    Ul(h, me, Qe.top + (C === Be ? Je : 0) + qe, Qe.left + (C === Be ? 0 : Je) + qe)
                                } else
                                    Ul(h, He);
                            ar(it || Lt ? ln : Bn),
                            qi && te < 1 && it || Jt(Bt + (te === 1 && !Lt ? Si : 0))
                        }
                    }
                    y && !dt.tween && !ot && !xs && ei.restart(!0),
                    a && (ve || b && te && (te < 1 || !Mo)) && is(a.targets).forEach(function(dn) {
                        return dn.classList[it || b ? "add" : "remove"](a.className)
                    }),
                    o && !N && !R && o(S),
                    ii && !ot ? (N && (ai && (he === "complete" ? r.pause().totalProgress(1) : he === "reset" ? r.restart(!0).pause() : he === "restart" ? r.restart(!0) : r[he]()),
                    o && o(S)),
                    (ve || !Mo) && (c && ve && Lo(S, c),
                    W[ge] && Lo(S, W[ge]),
                    b && (te === 1 ? S.kill(!1, 1) : W[ge] = 0),
                    ve || (ge = te === 1 ? 1 : 3,
                    W[ge] && Lo(S, W[ge]))),
                    M && !it && Math.abs(S.getVelocity()) > (Dr(M) ? M : 2500) && (Tr(S.callbackAnimation),
                    Z ? Z.progress(1) : Tr(r, he === "reverse" ? 1 : !te, 1))) : N && o && !ot && o(S)
                }
                if (Hn) {
                    var nt = T ? X / T.duration() * (T._caScrollDist || 0) : X;
                    ms(nt + (P._isFlipped ? 1 : 0)),
                    Hn(nt)
                }
                Un && Un(-X / T.duration() * (T._caScrollDist || 0))
            }
        }
        ,
        S.enable = function(R, K) {
            S.enabled || (S.enabled = !0,
            Ve(A, "resize", Rr),
            L || Ve(A, "scroll", Yn),
            ce && Ve(n, "refreshInit", ce),
            R !== !1 && (S.progress = ht = 0,
            ft = Qt = xe = Le()),
            K !== !1 && S.refresh())
        }
        ,
        S.getTween = function(R) {
            return R && dt ? dt.tween : Z
        }
        ,
        S.setPositions = function(R, K, q, X) {
            if (T) {
                var je = T.scrollTrigger
                  , te = T.duration()
                  , Ee = je.end - je.start;
                R = je.start + Ee * R / te,
                K = je.start + Ee * K / te
            }
            S.refresh(!1, !1, {
                start: Nl(R, q && !!S._startClamp),
                end: Nl(K, q && !!S._endClamp)
            }, X),
            S.update()
        }
        ,
        S.adjustPinSpacing = function(R) {
            if (Re && R) {
                var K = Re.indexOf(C.d) + 1;
                Re[K] = parseFloat(Re[K]) + R + qe,
                Re[1] = parseFloat(Re[1]) + R + qe,
                ar(Re)
            }
        }
        ,
        S.disable = function(R, K) {
            if (S.enabled && (R !== !1 && S.revert(!0, !0),
            S.enabled = S.isActive = !1,
            K || Z && Z.pause(),
            ti = 0,
            tt && (tt.uncache = 1),
            ce && Ue(n, "refreshInit", ce),
            ei && (ei.pause(),
            dt.tween && dt.tween.kill() && (dt.tween = 0)),
            !L)) {
                for (var q = J.length; q--; )
                    if (J[q].scroller === A && J[q] !== S)
                        return;
                Ue(A, "resize", Rr),
                L || Ue(A, "scroll", Yn)
            }
        }
        ,
        S.kill = function(R, K) {
            S.disable(R, K),
            Z && !K && Z.kill(),
            l && delete ha[l];
            var q = J.indexOf(S);
            q >= 0 && J.splice(q, 1),
            q === yt && Fs > 0 && yt--,
            q = 0,
            J.forEach(function(X) {
                return X.scroller === S.scroller && (q = 1)
            }),
            q || vt || (S.scroll.rec = 0),
            r && (r.scrollTrigger = null,
            R && r.revert({
                kill: !1
            }),
            K || r.kill()),
            Tt && [Tt, Mt, P, Ot].forEach(function(X) {
                return X.parentNode && X.parentNode.removeChild(X)
            }),
            Wr === S && (Wr = 0),
            h && (tt && (tt.uncache = 1),
            q = 0,
            J.forEach(function(X) {
                return X.pin === h && q++
            }),
            q || (tt.spacer = 0)),
            i.onKill && i.onKill(S)
        }
        ,
        J.push(S),
        S.enable(!1, !1),
        ki && ki(S),
        r && r.add && !De) {
            var ae = S.update;
            S.update = function() {
                S.update = ae,
                se || ke || S.refresh()
            }
            ,
            I.delayedCall(.01, S.update),
            De = .01,
            se = ke = 0
        } else
            S.refresh();
        h && gf()
    }
    ,
    n.register = function(i) {
        return Kn || (I = i || Au(),
        Pu() && window.document && n.enable(),
        Kn = Or),
        Kn
    }
    ,
    n.defaults = function(i) {
        if (i)
            for (var r in i)
                Cs[r] = i[r];
        return Cs
    }
    ,
    n.disable = function(i, r) {
        Or = 0,
        J.forEach(function(o) {
            return o[r ? "kill" : "disable"](i)
        }),
        Ue(ie, "wheel", Yn),
        Ue(be, "scroll", Yn),
        clearInterval(ws),
        Ue(be, "touchcancel", di),
        Ue(me, "touchstart", di),
        Ss(Ue, be, "pointerdown,touchstart,mousedown", Il),
        Ss(Ue, be, "pointerup,touchend,mouseup", $l),
        Zs.kill(),
        Ts(Ue);
        for (var s = 0; s < ee.length; s += 3)
            ks(Ue, ee[s], ee[s + 1]),
            ks(Ue, ee[s], ee[s + 2])
    }
    ,
    n.enable = function() {
        if (ie = window,
        be = document,
        si = be.documentElement,
        me = be.body,
        I && (is = I.utils.toArray,
        Br = I.utils.clamp,
        ca = I.core.context || di,
        Ao = I.core.suppressOverwrites || di,
        Ka = ie.history.scrollRestoration || "auto",
        da = ie.pageYOffset,
        I.core.globals("ScrollTrigger", n),
        me)) {
            Or = 1,
            or = document.createElement("div"),
            or.style.height = "100vh",
            or.style.position = "absolute",
            Fu(),
            cf(),
            Oe.register(I),
            n.isTouch = Oe.isTouch,
            ji = Oe.isTouch && /(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent),
            la = Oe.isTouch === 1,
            Ve(ie, "wheel", Yn),
            Tu = [ie, be, si, me],
            I.matchMedia ? (n.matchMedia = function(l) {
                var c = I.matchMedia(), u;
                for (u in l)
                    c.add(u, l[u]);
                return c
            }
            ,
            I.addEventListener("matchMediaInit", function() {
                return il()
            }),
            I.addEventListener("matchMediaRevert", function() {
                return Iu()
            }),
            I.addEventListener("matchMedia", function() {
                _n(0, 1),
                $n("matchMedia")
            }),
            I.matchMedia("(orientation: portrait)", function() {
                return Do(),
                Do
            })) : console.warn("Requires GSAP 3.11.0 or later"),
            Do(),
            Ve(be, "scroll", Yn);
            var i = me.style, r = i.borderTopStyle, s = I.core.Animation.prototype, o, a;
            for (s.revert || Object.defineProperty(s, "revert", {
                value: function() {
                    return this.time(-.01, !0)
                }
            }),
            i.borderTopStyle = "solid",
            o = Pi(me),
            Be.m = Math.round(o.top + Be.sc()) || 0,
            wt.m = Math.round(o.left + wt.sc()) || 0,
            r ? i.borderTopStyle = r : i.removeProperty("border-top-style"),
            ws = setInterval(ql, 250),
            I.delayedCall(.5, function() {
                return xs = 0
            }),
            Ve(be, "touchcancel", di),
            Ve(me, "touchstart", di),
            Ss(Ve, be, "pointerdown,touchstart,mousedown", Il),
            Ss(Ve, be, "pointerup,touchend,mouseup", $l),
            aa = I.utils.checkPrefix("transform"),
            zs.push(aa),
            Kn = at(),
            Zs = I.delayedCall(.2, _n).pause(),
            Qn = [be, "visibilitychange", function() {
                var l = ie.innerWidth
                  , c = ie.innerHeight;
                be.hidden ? (Ll = l,
                Dl = c) : (Ll !== l || Dl !== c) && Rr()
            }
            , be, "DOMContentLoaded", _n, ie, "load", _n, ie, "resize", Rr],
            Ts(Ve),
            J.forEach(function(l) {
                return l.enable(0, 1)
            }),
            a = 0; a < ee.length; a += 3)
                ks(Ue, ee[a], ee[a + 1]),
                ks(Ue, ee[a], ee[a + 2])
        }
    }
    ,
    n.config = function(i) {
        "limitCallbacks"in i && (Mo = !!i.limitCallbacks);
        var r = i.syncInterval;
        r && clearInterval(ws) || (ws = r) && setInterval(ql, r),
        "ignoreMobileResize"in i && (la = n.isTouch === 1 && i.ignoreMobileResize),
        "autoRefreshEvents"in i && (Ts(Ue) || Ts(Ve, i.autoRefreshEvents || "none"),
        ku = (i.autoRefreshEvents + "").indexOf("resize") === -1)
    }
    ,
    n.scrollerProxy = function(i, r) {
        var s = St(i)
          , o = ee.indexOf(s)
          , a = Nn(s);
        ~o && ee.splice(o, a ? 6 : 2),
        r && (a ? _i.unshift(ie, r, me, r, si, r) : _i.unshift(s, r))
    }
    ,
    n.clearMatchMedia = function(i) {
        J.forEach(function(r) {
            return r._ctx && r._ctx.query === i && r._ctx.kill(!0, !0)
        })
    }
    ,
    n.isInViewport = function(i, r, s) {
        var o = (Rt(i) ? St(i) : i).getBoundingClientRect()
          , a = o[s ? Mn : On] * r || 0;
        return s ? o.right - a > 0 && o.left + a < ie.innerWidth : o.bottom - a > 0 && o.top + a < ie.innerHeight
    }
    ,
    n.positionInViewport = function(i, r, s) {
        Rt(i) && (i = St(i));
        var o = i.getBoundingClientRect()
          , a = o[s ? Mn : On]
          , l = r == null ? a / 2 : r in io ? io[r] * a : ~r.indexOf("%") ? parseFloat(r) * a / 100 : parseFloat(r) || 0;
        return s ? (o.left + l) / ie.innerWidth : (o.top + l) / ie.innerHeight
    }
    ,
    n.killAll = function(i) {
        if (J.slice(0).forEach(function(s) {
            return s.vars.id !== "ScrollSmoother" && s.kill()
        }),
        i !== !0) {
            var r = In.killAll || [];
            In = {},
            r.forEach(function(s) {
                return s()
            })
        }
    }
    ,
    n
}();
Y.version = "3.12.5";
Y.saveStyles = function(n) {
    return n ? is(n).forEach(function(e) {
        if (e && e.style) {
            var t = Dt.indexOf(e);
            t >= 0 && Dt.splice(t, 5),
            Dt.push(e, e.style.cssText, e.getBBox && e.getAttribute("transform"), I.core.getCache(e), ca())
        }
    }) : Dt
}
;
Y.revert = function(n, e) {
    return il(!n, e)
}
;
Y.create = function(n, e) {
    return new Y(n,e)
}
;
Y.refresh = function(n) {
    return n ? Rr() : (Kn || Y.register()) && _n(!0)
}
;
Y.update = function(n) {
    return ++ee.cache && Oi(n === !0 ? 2 : 0)
}
;
Y.clearScrollMemory = $u;
Y.maxScroll = function(n, e) {
    return gi(n, e ? wt : Be)
}
;
Y.getScrollFunc = function(n, e) {
    return on(St(n), e ? wt : Be)
}
;
Y.getById = function(n) {
    return ha[n]
}
;
Y.getAll = function() {
    return J.filter(function(n) {
        return n.vars.id !== "ScrollSmoother"
    })
}
;
Y.isScrolling = function() {
    return !!Xt
}
;
Y.snapDirectional = tl;
Y.addEventListener = function(n, e) {
    var t = In[n] || (In[n] = []);
    ~t.indexOf(e) || t.push(e)
}
;
Y.removeEventListener = function(n, e) {
    var t = In[n]
      , i = t && t.indexOf(e);
    i >= 0 && t.splice(i, 1)
}
;
Y.batch = function(n, e) {
    var t = [], i = {}, r = e.interval || .016, s = e.batchMax || 1e9, o = function(c, u) {
        var p = []
          , d = []
          , h = I.delayedCall(r, function() {
            u(p, d),
            p = [],
            d = []
        }).pause();
        return function(m) {
            p.length || h.restart(!0),
            p.push(m.trigger),
            d.push(m),
            s <= p.length && h.progress(1)
        }
    }, a;
    for (a in e)
        i[a] = a.substr(0, 2) === "on" && xt(e[a]) && a !== "onRefreshInit" ? o(a, e[a]) : e[a];
    return xt(s) && (s = s(),
    Ve(Y, "refresh", function() {
        return s = e.batchMax()
    })),
    is(n).forEach(function(l) {
        var c = {};
        for (a in i)
            c[a] = i[a];
        c.trigger = l,
        t.push(Y.create(c))
    }),
    t
}
;
var Wl = function(e, t, i, r) {
    return t > r ? e(r) : t < 0 && e(0),
    i > r ? (r - t) / (i - t) : i < 0 ? t / (t - i) : 1
}, No = function n(e, t) {
    t === !0 ? e.style.removeProperty("touch-action") : e.style.touchAction = t === !0 ? "auto" : t ? "pan-" + t + (Oe.isTouch ? " pinch-zoom" : "") : "none",
    e === si && n(me, t)
}, Ms = {
    auto: 1,
    scroll: 1
}, wf = function(e) {
    var t = e.event, i = e.target, r = e.axis, s = (t.changedTouches ? t.changedTouches[0] : t).target, o = s._gsap || I.core.getCache(s), a = at(), l;
    if (!o._isScrollT || a - o._isScrollT > 2e3) {
        for (; s && s !== me && (s.scrollHeight <= s.clientHeight && s.scrollWidth <= s.clientWidth || !(Ms[(l = Vt(s)).overflowY] || Ms[l.overflowX])); )
            s = s.parentNode;
        o._isScroll = s && s !== i && !Nn(s) && (Ms[(l = Vt(s)).overflowY] || Ms[l.overflowX]),
        o._isScrollT = a
    }
    (o._isScroll || r === "x") && (t.stopPropagation(),
    t._gsapAllow = !0)
}, qu = function(e, t, i, r) {
    return Oe.create({
        target: e,
        capture: !0,
        debounce: !1,
        lockAxis: !0,
        type: t,
        onWheel: r = r && wf,
        onPress: r,
        onDrag: r,
        onScroll: r,
        onEnable: function() {
            return i && Ve(be, Oe.eventTypes[0], Xl, !1, !0)
        },
        onDisable: function() {
            return Ue(be, Oe.eventTypes[0], Xl, !0)
        }
    })
}, xf = /(input|label|select|textarea)/i, Yl, Xl = function(e) {
    var t = xf.test(e.target.tagName);
    (t || Yl) && (e._gsapAllow = !0,
    Yl = t)
}, Tf = function(e) {
    vn(e) || (e = {}),
    e.preventDefault = e.isNormalizer = e.allowClicks = !0,
    e.type || (e.type = "wheel,touch"),
    e.debounce = !!e.debounce,
    e.id = e.id || "normalizer";
    var t = e, i = t.normalizeScrollX, r = t.momentum, s = t.allowNestedScroll, o = t.onRelease, a, l, c = St(e.target) || si, u = I.core.globals().ScrollSmoother, p = u && u.get(), d = ji && (e.content && St(e.content) || p && e.content !== !1 && !p.smooth() && p.content()), h = on(c, Be), m = on(c, wt), f = 1, w = (Oe.isTouch && ie.visualViewport ? ie.visualViewport.scale * ie.visualViewport.width : ie.outerWidth) / ie.innerWidth, _ = 0, v = xt(r) ? function() {
        return r(a)
    }
    : function() {
        return r || 2.8
    }
    , b, y, x = qu(c, e.type, !0, s), k = function() {
        return y = !1
    }, T = di, M = di, E = function() {
        l = gi(c, Be),
        M = Br(ji ? 1 : 0, l),
        i && (T = Br(0, gi(c, wt))),
        b = Ln
    }, C = function() {
        d._gsap.y = Lr(parseFloat(d._gsap.y) + h.offset) + "px",
        d.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + parseFloat(d._gsap.y) + ", 0, 1)",
        h.offset = h.cacheID = 0
    }, N = function() {
        if (y) {
            requestAnimationFrame(k);
            var Q = Lr(a.deltaY / 2)
              , V = M(h.v - Q);
            if (d && V !== h.v + h.offset) {
                h.offset = V - h.v;
                var S = Lr((parseFloat(d && d._gsap.y) || 0) - h.offset);
                d.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + S + ", 0, 1)",
                d._gsap.y = S + "px",
                h.cacheID = ee.cache,
                Oi()
            }
            return !0
        }
        h.offset && C(),
        y = !0
    }, A, $, L, B, W = function() {
        E(),
        A.isActive() && A.vars.scrollY > l && (h() > l ? A.progress(1) && h(l) : A.resetTo("scrollY", l))
    };
    return d && I.set(d, {
        y: "+=0"
    }),
    e.ignoreCheck = function(z) {
        return ji && z.type === "touchmove" && N() || f > 1.05 && z.type !== "touchstart" || a.isGesturing || z.touches && z.touches.length > 1
    }
    ,
    e.onPress = function() {
        y = !1;
        var z = f;
        f = Lr((ie.visualViewport && ie.visualViewport.scale || 1) / w),
        A.pause(),
        z !== f && No(c, f > 1.01 ? !0 : i ? !1 : "x"),
        $ = m(),
        L = h(),
        E(),
        b = Ln
    }
    ,
    e.onRelease = e.onGestureStart = function(z, Q) {
        if (h.offset && C(),
        !Q)
            B.restart(!0);
        else {
            ee.cache++;
            var V = v(), S, ce;
            i && (S = m(),
            ce = S + V * .05 * -z.velocityX / .227,
            V *= Wl(m, S, ce, gi(c, wt)),
            A.vars.scrollX = T(ce)),
            S = h(),
            ce = S + V * .05 * -z.velocityY / .227,
            V *= Wl(h, S, ce, gi(c, Be)),
            A.vars.scrollY = M(ce),
            A.invalidate().duration(V).play(.01),
            (ji && A.vars.scrollY >= l || S >= l - 1) && I.to({}, {
                onUpdate: W,
                duration: V
            })
        }
        o && o(z)
    }
    ,
    e.onWheel = function() {
        A._ts && A.pause(),
        at() - _ > 1e3 && (b = 0,
        _ = at())
    }
    ,
    e.onChange = function(z, Q, V, S, ce) {
        if (Ln !== b && E(),
        Q && i && m(T(S[2] === Q ? $ + (z.startX - z.x) : m() + Q - S[1])),
        V) {
            h.offset && C();
            var $e = ce[2] === V
              , Kt = $e ? L + z.startY - z.y : h() + V - ce[1]
              , xe = M(Kt);
            $e && Kt !== xe && (L += xe - Kt),
            h(xe)
        }
        (V || Q) && Oi()
    }
    ,
    e.onEnable = function() {
        No(c, i ? !1 : "x"),
        Y.addEventListener("refresh", W),
        Ve(ie, "resize", W),
        h.smooth && (h.target.style.scrollBehavior = "auto",
        h.smooth = m.smooth = !1),
        x.enable()
    }
    ,
    e.onDisable = function() {
        No(c, !0),
        Ue(ie, "resize", W),
        Y.removeEventListener("refresh", W),
        x.kill()
    }
    ,
    e.lockAxis = e.lockAxis !== !1,
    a = new Oe(e),
    a.iOS = ji,
    ji && !h() && h(1),
    ji && I.ticker.add(di),
    B = a._dc,
    A = I.to(a, {
        ease: "power4",
        paused: !0,
        inherit: !1,
        scrollX: i ? "+=0.1" : "+=0",
        scrollY: "+=0.1",
        modifiers: {
            scrollY: zu(h, h(), function() {
                return A.pause()
            })
        },
        onUpdate: Oi,
        onComplete: B.vars.onComplete
    }),
    a
};
Y.sort = function(n) {
    return J.sort(n || function(e, t) {
        return (e.vars.refreshPriority || 0) * -1e6 + e.start - (t.start + (t.vars.refreshPriority || 0) * -1e6)
    }
    )
}
;
Y.observe = function(n) {
    return new Oe(n)
}
;
Y.normalizeScroll = function(n) {
    if (typeof n > "u")
        return gt;
    if (n === !0 && gt)
        return gt.enable();
    if (n === !1) {
        gt && gt.kill(),
        gt = n;
        return
    }
    var e = n instanceof Oe ? n : Tf(n);
    return gt && gt.target === e.target && gt.kill(),
    Nn(e.target) && (gt = e),
    e
}
;
Y.core = {
    _getVelocityProp: oa,
    _inputObserver: qu,
    _scrollers: ee,
    _proxies: _i,
    bridge: {
        ss: function() {
            Xt || $n("scrollStart"),
            Xt = at()
        },
        ref: function() {
            return ot
        }
    }
};
Au() && I.registerPlugin(Y);
(function() {
    function n() {
        for (var i = arguments.length, r = 0; r < i; r++) {
            var s = r < 0 || arguments.length <= r ? void 0 : arguments[r];
            s.nodeType === 1 || s.nodeType === 11 ? this.appendChild(s) : this.appendChild(document.createTextNode(String(s)))
        }
    }
    function e() {
        for (; this.lastChild; )
            this.removeChild(this.lastChild);
        arguments.length && this.append.apply(this, arguments)
    }
    function t() {
        for (var i = this.parentNode, r = arguments.length, s = new Array(r), o = 0; o < r; o++)
            s[o] = arguments[o];
        var a = s.length;
        if (i)
            for (a || i.removeChild(this); a--; ) {
                var l = s[a];
                typeof l != "object" ? l = this.ownerDocument.createTextNode(l) : l.parentNode && l.parentNode.removeChild(l),
                a ? i.insertBefore(this.previousSibling, l) : i.replaceChild(l, this)
            }
    }
    typeof Element < "u" && (Element.prototype.append || (Element.prototype.append = n,
    DocumentFragment.prototype.append = n),
    Element.prototype.replaceChildren || (Element.prototype.replaceChildren = e,
    DocumentFragment.prototype.replaceChildren = e),
    Element.prototype.replaceWith || (Element.prototype.replaceWith = t,
    DocumentFragment.prototype.replaceWith = t))
}
)();
function Sf(n, e) {
    if (!(n instanceof e))
        throw new TypeError("Cannot call a class as a function")
}
function Gl(n, e) {
    for (var t = 0; t < e.length; t++) {
        var i = e[t];
        i.enumerable = i.enumerable || !1,
        i.configurable = !0,
        "value"in i && (i.writable = !0),
        Object.defineProperty(n, i.key, i)
    }
}
function Kl(n, e, t) {
    return e && Gl(n.prototype, e),
    t && Gl(n, t),
    n
}
function kf(n, e, t) {
    return e in n ? Object.defineProperty(n, e, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : n[e] = t,
    n
}
function Ql(n, e) {
    var t = Object.keys(n);
    if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(n);
        e && (i = i.filter(function(r) {
            return Object.getOwnPropertyDescriptor(n, r).enumerable
        })),
        t.push.apply(t, i)
    }
    return t
}
function Jl(n) {
    for (var e = 1; e < arguments.length; e++) {
        var t = arguments[e] != null ? arguments[e] : {};
        e % 2 ? Ql(Object(t), !0).forEach(function(i) {
            kf(n, i, t[i])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(t)) : Ql(Object(t)).forEach(function(i) {
            Object.defineProperty(n, i, Object.getOwnPropertyDescriptor(t, i))
        })
    }
    return n
}
function Bu(n, e) {
    return Ef(n) || Af(n, e) || Hu(n, e) || Of()
}
function bt(n) {
    return Cf(n) || Pf(n) || Hu(n) || Mf()
}
function Cf(n) {
    if (Array.isArray(n))
        return pa(n)
}
function Ef(n) {
    if (Array.isArray(n))
        return n
}
function Pf(n) {
    if (typeof Symbol < "u" && Symbol.iterator in Object(n))
        return Array.from(n)
}
function Af(n, e) {
    if (!(typeof Symbol > "u" || !(Symbol.iterator in Object(n)))) {
        var t = []
          , i = !0
          , r = !1
          , s = void 0;
        try {
            for (var o = n[Symbol.iterator](), a; !(i = (a = o.next()).done) && (t.push(a.value),
            !(e && t.length === e)); i = !0)
                ;
        } catch (l) {
            r = !0,
            s = l
        } finally {
            try {
                !i && o.return != null && o.return()
            } finally {
                if (r)
                    throw s
            }
        }
        return t
    }
}
function Hu(n, e) {
    if (n) {
        if (typeof n == "string")
            return pa(n, e);
        var t = Object.prototype.toString.call(n).slice(8, -1);
        if (t === "Object" && n.constructor && (t = n.constructor.name),
        t === "Map" || t === "Set")
            return Array.from(n);
        if (t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))
            return pa(n, e)
    }
}
function pa(n, e) {
    (e == null || e > n.length) && (e = n.length);
    for (var t = 0, i = new Array(e); t < e; t++)
        i[t] = n[t];
    return i
}
function Mf() {
    throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)
}
function Of() {
    throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)
}
function wn(n, e) {
    return Object.getOwnPropertyNames(Object(n)).reduce(function(t, i) {
        var r = Object.getOwnPropertyDescriptor(Object(n), i)
          , s = Object.getOwnPropertyDescriptor(Object(e), i);
        return Object.defineProperty(t, i, s || r)
    }, {})
}
function hs(n) {
    return typeof n == "string"
}
function nl(n) {
    return Array.isArray(n)
}
function Os() {
    var n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, e = wn(n), t;
    return e.types !== void 0 ? t = e.types : e.split !== void 0 && (t = e.split),
    t !== void 0 && (e.types = (hs(t) || nl(t) ? String(t) : "").split(",").map(function(i) {
        return String(i).trim()
    }).filter(function(i) {
        return /((line)|(word)|(char))/i.test(i)
    })),
    (e.absolute || e.position) && (e.absolute = e.absolute || /absolute/.test(n.position)),
    e
}
function rl(n) {
    var e = hs(n) || nl(n) ? String(n) : "";
    return {
        none: !e,
        lines: /line/i.test(e),
        words: /word/i.test(e),
        chars: /char/i.test(e)
    }
}
function po(n) {
    return n !== null && typeof n == "object"
}
function Lf(n) {
    return po(n) && /^(1|3|11)$/.test(n.nodeType)
}
function Df(n) {
    return typeof n == "number" && n > -1 && n % 1 === 0
}
function Rf(n) {
    return po(n) && Df(n.length)
}
function Fn(n) {
    return nl(n) ? n : n == null ? [] : Rf(n) ? Array.prototype.slice.call(n) : [n]
}
function Zl(n) {
    var e = n;
    return hs(n) && (/^(#[a-z]\w+)$/.test(n.trim()) ? e = document.getElementById(n.trim().slice(1)) : e = document.querySelectorAll(n)),
    Fn(e).reduce(function(t, i) {
        return [].concat(bt(t), bt(Fn(i).filter(Lf)))
    }, [])
}
var Nf = Object.entries
  , no = "_splittype"
  , oi = {}
  , If = 0;
function yi(n, e, t) {
    if (!po(n))
        return console.warn("[data.set] owner is not an object"),
        null;
    var i = n[no] || (n[no] = ++If)
      , r = oi[i] || (oi[i] = {});
    return t === void 0 ? e && Object.getPrototypeOf(e) === Object.prototype && (oi[i] = Jl(Jl({}, r), e)) : e !== void 0 && (r[e] = t),
    t
}
function xn(n, e) {
    var t = po(n) ? n[no] : null
      , i = t && oi[t] || {};
    return i
}
function ju(n) {
    var e = n && n[no];
    e && (delete n[e],
    delete oi[e])
}
function $f() {
    Object.keys(oi).forEach(function(n) {
        delete oi[n]
    })
}
function Ff() {
    Nf(oi).forEach(function(n) {
        var e = Bu(n, 2)
          , t = e[0]
          , i = e[1]
          , r = i.isRoot
          , s = i.isSplit;
        (!r || !s) && (oi[t] = null,
        delete oi[t])
    })
}
function zf(n) {
    var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : " "
      , t = n ? String(n) : "";
    return t.trim().replace(/\s+/g, " ").split(e)
}
var sl = "\\ud800-\\udfff"
  , Uu = "\\u0300-\\u036f\\ufe20-\\ufe23"
  , Vu = "\\u20d0-\\u20f0"
  , Wu = "\\ufe0e\\ufe0f"
  , qf = "[".concat(sl, "]")
  , ma = "[".concat(Uu).concat(Vu, "]")
  , ga = "\\ud83c[\\udffb-\\udfff]"
  , Bf = "(?:".concat(ma, "|").concat(ga, ")")
  , Yu = "[^".concat(sl, "]")
  , Xu = "(?:\\ud83c[\\udde6-\\uddff]){2}"
  , Gu = "[\\ud800-\\udbff][\\udc00-\\udfff]"
  , Ku = "\\u200d"
  , Qu = "".concat(Bf, "?")
  , Ju = "[".concat(Wu, "]?")
  , Hf = "(?:" + Ku + "(?:" + [Yu, Xu, Gu].join("|") + ")" + Ju + Qu + ")*"
  , jf = Ju + Qu + Hf
  , Uf = "(?:".concat(["".concat(Yu).concat(ma, "?"), ma, Xu, Gu, qf].join("|"), `
)`)
  , Vf = RegExp("".concat(ga, "(?=").concat(ga, ")|").concat(Uf).concat(jf), "g")
  , Wf = [Ku, sl, Uu, Vu, Wu]
  , Yf = RegExp("[".concat(Wf.join(""), "]"));
function Xf(n) {
    return n.split("")
}
function Zu(n) {
    return Yf.test(n)
}
function Gf(n) {
    return n.match(Vf) || []
}
function Kf(n) {
    return Zu(n) ? Gf(n) : Xf(n)
}
function Qf(n) {
    return n == null ? "" : String(n)
}
function Jf(n) {
    var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    return n = Qf(n),
    n && hs(n) && !e && Zu(n) ? Kf(n) : n.split(e)
}
function ya(n, e) {
    var t = document.createElement(n);
    return e && Object.keys(e).forEach(function(i) {
        var r = e[i]
          , s = hs(r) ? r.trim() : r;
        s === null || s === "" || (i === "children" ? t.append.apply(t, bt(Fn(s))) : t.setAttribute(i, s))
    }),
    t
}
var ol = {
    splitClass: "",
    lineClass: "line",
    wordClass: "word",
    charClass: "char",
    types: ["lines", "words", "chars"],
    absolute: !1,
    tagName: "div"
};
function Zf(n, e) {
    e = wn(ol, e);
    var t = rl(e.types)
      , i = e.tagName
      , r = n.nodeValue
      , s = document.createDocumentFragment()
      , o = []
      , a = [];
    return /^\s/.test(r) && s.append(" "),
    o = zf(r).reduce(function(l, c, u, p) {
        var d, h;
        return t.chars && (h = Jf(c).map(function(m) {
            var f = ya(i, {
                class: "".concat(e.splitClass, " ").concat(e.charClass),
                style: "display: inline-block;",
                children: m
            });
            return yi(f, "isChar", !0),
            a = [].concat(bt(a), [f]),
            f
        })),
        t.words || t.lines ? (d = ya(i, {
            class: "".concat(e.wordClass, " ").concat(e.splitClass),
            style: "display: inline-block; ".concat(t.words && e.absolute ? "position: relative;" : ""),
            children: t.chars ? h : c
        }),
        yi(d, {
            isWord: !0,
            isWordStart: !0,
            isWordEnd: !0
        }),
        s.appendChild(d)) : h.forEach(function(m) {
            s.appendChild(m)
        }),
        u < p.length - 1 && s.append(" "),
        t.words ? l.concat(d) : l
    }, []),
    /\s$/.test(r) && s.append(" "),
    n.replaceWith(s),
    {
        words: o,
        chars: a
    }
}
function eh(n, e) {
    var t = n.nodeType
      , i = {
        words: [],
        chars: []
    };
    if (!/(1|3|11)/.test(t))
        return i;
    if (t === 3 && /\S/.test(n.nodeValue))
        return Zf(n, e);
    var r = Fn(n.childNodes);
    if (r.length && (yi(n, "isSplit", !0),
    !xn(n).isRoot)) {
        n.style.display = "inline-block",
        n.style.position = "relative";
        var s = n.nextSibling
          , o = n.previousSibling
          , a = n.textContent || ""
          , l = s ? s.textContent : " "
          , c = o ? o.textContent : " ";
        yi(n, {
            isWordEnd: /\s$/.test(a) || /^\s/.test(l),
            isWordStart: /^\s/.test(a) || /\s$/.test(c)
        })
    }
    return r.reduce(function(u, p) {
        var d = eh(p, e)
          , h = d.words
          , m = d.chars;
        return {
            words: [].concat(bt(u.words), bt(h)),
            chars: [].concat(bt(u.chars), bt(m))
        }
    }, i)
}
function ep(n, e, t, i) {
    if (!t.absolute)
        return {
            top: e ? n.offsetTop : null
        };
    var r = n.offsetParent
      , s = Bu(i, 2)
      , o = s[0]
      , a = s[1]
      , l = 0
      , c = 0;
    if (r && r !== document.body) {
        var u = r.getBoundingClientRect();
        l = u.x + o,
        c = u.y + a
    }
    var p = n.getBoundingClientRect()
      , d = p.width
      , h = p.height
      , m = p.x
      , f = p.y
      , w = f + a - c
      , _ = m + o - l;
    return {
        width: d,
        height: h,
        top: w,
        left: _
    }
}
function th(n) {
    xn(n).isWord ? (ju(n),
    n.replaceWith.apply(n, bt(n.childNodes))) : Fn(n.children).forEach(function(e) {
        return th(e)
    })
}
var tp = function() {
    return document.createDocumentFragment()
};
function ip(n, e, t) {
    var i = rl(e.types), r = e.tagName, s = n.getElementsByTagName("*"), o = [], a = [], l = null, c, u, p, d = [], h = n.parentElement, m = n.nextElementSibling, f = tp(), w = window.getComputedStyle(n), _ = w.textAlign, v = parseFloat(w.fontSize), b = v * .2;
    return e.absolute && (p = {
        left: n.offsetLeft,
        top: n.offsetTop,
        width: n.offsetWidth
    },
    u = n.offsetWidth,
    c = n.offsetHeight,
    yi(n, {
        cssWidth: n.style.width,
        cssHeight: n.style.height
    })),
    Fn(s).forEach(function(y) {
        var x = y.parentElement === n
          , k = ep(y, x, e, t)
          , T = k.width
          , M = k.height
          , E = k.top
          , C = k.left;
        /^br$/i.test(y.nodeName) || (i.lines && x && ((l === null || E - l >= b) && (l = E,
        o.push(a = [])),
        a.push(y)),
        e.absolute && yi(y, {
            top: E,
            left: C,
            width: T,
            height: M
        }))
    }),
    h && h.removeChild(n),
    i.lines && (d = o.map(function(y) {
        var x = ya(r, {
            class: "".concat(e.splitClass, " ").concat(e.lineClass),
            style: "display: block; text-align: ".concat(_, "; width: 100%;")
        });
        yi(x, "isLine", !0);
        var k = {
            height: 0,
            top: 1e4
        };
        return f.appendChild(x),
        y.forEach(function(T, M, E) {
            var C = xn(T)
              , N = C.isWordEnd
              , A = C.top
              , $ = C.height
              , L = E[M + 1];
            k.height = Math.max(k.height, $),
            k.top = Math.min(k.top, A),
            x.appendChild(T),
            N && xn(L).isWordStart && x.append(" ")
        }),
        e.absolute && yi(x, {
            height: k.height,
            top: k.top
        }),
        x
    }),
    i.words || th(f),
    n.replaceChildren(f)),
    e.absolute && (n.style.width = "".concat(n.style.width || u, "px"),
    n.style.height = "".concat(c, "px"),
    Fn(s).forEach(function(y) {
        var x = xn(y)
          , k = x.isLine
          , T = x.top
          , M = x.left
          , E = x.width
          , C = x.height
          , N = xn(y.parentElement)
          , A = !k && N.isLine;
        y.style.top = "".concat(A ? T - N.top : T, "px"),
        y.style.left = k ? "".concat(p.left, "px") : "".concat(M - (A ? p.left : 0), "px"),
        y.style.height = "".concat(C, "px"),
        y.style.width = k ? "".concat(p.width, "px") : "".concat(E, "px"),
        y.style.position = "absolute"
    })),
    h && (m ? h.insertBefore(n, m) : h.appendChild(n)),
    d
}
var Xn = wn(ol, {})
  , va = function() {
    Kl(n, null, [{
        key: "clearData",
        value: function() {
            $f()
        }
    }, {
        key: "setDefaults",
        value: function(t) {
            return Xn = wn(Xn, Os(t)),
            ol
        }
    }, {
        key: "revert",
        value: function(t) {
            Zl(t).forEach(function(i) {
                var r = xn(i)
                  , s = r.isSplit
                  , o = r.html
                  , a = r.cssWidth
                  , l = r.cssHeight;
                s && (i.innerHTML = o,
                i.style.width = a || "",
                i.style.height = l || "",
                ju(i))
            })
        }
    }, {
        key: "create",
        value: function(t, i) {
            return new n(t,i)
        }
    }, {
        key: "data",
        get: function() {
            return oi
        }
    }, {
        key: "defaults",
        get: function() {
            return Xn
        },
        set: function(t) {
            Xn = wn(Xn, Os(t))
        }
    }]);
    function n(e, t) {
        Sf(this, n),
        this.isSplit = !1,
        this.settings = wn(Xn, Os(t)),
        this.elements = Zl(e),
        this.split()
    }
    return Kl(n, [{
        key: "split",
        value: function(t) {
            var i = this;
            this.revert(),
            this.elements.forEach(function(o) {
                yi(o, "html", o.innerHTML)
            }),
            this.lines = [],
            this.words = [],
            this.chars = [];
            var r = [window.pageXOffset, window.pageYOffset];
            t !== void 0 && (this.settings = wn(this.settings, Os(t)));
            var s = rl(this.settings.types);
            s.none || (this.elements.forEach(function(o) {
                yi(o, "isRoot", !0);
                var a = eh(o, i.settings)
                  , l = a.words
                  , c = a.chars;
                i.words = [].concat(bt(i.words), bt(l)),
                i.chars = [].concat(bt(i.chars), bt(c))
            }),
            this.elements.forEach(function(o) {
                if (s.lines || i.settings.absolute) {
                    var a = ip(o, i.settings, r);
                    i.lines = [].concat(bt(i.lines), bt(a))
                }
            }),
            this.isSplit = !0,
            window.scrollTo(r[0], r[1]),
            Ff())
        }
    }, {
        key: "revert",
        value: function() {
            this.isSplit && (this.lines = null,
            this.words = null,
            this.chars = null,
            this.isSplit = !1),
            n.revert(this.elements)
        }
    }]),
    n
}();
function ih(n, e, t, i) {
    let r, s;
    r = {
        types: "chars",
        charClass: "split-wrap"
    },
    s = {
        types: "chars",
        charClass: "split-inner"
    };
    const o = (l, c) => va.create(l, c);
    let a = o(e, r);
    a.isSplit && a.revert(),
    document.querySelector(e).innerText = i,
    a = o(e, r),
    o(t, s)
}
function Bs(n) {
    ih("chars", ".overlay-transition__next-page-inner", ".overlay-transition__next-page-inner .split-wrap", n)
}
function nh() {
    return window.matchMedia("(max-width: 1200px), (orientation: portrait)").matches
}
class np {
    constructor(e, t, i, r, s) {
        this.animationFrameId = null,
        this.small = {
            $element: document.querySelector(e),
            default: t.default,
            hover: t.hover
        },
        this.big = {
            $element: document.querySelector(i),
            default: r.default,
            hover: r.hover
        };
        const o = document.querySelector(s);
        o && (this.text = {
            $element: o,
            selector: s,
            $splitWrapElement: o.querySelector(".split-wrap"),
            splitWrapSelector: `${s} .split-wrap`,
            $splitInnerElement: o.querySelector(".split-inner"),
            splitInnerSelector: `${s} .split-inner`
        })
    }
    movePointer(e) {
        const {clientX: t, clientY: i} = e;
        this.small.$element,
        this.big.$element,
        this.animationFrameId && cancelAnimationFrame(this.animationFrameId);
        const r = () => {
            F.to(this.small.$element, {
                duration: .1,
                x: t,
                y: i
            }),
            F.to(this.big.$element, {
                duration: .3,
                x: t,
                y: i
            })
        }
        ;
        this.animationFrameId = requestAnimationFrame(r)
    }
    async copyTargetText() {
        try {
            await navigator.clipboard.writeText("alviislam911@gmail.com")
        } catch (e) {
            console.error("Failed to copy text to clipboard", e)
        }
    }
    adjustPointer(e, t, i=!1) {
        const r = {
            duration: .5,
            ease: "Expo.easeOut"
        };
        F.to(this.small.$element, {
            duration: r.duration,
            ease: r.ease,
            width: i ? 0 : e ? this.small.hover.size : this.small.default.size,
            height: i ? 0 : e ? this.small.hover.size : this.small.default.size,
            display: i ? "none" : "flex"
        }),
        F.to(this.big.$element, {
            duration: r.duration,
            ease: r.ease,
            width: i ? 0 : e ? this.big.hover.size : this.big.default.size,
            height: i ? 0 : e ? this.big.hover.size : this.big.default.size,
            display: i ? "none" : "flex",
            outlineOffset: t && e ? this.big.hover.outlineOffset : "0rem",
            opacity: t ? e ? 1 : this.big.default.opacity : this.big.default.opacity,
            backgroundColor: t ? e ? this.big.hover.bgColor : this.big.default.bgColor : this.big.default.bgColor,
            backdropFilter: t ? e ? this.big.hover.bgBlur : this.big.default.bgBlur : this.big.default.bgBlur
        }),
        t && (e ? F.fromTo(this.text.splitInnerSelector, {
            y: "100%",
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            stagger: .02,
            duration: r.duration,
            ease: r.ease
        }) : F.to(this.text.splitInnerSelector, {
            y: "-100%",
            opacity: 0,
            stagger: .02,
            duration: r.duration,
            ease: r.ease
        }))
    }
    changePointerText(e) {
        this.text && this.text.$element.textContent !== e && ih("chars", this.text.selector, this.text.splitWrapSelector, e)
    }
}
function D(n, e, t) {
    return (e = sp(e))in n ? Object.defineProperty(n, e, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : n[e] = t,
    n
}
function rp(n, e) {
    if (typeof n != "object" || n === null)
        return n;
    var t = n[Symbol.toPrimitive];
    if (t !== void 0) {
        var i = t.call(n, e || "default");
        if (typeof i != "object")
            return i;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (e === "string" ? String : Number)(n)
}
function sp(n) {
    var e = rp(n, "string");
    return typeof e == "symbol" ? e : String(e)
}
function op(n, e) {
    if (!(n instanceof e))
        throw new TypeError("Cannot call a class as a function")
}
function ec(n, e) {
    for (var t = 0; t < e.length; t++) {
        var i = e[t];
        i.enumerable = i.enumerable || !1,
        i.configurable = !0,
        "value"in i && (i.writable = !0),
        Object.defineProperty(n, i.key, i)
    }
}
function ap(n, e, t) {
    return e && ec(n.prototype, e),
    t && ec(n, t),
    n
}
function lp(n, e, t) {
    return e in n ? Object.defineProperty(n, e, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : n[e] = t,
    n
}
function tc(n, e) {
    var t = Object.keys(n);
    if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(n);
        e && (i = i.filter(function(r) {
            return Object.getOwnPropertyDescriptor(n, r).enumerable
        })),
        t.push.apply(t, i)
    }
    return t
}
function ic(n) {
    for (var e = 1; e < arguments.length; e++) {
        var t = arguments[e] != null ? arguments[e] : {};
        e % 2 ? tc(Object(t), !0).forEach(function(i) {
            lp(n, i, t[i])
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(t)) : tc(Object(t)).forEach(function(i) {
            Object.defineProperty(n, i, Object.getOwnPropertyDescriptor(t, i))
        })
    }
    return n
}
var nc = {
    addCSS: !0,
    thumbWidth: 15,
    watch: !0
};
function cp(n, e) {
    return function() {
        return Array.from(document.querySelectorAll(e)).includes(this)
    }
    .call(n, e)
}
function up(n, e) {
    if (n && e) {
        var t = new Event(e,{
            bubbles: !0
        });
        n.dispatchEvent(t)
    }
}
var ds = function(n) {
    return n != null ? n.constructor : null
}
  , al = function(n, e) {
    return !!(n && e && n instanceof e)
}
  , rh = function(n) {
    return n == null
}
  , sh = function(n) {
    return ds(n) === Object
}
  , hp = function(n) {
    return ds(n) === Number && !Number.isNaN(n)
}
  , oh = function(n) {
    return ds(n) === String
}
  , dp = function(n) {
    return ds(n) === Boolean
}
  , fp = function(n) {
    return ds(n) === Function
}
  , ah = function(n) {
    return Array.isArray(n)
}
  , lh = function(n) {
    return al(n, NodeList)
}
  , pp = function(n) {
    return al(n, Element)
}
  , mp = function(n) {
    return al(n, Event)
}
  , gp = function(n) {
    return rh(n) || (oh(n) || ah(n) || lh(n)) && !n.length || sh(n) && !Object.keys(n).length
}
  , st = {
    nullOrUndefined: rh,
    object: sh,
    number: hp,
    string: oh,
    boolean: dp,
    function: fp,
    array: ah,
    nodeList: lh,
    element: pp,
    event: mp,
    empty: gp
};
function yp(n) {
    var e = "".concat(n).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    return e ? Math.max(0, (e[1] ? e[1].length : 0) - (e[2] ? +e[2] : 0)) : 0
}
function vp(n, e) {
    if (1 > e) {
        var t = yp(e);
        return parseFloat(n.toFixed(t))
    }
    return Math.round(n / e) * e
}
var bp = function() {
    function n(e, t) {
        op(this, n),
        st.element(e) ? this.element = e : st.string(e) && (this.element = document.querySelector(e)),
        st.element(this.element) && st.empty(this.element.rangeTouch) && (this.config = ic({}, nc, {}, t),
        this.init())
    }
    return ap(n, [{
        key: "init",
        value: function() {
            n.enabled && (this.config.addCSS && (this.element.style.userSelect = "none",
            this.element.style.webKitUserSelect = "none",
            this.element.style.touchAction = "manipulation"),
            this.listeners(!0),
            this.element.rangeTouch = this)
        }
    }, {
        key: "destroy",
        value: function() {
            n.enabled && (this.config.addCSS && (this.element.style.userSelect = "",
            this.element.style.webKitUserSelect = "",
            this.element.style.touchAction = ""),
            this.listeners(!1),
            this.element.rangeTouch = null)
        }
    }, {
        key: "listeners",
        value: function(e) {
            var t = this
              , i = e ? "addEventListener" : "removeEventListener";
            ["touchstart", "touchmove", "touchend"].forEach(function(r) {
                t.element[i](r, function(s) {
                    return t.set(s)
                }, !1)
            })
        }
    }, {
        key: "get",
        value: function(e) {
            if (!n.enabled || !st.event(e))
                return null;
            var t, i = e.target, r = e.changedTouches[0], s = parseFloat(i.getAttribute("min")) || 0, o = parseFloat(i.getAttribute("max")) || 100, a = parseFloat(i.getAttribute("step")) || 1, l = i.getBoundingClientRect(), c = 100 / l.width * (this.config.thumbWidth / 2) / 100;
            return 0 > (t = 100 / l.width * (r.clientX - l.left)) ? t = 0 : 100 < t && (t = 100),
            50 > t ? t -= (100 - 2 * t) * c : 50 < t && (t += 2 * (t - 50) * c),
            s + vp(t / 100 * (o - s), a)
        }
    }, {
        key: "set",
        value: function(e) {
            n.enabled && st.event(e) && !e.target.disabled && (e.preventDefault(),
            e.target.value = this.get(e),
            up(e.target, e.type === "touchend" ? "change" : "input"))
        }
    }], [{
        key: "setup",
        value: function(e) {
            var t = 1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : {}
              , i = null;
            if (st.empty(e) || st.string(e) ? i = Array.from(document.querySelectorAll(st.string(e) ? e : 'input[type="range"]')) : st.element(e) ? i = [e] : st.nodeList(e) ? i = Array.from(e) : st.array(e) && (i = e.filter(st.element)),
            st.empty(i))
                return null;
            var r = ic({}, nc, {}, t);
            if (st.string(e) && r.watch) {
                var s = new MutationObserver(function(o) {
                    Array.from(o).forEach(function(a) {
                        Array.from(a.addedNodes).forEach(function(l) {
                            st.element(l) && cp(l, e) && new n(l,r)
                        })
                    })
                }
                );
                s.observe(document.body, {
                    childList: !0,
                    subtree: !0
                })
            }
            return i.map(function(o) {
                return new n(o,t)
            })
        }
    }, {
        key: "enabled",
        get: function() {
            return "ontouchstart"in document.documentElement
        }
    }]),
    n
}();
const fs = n => n != null ? n.constructor : null
  , Ri = (n, e) => !!(n && e && n instanceof e)
  , ll = n => n == null
  , ch = n => fs(n) === Object
  , _p = n => fs(n) === Number && !Number.isNaN(n)
  , mo = n => fs(n) === String
  , wp = n => fs(n) === Boolean
  , uh = n => typeof n == "function"
  , hh = n => Array.isArray(n)
  , xp = n => Ri(n, WeakMap)
  , dh = n => Ri(n, NodeList)
  , Tp = n => fs(n) === Text
  , Sp = n => Ri(n, Event)
  , kp = n => Ri(n, KeyboardEvent)
  , Cp = n => Ri(n, window.TextTrackCue) || Ri(n, window.VTTCue)
  , Ep = n => Ri(n, TextTrack) || !ll(n) && mo(n.kind)
  , Pp = n => Ri(n, Promise) && uh(n.then)
  , Ap = n => n !== null && typeof n == "object" && n.nodeType === 1 && typeof n.style == "object" && typeof n.ownerDocument == "object"
  , fh = n => ll(n) || (mo(n) || hh(n) || dh(n)) && !n.length || ch(n) && !Object.keys(n).length
  , Mp = n => {
    if (Ri(n, window.URL))
        return !0;
    if (!mo(n))
        return !1;
    let e = n;
    n.startsWith("http://") && n.startsWith("https://") || (e = `http://${n}`);
    try {
        return !fh(new URL(e).hostname)
    } catch {
        return !1
    }
}
;
var g = {
    nullOrUndefined: ll,
    object: ch,
    number: _p,
    string: mo,
    boolean: wp,
    function: uh,
    array: hh,
    weakMap: xp,
    nodeList: dh,
    element: Ap,
    textNode: Tp,
    event: Sp,
    keyboardEvent: kp,
    cue: Cp,
    track: Ep,
    promise: Pp,
    url: Mp,
    empty: fh
};
const ba = ( () => {
    const n = document.createElement("span")
      , e = {
        WebkitTransition: "webkitTransitionEnd",
        MozTransition: "transitionend",
        OTransition: "oTransitionEnd otransitionend",
        transition: "transitionend"
    }
      , t = Object.keys(e).find(i => n.style[i] !== void 0);
    return !!g.string(t) && e[t]
}
)();
function ph(n, e) {
    setTimeout( () => {
        try {
            n.hidden = !0,
            n.offsetHeight,
            n.hidden = !1
        } catch {}
    }
    , e)
}
const Op = !!window.document.documentMode
  , Lp = /Edge/g.test(navigator.userAgent)
  , Dp = "WebkitAppearance"in document.documentElement.style && !/Edge/g.test(navigator.userAgent)
  , Rp = /iPhone|iPod/gi.test(navigator.userAgent) && navigator.maxTouchPoints > 1
  , Np = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1
  , Ip = /iPad|iPhone|iPod/gi.test(navigator.userAgent) && navigator.maxTouchPoints > 1;
var Ye = {
    isIE: Op,
    isEdge: Lp,
    isWebKit: Dp,
    isIPhone: Rp,
    isIPadOS: Np,
    isIos: Ip
};
function $p(n) {
    return JSON.parse(JSON.stringify(n))
}
function mh(n, e) {
    return e.split(".").reduce( (t, i) => t && t[i], n)
}
function Pe(n={}, ...e) {
    if (!e.length)
        return n;
    const t = e.shift();
    return g.object(t) ? (Object.keys(t).forEach(i => {
        g.object(t[i]) ? (Object.keys(n).includes(i) || Object.assign(n, {
            [i]: {}
        }),
        Pe(n[i], t[i])) : Object.assign(n, {
            [i]: t[i]
        })
    }
    ),
    Pe(n, ...e)) : n
}
function gh(n, e) {
    const t = n.length ? n : [n];
    Array.from(t).reverse().forEach( (i, r) => {
        const s = r > 0 ? e.cloneNode(!0) : e
          , o = i.parentNode
          , a = i.nextSibling;
        s.appendChild(i),
        a ? o.insertBefore(s, a) : o.appendChild(s)
    }
    )
}
function _a(n, e) {
    g.element(n) && !g.empty(e) && Object.entries(e).filter( ([,t]) => !g.nullOrUndefined(t)).forEach( ([t,i]) => n.setAttribute(t, i))
}
function j(n, e, t) {
    const i = document.createElement(n);
    return g.object(e) && _a(i, e),
    g.string(t) && (i.innerText = t),
    i
}
function Fp(n, e) {
    g.element(n) && g.element(e) && e.parentNode.insertBefore(n, e.nextSibling)
}
function rc(n, e, t, i) {
    g.element(e) && e.appendChild(j(n, t, i))
}
function Mi(n) {
    g.nodeList(n) || g.array(n) ? Array.from(n).forEach(Mi) : g.element(n) && g.element(n.parentNode) && n.parentNode.removeChild(n)
}
function Hs(n) {
    if (!g.element(n))
        return;
    let {length: e} = n.childNodes;
    for (; e > 0; )
        n.removeChild(n.lastChild),
        e -= 1
}
function ro(n, e) {
    return g.element(e) && g.element(e.parentNode) && g.element(n) ? (e.parentNode.replaceChild(n, e),
    n) : null
}
function ui(n, e) {
    if (!g.string(n) || g.empty(n))
        return {};
    const t = {}
      , i = Pe({}, e);
    return n.split(",").forEach(r => {
        const s = r.trim()
          , o = s.replace(".", "")
          , a = s.replace(/[[\]]/g, "").split("=")
          , [l] = a
          , c = a.length > 1 ? a[1].replace(/["']/g, "") : "";
        switch (s.charAt(0)) {
        case ".":
            g.string(i.class) ? t.class = `${i.class} ${o}` : t.class = o;
            break;
        case "#":
            t.id = s.replace("#", "");
            break;
        case "[":
            t[l] = c
        }
    }
    ),
    Pe(i, t)
}
function mn(n, e) {
    if (!g.element(n))
        return;
    let t = e;
    g.boolean(t) || (t = !n.hidden),
    n.hidden = t
}
function le(n, e, t) {
    if (g.nodeList(n))
        return Array.from(n).map(i => le(i, e, t));
    if (g.element(n)) {
        let i = "toggle";
        return t !== void 0 && (i = t ? "add" : "remove"),
        n.classList[i](e),
        n.classList.contains(e)
    }
    return !1
}
function so(n, e) {
    return g.element(n) && n.classList.contains(e)
}
function Tn(n, e) {
    const {prototype: t} = Element;
    return (t.matches || t.webkitMatchesSelector || t.mozMatchesSelector || t.msMatchesSelector || function() {
        return Array.from(document.querySelectorAll(e)).includes(this)
    }
    ).call(n, e)
}
function zp(n, e) {
    const {prototype: t} = Element;
    return (t.closest || function() {
        let i = this;
        do {
            if (Tn.matches(i, e))
                return i;
            i = i.parentElement || i.parentNode
        } while (i !== null && i.nodeType === 1);
        return null
    }
    ).call(n, e)
}
function rs(n) {
    return this.elements.container.querySelectorAll(n)
}
function ze(n) {
    return this.elements.container.querySelector(n)
}
function Io(n=null, e=!1) {
    g.element(n) && n.focus({
        preventScroll: !0,
        focusVisible: e
    })
}
const sc = {
    "audio/ogg": "vorbis",
    "audio/wav": "1",
    "video/webm": "vp8, vorbis",
    "video/mp4": "avc1.42E01E, mp4a.40.2",
    "video/ogg": "theora"
}
  , Ae = {
    audio: "canPlayType"in document.createElement("audio"),
    video: "canPlayType"in document.createElement("video"),
    check(n, e) {
        const t = Ae[n] || e !== "html5";
        return {
            api: t,
            ui: t && Ae.rangeInput
        }
    },
    pip: !(Ye.isIPhone || !g.function(j("video").webkitSetPresentationMode) && (!document.pictureInPictureEnabled || j("video").disablePictureInPicture)),
    airplay: g.function(window.WebKitPlaybackTargetAvailabilityEvent),
    playsinline: "playsInline"in document.createElement("video"),
    mime(n) {
        if (g.empty(n))
            return !1;
        const [e] = n.split("/");
        let t = n;
        if (!this.isHTML5 || e !== this.type)
            return !1;
        Object.keys(sc).includes(t) && (t += `; codecs="${sc[n]}"`);
        try {
            return !!(t && this.media.canPlayType(t).replace(/no/, ""))
        } catch {
            return !1
        }
    },
    textTracks: "textTracks"in document.createElement("video"),
    rangeInput: ( () => {
        const n = document.createElement("input");
        return n.type = "range",
        n.type === "range"
    }
    )(),
    touch: "ontouchstart"in document.documentElement,
    transitions: ba !== !1,
    reducedMotion: "matchMedia"in window && window.matchMedia("(prefers-reduced-motion)").matches
}
  , qp = ( () => {
    let n = !1;
    try {
        const e = Object.defineProperty({}, "passive", {
            get: () => (n = !0,
            null)
        });
        window.addEventListener("test", null, e),
        window.removeEventListener("test", null, e)
    } catch {}
    return n
}
)();
function ss(n, e, t, i=!1, r=!0, s=!1) {
    if (!n || !("addEventListener"in n) || g.empty(e) || !g.function(t))
        return;
    const o = e.split(" ");
    let a = s;
    qp && (a = {
        passive: r,
        capture: s
    }),
    o.forEach(l => {
        this && this.eventListeners && i && this.eventListeners.push({
            element: n,
            type: l,
            callback: t,
            options: a
        }),
        n[i ? "addEventListener" : "removeEventListener"](l, t, a)
    }
    )
}
function re(n, e="", t, i=!0, r=!1) {
    ss.call(this, n, e, t, !0, i, r)
}
function go(n, e="", t, i=!0, r=!1) {
    ss.call(this, n, e, t, !1, i, r)
}
function cl(n, e="", t, i=!0, r=!1) {
    const s = (...o) => {
        go(n, e, s, i, r),
        t.apply(this, o)
    }
    ;
    ss.call(this, n, e, s, !0, i, r)
}
function U(n, e="", t=!1, i={}) {
    if (!g.element(n) || g.empty(e))
        return;
    const r = new CustomEvent(e,{
        bubbles: t,
        detail: {
            ...i,
            plyr: this
        }
    });
    n.dispatchEvent(r)
}
function Bp() {
    this && this.eventListeners && (this.eventListeners.forEach(n => {
        const {element: e, type: t, callback: i, options: r} = n;
        e.removeEventListener(t, i, r)
    }
    ),
    this.eventListeners = [])
}
function Hp() {
    return new Promise(n => this.ready ? setTimeout(n, 0) : re.call(this, this.elements.container, "ready", n)).then( () => {}
    )
}
function pi(n) {
    g.promise(n) && n.then(null, () => {}
    )
}
function wa(n) {
    return g.array(n) ? n.filter( (e, t) => n.indexOf(e) === t) : n
}
function yh(n, e) {
    return g.array(n) && n.length ? n.reduce( (t, i) => Math.abs(i - e) < Math.abs(t - e) ? i : t) : null
}
function vh(n) {
    return !(!window || !window.CSS) && window.CSS.supports(n)
}
const oc = [[1, 1], [4, 3], [3, 4], [5, 4], [4, 5], [3, 2], [2, 3], [16, 10], [10, 16], [16, 9], [9, 16], [21, 9], [9, 21], [32, 9], [9, 32]].reduce( (n, [e,t]) => ({
    ...n,
    [e / t]: [e, t]
}), {});
function bh(n) {
    return g.array(n) || g.string(n) && n.includes(":") ? (g.array(n) ? n : n.split(":")).map(Number).every(g.number) : !1
}
function oo(n) {
    if (!g.array(n) || !n.every(g.number))
        return null;
    const [e,t] = n
      , i = (s, o) => o === 0 ? s : i(o, s % o)
      , r = i(e, t);
    return [e / r, t / r]
}
function ul(n) {
    const e = i => bh(i) ? i.split(":").map(Number) : null;
    let t = e(n);
    if (t === null && (t = e(this.config.ratio)),
    t === null && !g.empty(this.embed) && g.array(this.embed.ratio) && ({ratio: t} = this.embed),
    t === null && this.isHTML5) {
        const {videoWidth: i, videoHeight: r} = this.media;
        t = [i, r]
    }
    return oo(t)
}
function mr(n) {
    if (!this.isVideo)
        return {};
    const {wrapper: e} = this.elements
      , t = ul.call(this, n);
    if (!g.array(t))
        return {};
    const [i,r] = oo(t)
      , s = 100 / i * r;
    if (vh(`aspect-ratio: ${i}/${r}`) ? e.style.aspectRatio = `${i}/${r}` : e.style.paddingBottom = `${s}%`,
    this.isVimeo && !this.config.vimeo.premium && this.supported.ui) {
        const o = 100 / this.media.offsetWidth * parseInt(window.getComputedStyle(this.media).paddingBottom, 10)
          , a = (o - s) / (o / 50);
        this.fullscreen.active ? e.style.paddingBottom = null : this.media.style.transform = `translateY(-${a}%)`
    } else
        this.isHTML5 && e.classList.add(this.config.classNames.videoFixedRatio);
    return {
        padding: s,
        ratio: t
    }
}
function _h(n, e, t=.05) {
    const i = n / e
      , r = yh(Object.keys(oc), i);
    return Math.abs(r - i) <= t ? oc[r] : [n, e]
}
function jp() {
    return [Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0), Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)]
}
const Zi = {
    getSources() {
        return this.isHTML5 ? Array.from(this.media.querySelectorAll("source")).filter(n => {
            const e = n.getAttribute("type");
            return !!g.empty(e) || Ae.mime.call(this, e)
        }
        ) : []
    },
    getQualityOptions() {
        return this.config.quality.forced ? this.config.quality.options : Zi.getSources.call(this).map(n => Number(n.getAttribute("size"))).filter(Boolean)
    },
    setup() {
        if (!this.isHTML5)
            return;
        const n = this;
        n.options.speed = n.config.speed.options,
        g.empty(this.config.ratio) || mr.call(n),
        Object.defineProperty(n.media, "quality", {
            get() {
                const e = Zi.getSources.call(n).find(t => t.getAttribute("src") === n.source);
                return e && Number(e.getAttribute("size"))
            },
            set(e) {
                if (n.quality !== e) {
                    if (n.config.quality.forced && g.function(n.config.quality.onChange))
                        n.config.quality.onChange(e);
                    else {
                        const t = Zi.getSources.call(n).find(l => Number(l.getAttribute("size")) === e);
                        if (!t)
                            return;
                        const {currentTime: i, paused: r, preload: s, readyState: o, playbackRate: a} = n.media;
                        n.media.src = t.getAttribute("src"),
                        (s !== "none" || o) && (n.once("loadedmetadata", () => {
                            n.speed = a,
                            n.currentTime = i,
                            r || pi(n.play())
                        }
                        ),
                        n.media.load())
                    }
                    U.call(n, n.media, "qualitychange", !1, {
                        quality: e
                    })
                }
            }
        })
    },
    cancelRequests() {
        this.isHTML5 && (Mi(Zi.getSources.call(this)),
        this.media.setAttribute("src", this.config.blankVideo),
        this.media.load(),
        this.debug.log("Cancelled network requests"))
    }
};
function Up(n) {
    return `${n}-${Math.floor(1e4 * Math.random())}`
}
function xa(n, ...e) {
    return g.empty(n) ? n : n.toString().replace(/{(\d+)}/g, (t, i) => e[i].toString())
}
function Vp(n, e) {
    return n === 0 || e === 0 || Number.isNaN(n) || Number.isNaN(e) ? 0 : (n / e * 100).toFixed(2)
}
const Yr = (n="", e="", t="") => n.replace(new RegExp(e.toString().replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1"),"g"), t.toString())
  , wh = (n="") => n.toString().replace(/\w\S*/g, e => e.charAt(0).toUpperCase() + e.slice(1).toLowerCase());
function Wp(n="") {
    let e = n.toString();
    return e = Yr(e, "-", " "),
    e = Yr(e, "_", " "),
    e = wh(e),
    Yr(e, " ", "")
}
function Yp(n="") {
    let e = n.toString();
    return e = Wp(e),
    e.charAt(0).toLowerCase() + e.slice(1)
}
function Xp(n) {
    const e = document.createDocumentFragment()
      , t = document.createElement("div");
    return e.appendChild(t),
    t.innerHTML = n,
    e.firstChild.innerText
}
function Gp(n) {
    const e = document.createElement("div");
    return e.appendChild(n),
    e.innerHTML
}
const ac = {
    pip: "PIP",
    airplay: "AirPlay",
    html5: "HTML5",
    vimeo: "Vimeo",
    youtube: "YouTube"
}
  , We = {
    get(n="", e={}) {
        if (g.empty(n) || g.empty(e))
            return "";
        let t = mh(e.i18n, n);
        if (g.empty(t))
            return Object.keys(ac).includes(n) ? ac[n] : "";
        const i = {
            "{seektime}": e.seekTime,
            "{title}": e.title
        };
        return Object.entries(i).forEach( ([r,s]) => {
            t = Yr(t, r, s)
        }
        ),
        t
    }
};
class os {
    constructor(e) {
        D(this, "get", t => {
            if (!os.supported || !this.enabled)
                return null;
            const i = window.localStorage.getItem(this.key);
            if (g.empty(i))
                return null;
            const r = JSON.parse(i);
            return g.string(t) && t.length ? r[t] : r
        }
        ),
        D(this, "set", t => {
            if (!os.supported || !this.enabled || !g.object(t))
                return;
            let i = this.get();
            g.empty(i) && (i = {}),
            Pe(i, t);
            try {
                window.localStorage.setItem(this.key, JSON.stringify(i))
            } catch {}
        }
        ),
        this.enabled = e.config.storage.enabled,
        this.key = e.config.storage.key
    }
    static get supported() {
        try {
            if (!("localStorage"in window))
                return !1;
            const e = "___test";
            return window.localStorage.setItem(e, e),
            window.localStorage.removeItem(e),
            !0
        } catch {
            return !1
        }
    }
}
function ps(n, e="text") {
    return new Promise( (t, i) => {
        try {
            const r = new XMLHttpRequest;
            if (!("withCredentials"in r))
                return;
            r.addEventListener("load", () => {
                if (e === "text")
                    try {
                        t(JSON.parse(r.responseText))
                    } catch {
                        t(r.responseText)
                    }
                else
                    t(r.response)
            }
            ),
            r.addEventListener("error", () => {
                throw new Error(r.status)
            }
            ),
            r.open("GET", n, !0),
            r.responseType = e,
            r.send()
        } catch (r) {
            i(r)
        }
    }
    )
}
function xh(n, e) {
    if (!g.string(n))
        return;
    const t = "cache"
      , i = g.string(e);
    let r = !1;
    const s = () => document.getElementById(e) !== null
      , o = (a, l) => {
        a.innerHTML = l,
        i && s() || document.body.insertAdjacentElement("afterbegin", a)
    }
    ;
    if (!i || !s()) {
        const a = os.supported
          , l = document.createElement("div");
        if (l.setAttribute("hidden", ""),
        i && l.setAttribute("id", e),
        a) {
            const c = window.localStorage.getItem(`${t}-${e}`);
            if (r = c !== null,
            r) {
                const u = JSON.parse(c);
                o(l, u.content)
            }
        }
        ps(n).then(c => {
            if (!g.empty(c)) {
                if (a)
                    try {
                        window.localStorage.setItem(`${t}-${e}`, JSON.stringify({
                            content: c
                        }))
                    } catch {}
                o(l, c)
            }
        }
        ).catch( () => {}
        )
    }
}
const Th = n => Math.trunc(n / 60 / 60 % 60, 10)
  , Kp = n => Math.trunc(n / 60 % 60, 10)
  , Qp = n => Math.trunc(n % 60, 10);
function yo(n=0, e=!1, t=!1) {
    if (!g.number(n))
        return yo(void 0, e, t);
    const i = a => `0${a}`.slice(-2);
    let r = Th(n);
    const s = Kp(n)
      , o = Qp(n);
    return r = e || r > 0 ? `${r}:` : "",
    `${t && n > 0 ? "-" : ""}${r}${i(s)}:${i(o)}`
}
const O = {
    getIconUrl() {
        const n = new URL(this.config.iconUrl,window.location)
          , e = window.location.host ? window.location.host : window.top.location.host
          , t = n.host !== e || Ye.isIE && !window.svg4everybody;
        return {
            url: this.config.iconUrl,
            cors: t
        }
    },
    findElements() {
        try {
            return this.elements.controls = ze.call(this, this.config.selectors.controls.wrapper),
            this.elements.buttons = {
                play: rs.call(this, this.config.selectors.buttons.play),
                pause: ze.call(this, this.config.selectors.buttons.pause),
                restart: ze.call(this, this.config.selectors.buttons.restart),
                rewind: ze.call(this, this.config.selectors.buttons.rewind),
                fastForward: ze.call(this, this.config.selectors.buttons.fastForward),
                mute: ze.call(this, this.config.selectors.buttons.mute),
                pip: ze.call(this, this.config.selectors.buttons.pip),
                airplay: ze.call(this, this.config.selectors.buttons.airplay),
                settings: ze.call(this, this.config.selectors.buttons.settings),
                captions: ze.call(this, this.config.selectors.buttons.captions),
                fullscreen: ze.call(this, this.config.selectors.buttons.fullscreen)
            },
            this.elements.progress = ze.call(this, this.config.selectors.progress),
            this.elements.inputs = {
                seek: ze.call(this, this.config.selectors.inputs.seek),
                volume: ze.call(this, this.config.selectors.inputs.volume)
            },
            this.elements.display = {
                buffer: ze.call(this, this.config.selectors.display.buffer),
                currentTime: ze.call(this, this.config.selectors.display.currentTime),
                duration: ze.call(this, this.config.selectors.display.duration)
            },
            g.element(this.elements.progress) && (this.elements.display.seekTooltip = this.elements.progress.querySelector(`.${this.config.classNames.tooltip}`)),
            !0
        } catch (n) {
            return this.debug.warn("It looks like there is a problem with your custom controls HTML", n),
            this.toggleNativeControls(!0),
            !1
        }
    },
    createIcon(n, e) {
        const t = "http://www.w3.org/2000/svg"
          , i = O.getIconUrl.call(this)
          , r = `${i.cors ? "" : i.url}#${this.config.iconPrefix}`
          , s = document.createElementNS(t, "svg");
        _a(s, Pe(e, {
            "aria-hidden": "true",
            focusable: "false"
        }));
        const o = document.createElementNS(t, "use")
          , a = `${r}-${n}`;
        return "href"in o && o.setAttributeNS("http://www.w3.org/1999/xlink", "href", a),
        o.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", a),
        s.appendChild(o),
        s
    },
    createLabel(n, e={}) {
        const t = We.get(n, this.config);
        return j("span", {
            ...e,
            class: [e.class, this.config.classNames.hidden].filter(Boolean).join(" ")
        }, t)
    },
    createBadge(n) {
        if (g.empty(n))
            return null;
        const e = j("span", {
            class: this.config.classNames.menu.value
        });
        return e.appendChild(j("span", {
            class: this.config.classNames.menu.badge
        }, n)),
        e
    },
    createButton(n, e) {
        const t = Pe({}, e);
        let i = Yp(n);
        const r = {
            element: "button",
            toggle: !1,
            label: null,
            icon: null,
            labelPressed: null,
            iconPressed: null
        };
        switch (["element", "icon", "label"].forEach(o => {
            Object.keys(t).includes(o) && (r[o] = t[o],
            delete t[o])
        }
        ),
        r.element !== "button" || Object.keys(t).includes("type") || (t.type = "button"),
        Object.keys(t).includes("class") ? t.class.split(" ").some(o => o === this.config.classNames.control) || Pe(t, {
            class: `${t.class} ${this.config.classNames.control}`
        }) : t.class = this.config.classNames.control,
        n) {
        case "play":
            r.toggle = !0,
            r.label = "play",
            r.labelPressed = "pause",
            r.icon = "play",
            r.iconPressed = "pause";
            break;
        case "mute":
            r.toggle = !0,
            r.label = "mute",
            r.labelPressed = "unmute",
            r.icon = "volume",
            r.iconPressed = "muted";
            break;
        case "captions":
            r.toggle = !0,
            r.label = "enableCaptions",
            r.labelPressed = "disableCaptions",
            r.icon = "captions-off",
            r.iconPressed = "captions-on";
            break;
        case "fullscreen":
            r.toggle = !0,
            r.label = "enterFullscreen",
            r.labelPressed = "exitFullscreen",
            r.icon = "enter-fullscreen",
            r.iconPressed = "exit-fullscreen";
            break;
        case "play-large":
            t.class += ` ${this.config.classNames.control}--overlaid`,
            i = "play",
            r.label = "play",
            r.icon = "play";
            break;
        default:
            g.empty(r.label) && (r.label = i),
            g.empty(r.icon) && (r.icon = n)
        }
        const s = j(r.element);
        return r.toggle ? (s.appendChild(O.createIcon.call(this, r.iconPressed, {
            class: "icon--pressed"
        })),
        s.appendChild(O.createIcon.call(this, r.icon, {
            class: "icon--not-pressed"
        })),
        s.appendChild(O.createLabel.call(this, r.labelPressed, {
            class: "label--pressed"
        })),
        s.appendChild(O.createLabel.call(this, r.label, {
            class: "label--not-pressed"
        }))) : (s.appendChild(O.createIcon.call(this, r.icon)),
        s.appendChild(O.createLabel.call(this, r.label))),
        Pe(t, ui(this.config.selectors.buttons[i], t)),
        _a(s, t),
        i === "play" ? (g.array(this.elements.buttons[i]) || (this.elements.buttons[i] = []),
        this.elements.buttons[i].push(s)) : this.elements.buttons[i] = s,
        s
    },
    createRange(n, e) {
        const t = j("input", Pe(ui(this.config.selectors.inputs[n]), {
            type: "range",
            min: 0,
            max: 100,
            step: .01,
            value: 0,
            autocomplete: "off",
            role: "slider",
            "aria-label": We.get(n, this.config),
            "aria-valuemin": 0,
            "aria-valuemax": 100,
            "aria-valuenow": 0
        }, e));
        return this.elements.inputs[n] = t,
        O.updateRangeFill.call(this, t),
        bp.setup(t),
        t
    },
    createProgress(n, e) {
        const t = j("progress", Pe(ui(this.config.selectors.display[n]), {
            min: 0,
            max: 100,
            value: 0,
            role: "progressbar",
            "aria-hidden": !0
        }, e));
        if (n !== "volume") {
            t.appendChild(j("span", null, "0"));
            const i = {
                played: "played",
                buffer: "buffered"
            }[n]
              , r = i ? We.get(i, this.config) : "";
            t.innerText = `% ${r.toLowerCase()}`
        }
        return this.elements.display[n] = t,
        t
    },
    createTime(n, e) {
        const t = ui(this.config.selectors.display[n], e)
          , i = j("div", Pe(t, {
            class: `${t.class ? t.class : ""} ${this.config.classNames.display.time} `.trim(),
            "aria-label": We.get(n, this.config),
            role: "timer"
        }), "00:00");
        return this.elements.display[n] = i,
        i
    },
    bindMenuItemShortcuts(n, e) {
        re.call(this, n, "keydown keyup", t => {
            if (![" ", "ArrowUp", "ArrowDown", "ArrowRight"].includes(t.key) || (t.preventDefault(),
            t.stopPropagation(),
            t.type === "keydown"))
                return;
            const i = Tn(n, '[role="menuitemradio"]');
            if (!i && [" ", "ArrowRight"].includes(t.key))
                O.showMenuPanel.call(this, e, !0);
            else {
                let r;
                t.key !== " " && (t.key === "ArrowDown" || i && t.key === "ArrowRight" ? (r = n.nextElementSibling,
                g.element(r) || (r = n.parentNode.firstElementChild)) : (r = n.previousElementSibling,
                g.element(r) || (r = n.parentNode.lastElementChild)),
                Io.call(this, r, !0))
            }
        }
        , !1),
        re.call(this, n, "keyup", t => {
            t.key === "Return" && O.focusFirstMenuItem.call(this, null, !0)
        }
        )
    },
    createMenuItem({value: n, list: e, type: t, title: i, badge: r=null, checked: s=!1}) {
        const o = ui(this.config.selectors.inputs[t])
          , a = j("button", Pe(o, {
            type: "button",
            role: "menuitemradio",
            class: `${this.config.classNames.control} ${o.class ? o.class : ""}`.trim(),
            "aria-checked": s,
            value: n
        }))
          , l = j("span");
        l.innerHTML = i,
        g.element(r) && l.appendChild(r),
        a.appendChild(l),
        Object.defineProperty(a, "checked", {
            enumerable: !0,
            get: () => a.getAttribute("aria-checked") === "true",
            set(c) {
                c && Array.from(a.parentNode.children).filter(u => Tn(u, '[role="menuitemradio"]')).forEach(u => u.setAttribute("aria-checked", "false")),
                a.setAttribute("aria-checked", c ? "true" : "false")
            }
        }),
        this.listeners.bind(a, "click keyup", c => {
            if (!g.keyboardEvent(c) || c.key === " ") {
                switch (c.preventDefault(),
                c.stopPropagation(),
                a.checked = !0,
                t) {
                case "language":
                    this.currentTrack = Number(n);
                    break;
                case "quality":
                    this.quality = n;
                    break;
                case "speed":
                    this.speed = parseFloat(n)
                }
                O.showMenuPanel.call(this, "home", g.keyboardEvent(c))
            }
        }
        , t, !1),
        O.bindMenuItemShortcuts.call(this, a, t),
        e.appendChild(a)
    },
    formatTime(n=0, e=!1) {
        return g.number(n) ? yo(n, Th(this.duration) > 0, e) : n
    },
    updateTimeDisplay(n=null, e=0, t=!1) {
        g.element(n) && g.number(e) && (n.innerText = O.formatTime(e, t))
    },
    updateVolume() {
        this.supported.ui && (g.element(this.elements.inputs.volume) && O.setRange.call(this, this.elements.inputs.volume, this.muted ? 0 : this.volume),
        g.element(this.elements.buttons.mute) && (this.elements.buttons.mute.pressed = this.muted || this.volume === 0))
    },
    setRange(n, e=0) {
        g.element(n) && (n.value = e,
        O.updateRangeFill.call(this, n))
    },
    updateProgress(n) {
        if (!this.supported.ui || !g.event(n))
            return;
        let e = 0;
        const t = (i, r) => {
            const s = g.number(r) ? r : 0
              , o = g.element(i) ? i : this.elements.display.buffer;
            if (g.element(o)) {
                o.value = s;
                const a = o.getElementsByTagName("span")[0];
                g.element(a) && (a.childNodes[0].nodeValue = s)
            }
        }
        ;
        if (n)
            switch (n.type) {
            case "timeupdate":
            case "seeking":
            case "seeked":
                e = Vp(this.currentTime, this.duration),
                n.type === "timeupdate" && O.setRange.call(this, this.elements.inputs.seek, e);
                break;
            case "playing":
            case "progress":
                t(this.elements.display.buffer, 100 * this.buffered)
            }
    },
    updateRangeFill(n) {
        const e = g.event(n) ? n.target : n;
        if (g.element(e) && e.getAttribute("type") === "range") {
            if (Tn(e, this.config.selectors.inputs.seek)) {
                e.setAttribute("aria-valuenow", this.currentTime);
                const t = O.formatTime(this.currentTime)
                  , i = O.formatTime(this.duration)
                  , r = We.get("seekLabel", this.config);
                e.setAttribute("aria-valuetext", r.replace("{currentTime}", t).replace("{duration}", i))
            } else if (Tn(e, this.config.selectors.inputs.volume)) {
                const t = 100 * e.value;
                e.setAttribute("aria-valuenow", t),
                e.setAttribute("aria-valuetext", `${t.toFixed(1)}%`)
            } else
                e.setAttribute("aria-valuenow", e.value);
            (Ye.isWebKit || Ye.isIPadOS) && e.style.setProperty("--value", e.value / e.max * 100 + "%")
        }
    },
    updateSeekTooltip(n) {
        var e, t;
        if (!this.config.tooltips.seek || !g.element(this.elements.inputs.seek) || !g.element(this.elements.display.seekTooltip) || this.duration === 0)
            return;
        const i = this.elements.display.seekTooltip
          , r = `${this.config.classNames.tooltip}--visible`
          , s = u => le(i, r, u);
        if (this.touch)
            return void s(!1);
        let o = 0;
        const a = this.elements.progress.getBoundingClientRect();
        if (g.event(n))
            o = 100 / a.width * (n.pageX - a.left);
        else {
            if (!so(i, r))
                return;
            o = parseFloat(i.style.left, 10)
        }
        o < 0 ? o = 0 : o > 100 && (o = 100);
        const l = this.duration / 100 * o;
        i.innerText = O.formatTime(l);
        const c = (e = this.config.markers) === null || e === void 0 || (t = e.points) === null || t === void 0 ? void 0 : t.find( ({time: u}) => u === Math.round(l));
        c && i.insertAdjacentHTML("afterbegin", `${c.label}<br>`),
        i.style.left = `${o}%`,
        g.event(n) && ["mouseenter", "mouseleave"].includes(n.type) && s(n.type === "mouseenter")
    },
    timeUpdate(n) {
        const e = !g.element(this.elements.display.duration) && this.config.invertTime;
        O.updateTimeDisplay.call(this, this.elements.display.currentTime, e ? this.duration - this.currentTime : this.currentTime, e),
        n && n.type === "timeupdate" && this.media.seeking || O.updateProgress.call(this, n)
    },
    durationUpdate() {
        if (!this.supported.ui || !this.config.invertTime && this.currentTime)
            return;
        if (this.duration >= 2 ** 32)
            return mn(this.elements.display.currentTime, !0),
            void mn(this.elements.progress, !0);
        g.element(this.elements.inputs.seek) && this.elements.inputs.seek.setAttribute("aria-valuemax", this.duration);
        const n = g.element(this.elements.display.duration);
        !n && this.config.displayDuration && this.paused && O.updateTimeDisplay.call(this, this.elements.display.currentTime, this.duration),
        n && O.updateTimeDisplay.call(this, this.elements.display.duration, this.duration),
        this.config.markers.enabled && O.setMarkers.call(this),
        O.updateSeekTooltip.call(this)
    },
    toggleMenuButton(n, e) {
        mn(this.elements.settings.buttons[n], !e)
    },
    updateSetting(n, e, t) {
        const i = this.elements.settings.panels[n];
        let r = null
          , s = e;
        if (n === "captions")
            r = this.currentTrack;
        else {
            if (r = g.empty(t) ? this[n] : t,
            g.empty(r) && (r = this.config[n].default),
            !g.empty(this.options[n]) && !this.options[n].includes(r))
                return void this.debug.warn(`Unsupported value of '${r}' for ${n}`);
            if (!this.config[n].options.includes(r))
                return void this.debug.warn(`Disabled value of '${r}' for ${n}`)
        }
        if (g.element(s) || (s = i && i.querySelector('[role="menu"]')),
        !g.element(s))
            return;
        this.elements.settings.buttons[n].querySelector(`.${this.config.classNames.menu.value}`).innerHTML = O.getLabel.call(this, n, r);
        const o = s && s.querySelector(`[value="${r}"]`);
        g.element(o) && (o.checked = !0)
    },
    getLabel(n, e) {
        switch (n) {
        case "speed":
            return e === 1 ? We.get("normal", this.config) : `${e}&times;`;
        case "quality":
            if (g.number(e)) {
                const t = We.get(`qualityLabel.${e}`, this.config);
                return t.length ? t : `${e}p`
            }
            return wh(e);
        case "captions":
            return oe.getLabel.call(this);
        default:
            return null
        }
    },
    setQualityMenu(n) {
        if (!g.element(this.elements.settings.panels.quality))
            return;
        const e = "quality"
          , t = this.elements.settings.panels.quality.querySelector('[role="menu"]');
        g.array(n) && (this.options.quality = wa(n).filter(s => this.config.quality.options.includes(s)));
        const i = !g.empty(this.options.quality) && this.options.quality.length > 1;
        if (O.toggleMenuButton.call(this, e, i),
        Hs(t),
        O.checkMenu.call(this),
        !i)
            return;
        const r = s => {
            const o = We.get(`qualityBadge.${s}`, this.config);
            return o.length ? O.createBadge.call(this, o) : null
        }
        ;
        this.options.quality.sort( (s, o) => {
            const a = this.config.quality.options;
            return a.indexOf(s) > a.indexOf(o) ? 1 : -1
        }
        ).forEach(s => {
            O.createMenuItem.call(this, {
                value: s,
                list: t,
                type: e,
                title: O.getLabel.call(this, "quality", s),
                badge: r(s)
            })
        }
        ),
        O.updateSetting.call(this, e, t)
    },
    setCaptionsMenu() {
        if (!g.element(this.elements.settings.panels.captions))
            return;
        const n = "captions"
          , e = this.elements.settings.panels.captions.querySelector('[role="menu"]')
          , t = oe.getTracks.call(this)
          , i = !!t.length;
        if (O.toggleMenuButton.call(this, n, i),
        Hs(e),
        O.checkMenu.call(this),
        !i)
            return;
        const r = t.map( (s, o) => ({
            value: o,
            checked: this.captions.toggled && this.currentTrack === o,
            title: oe.getLabel.call(this, s),
            badge: s.language && O.createBadge.call(this, s.language.toUpperCase()),
            list: e,
            type: "language"
        }));
        r.unshift({
            value: -1,
            checked: !this.captions.toggled,
            title: We.get("disabled", this.config),
            list: e,
            type: "language"
        }),
        r.forEach(O.createMenuItem.bind(this)),
        O.updateSetting.call(this, n, e)
    },
    setSpeedMenu() {
        if (!g.element(this.elements.settings.panels.speed))
            return;
        const n = "speed"
          , e = this.elements.settings.panels.speed.querySelector('[role="menu"]');
        this.options.speed = this.options.speed.filter(i => i >= this.minimumSpeed && i <= this.maximumSpeed);
        const t = !g.empty(this.options.speed) && this.options.speed.length > 1;
        O.toggleMenuButton.call(this, n, t),
        Hs(e),
        O.checkMenu.call(this),
        t && (this.options.speed.forEach(i => {
            O.createMenuItem.call(this, {
                value: i,
                list: e,
                type: n,
                title: O.getLabel.call(this, "speed", i)
            })
        }
        ),
        O.updateSetting.call(this, n, e))
    },
    checkMenu() {
        const {buttons: n} = this.elements.settings
          , e = !g.empty(n) && Object.values(n).some(t => !t.hidden);
        mn(this.elements.settings.menu, !e)
    },
    focusFirstMenuItem(n, e=!1) {
        if (this.elements.settings.popup.hidden)
            return;
        let t = n;
        g.element(t) || (t = Object.values(this.elements.settings.panels).find(r => !r.hidden));
        const i = t.querySelector('[role^="menuitem"]');
        Io.call(this, i, e)
    },
    toggleMenu(n) {
        const {popup: e} = this.elements.settings
          , t = this.elements.buttons.settings;
        if (!g.element(e) || !g.element(t))
            return;
        const {hidden: i} = e;
        let r = i;
        if (g.boolean(n))
            r = n;
        else if (g.keyboardEvent(n) && n.key === "Escape")
            r = !1;
        else if (g.event(n)) {
            const s = g.function(n.composedPath) ? n.composedPath()[0] : n.target
              , o = e.contains(s);
            if (o || !o && n.target !== t && r)
                return
        }
        t.setAttribute("aria-expanded", r),
        mn(e, !r),
        le(this.elements.container, this.config.classNames.menu.open, r),
        r && g.keyboardEvent(n) ? O.focusFirstMenuItem.call(this, null, !0) : r || i || Io.call(this, t, g.keyboardEvent(n))
    },
    getMenuSize(n) {
        const e = n.cloneNode(!0);
        e.style.position = "absolute",
        e.style.opacity = 0,
        e.removeAttribute("hidden"),
        n.parentNode.appendChild(e);
        const t = e.scrollWidth
          , i = e.scrollHeight;
        return Mi(e),
        {
            width: t,
            height: i
        }
    },
    showMenuPanel(n="", e=!1) {
        const t = this.elements.container.querySelector(`#plyr-settings-${this.id}-${n}`);
        if (!g.element(t))
            return;
        const i = t.parentNode
          , r = Array.from(i.children).find(s => !s.hidden);
        if (Ae.transitions && !Ae.reducedMotion) {
            i.style.width = `${r.scrollWidth}px`,
            i.style.height = `${r.scrollHeight}px`;
            const s = O.getMenuSize.call(this, t)
              , o = a => {
                a.target === i && ["width", "height"].includes(a.propertyName) && (i.style.width = "",
                i.style.height = "",
                go.call(this, i, ba, o))
            }
            ;
            re.call(this, i, ba, o),
            i.style.width = `${s.width}px`,
            i.style.height = `${s.height}px`
        }
        mn(r, !0),
        mn(t, !1),
        O.focusFirstMenuItem.call(this, t, e)
    },
    setDownloadUrl() {
        const n = this.elements.buttons.download;
        g.element(n) && n.setAttribute("href", this.download)
    },
    create(n) {
        const {bindMenuItemShortcuts: e, createButton: t, createProgress: i, createRange: r, createTime: s, setQualityMenu: o, setSpeedMenu: a, showMenuPanel: l} = O;
        this.elements.controls = null,
        g.array(this.config.controls) && this.config.controls.includes("play-large") && this.elements.container.appendChild(t.call(this, "play-large"));
        const c = j("div", ui(this.config.selectors.controls.wrapper));
        this.elements.controls = c;
        const u = {
            class: "plyr__controls__item"
        };
        return wa(g.array(this.config.controls) ? this.config.controls : []).forEach(p => {
            if (p === "restart" && c.appendChild(t.call(this, "restart", u)),
            p === "rewind" && c.appendChild(t.call(this, "rewind", u)),
            p === "play" && c.appendChild(t.call(this, "play", u)),
            p === "fast-forward" && c.appendChild(t.call(this, "fast-forward", u)),
            p === "progress") {
                const d = j("div", {
                    class: `${u.class} plyr__progress__container`
                })
                  , h = j("div", ui(this.config.selectors.progress));
                if (h.appendChild(r.call(this, "seek", {
                    id: `plyr-seek-${n.id}`
                })),
                h.appendChild(i.call(this, "buffer")),
                this.config.tooltips.seek) {
                    const m = j("span", {
                        class: this.config.classNames.tooltip
                    }, "00:00");
                    h.appendChild(m),
                    this.elements.display.seekTooltip = m
                }
                this.elements.progress = h,
                d.appendChild(this.elements.progress),
                c.appendChild(d)
            }
            if (p === "current-time" && c.appendChild(s.call(this, "currentTime", u)),
            p === "duration" && c.appendChild(s.call(this, "duration", u)),
            p === "mute" || p === "volume") {
                let {volume: d} = this.elements;
                if (g.element(d) && c.contains(d) || (d = j("div", Pe({}, u, {
                    class: `${u.class} plyr__volume`.trim()
                })),
                this.elements.volume = d,
                c.appendChild(d)),
                p === "mute" && d.appendChild(t.call(this, "mute")),
                p === "volume" && !Ye.isIos && !Ye.isIPadOS) {
                    const h = {
                        max: 1,
                        step: .05,
                        value: this.config.volume
                    };
                    d.appendChild(r.call(this, "volume", Pe(h, {
                        id: `plyr-volume-${n.id}`
                    })))
                }
            }
            if (p === "captions" && c.appendChild(t.call(this, "captions", u)),
            p === "settings" && !g.empty(this.config.settings)) {
                const d = j("div", Pe({}, u, {
                    class: `${u.class} plyr__menu`.trim(),
                    hidden: ""
                }));
                d.appendChild(t.call(this, "settings", {
                    "aria-haspopup": !0,
                    "aria-controls": `plyr-settings-${n.id}`,
                    "aria-expanded": !1
                }));
                const h = j("div", {
                    class: "plyr__menu__container",
                    id: `plyr-settings-${n.id}`,
                    hidden: ""
                })
                  , m = j("div")
                  , f = j("div", {
                    id: `plyr-settings-${n.id}-home`
                })
                  , w = j("div", {
                    role: "menu"
                });
                f.appendChild(w),
                m.appendChild(f),
                this.elements.settings.panels.home = f,
                this.config.settings.forEach(_ => {
                    const v = j("button", Pe(ui(this.config.selectors.buttons.settings), {
                        type: "button",
                        class: `${this.config.classNames.control} ${this.config.classNames.control}--forward`,
                        role: "menuitem",
                        "aria-haspopup": !0,
                        hidden: ""
                    }));
                    e.call(this, v, _),
                    re.call(this, v, "click", () => {
                        l.call(this, _, !1)
                    }
                    );
                    const b = j("span", null, We.get(_, this.config))
                      , y = j("span", {
                        class: this.config.classNames.menu.value
                    });
                    y.innerHTML = n[_],
                    b.appendChild(y),
                    v.appendChild(b),
                    w.appendChild(v);
                    const x = j("div", {
                        id: `plyr-settings-${n.id}-${_}`,
                        hidden: ""
                    })
                      , k = j("button", {
                        type: "button",
                        class: `${this.config.classNames.control} ${this.config.classNames.control}--back`
                    });
                    k.appendChild(j("span", {
                        "aria-hidden": !0
                    }, We.get(_, this.config))),
                    k.appendChild(j("span", {
                        class: this.config.classNames.hidden
                    }, We.get("menuBack", this.config))),
                    re.call(this, x, "keydown", T => {
                        T.key === "ArrowLeft" && (T.preventDefault(),
                        T.stopPropagation(),
                        l.call(this, "home", !0))
                    }
                    , !1),
                    re.call(this, k, "click", () => {
                        l.call(this, "home", !1)
                    }
                    ),
                    x.appendChild(k),
                    x.appendChild(j("div", {
                        role: "menu"
                    })),
                    m.appendChild(x),
                    this.elements.settings.buttons[_] = v,
                    this.elements.settings.panels[_] = x
                }
                ),
                h.appendChild(m),
                d.appendChild(h),
                c.appendChild(d),
                this.elements.settings.popup = h,
                this.elements.settings.menu = d
            }
            if (p === "pip" && Ae.pip && c.appendChild(t.call(this, "pip", u)),
            p === "airplay" && Ae.airplay && c.appendChild(t.call(this, "airplay", u)),
            p === "download") {
                const d = Pe({}, u, {
                    element: "a",
                    href: this.download,
                    target: "_blank"
                });
                this.isHTML5 && (d.download = "");
                const {download: h} = this.config.urls;
                !g.url(h) && this.isEmbed && Pe(d, {
                    icon: `logo-${this.provider}`,
                    label: this.provider
                }),
                c.appendChild(t.call(this, "download", d))
            }
            p === "fullscreen" && c.appendChild(t.call(this, "fullscreen", u))
        }
        ),
        this.isHTML5 && o.call(this, Zi.getQualityOptions.call(this)),
        a.call(this),
        c
    },
    inject() {
        if (this.config.loadSprite) {
            const r = O.getIconUrl.call(this);
            r.cors && xh(r.url, "sprite-plyr")
        }
        this.id = Math.floor(1e4 * Math.random());
        let n = null;
        this.elements.controls = null;
        const e = {
            id: this.id,
            seektime: this.config.seekTime,
            title: this.config.title
        };
        let t = !0;
        g.function(this.config.controls) && (this.config.controls = this.config.controls.call(this, e)),
        this.config.controls || (this.config.controls = []),
        g.element(this.config.controls) || g.string(this.config.controls) ? n = this.config.controls : (n = O.create.call(this, {
            id: this.id,
            seektime: this.config.seekTime,
            speed: this.speed,
            quality: this.quality,
            captions: oe.getLabel.call(this)
        }),
        t = !1);
        let i;
        if (t && g.string(this.config.controls) && (n = (r => {
            let s = r;
            return Object.entries(e).forEach( ([o,a]) => {
                s = Yr(s, `{${o}}`, a)
            }
            ),
            s
        }
        )(n)),
        g.string(this.config.selectors.controls.container) && (i = document.querySelector(this.config.selectors.controls.container)),
        g.element(i) || (i = this.elements.container),
        i[g.element(n) ? "insertAdjacentElement" : "insertAdjacentHTML"]("afterbegin", n),
        g.element(this.elements.controls) || O.findElements.call(this),
        !g.empty(this.elements.buttons)) {
            const r = s => {
                const o = this.config.classNames.controlPressed;
                s.setAttribute("aria-pressed", "false"),
                Object.defineProperty(s, "pressed", {
                    configurable: !0,
                    enumerable: !0,
                    get: () => so(s, o),
                    set(a=!1) {
                        le(s, o, a),
                        s.setAttribute("aria-pressed", a ? "true" : "false")
                    }
                })
            }
            ;
            Object.values(this.elements.buttons).filter(Boolean).forEach(s => {
                g.array(s) || g.nodeList(s) ? Array.from(s).filter(Boolean).forEach(r) : r(s)
            }
            )
        }
        if (Ye.isEdge && ph(i),
        this.config.tooltips.controls) {
            const {classNames: r, selectors: s} = this.config
              , o = `${s.controls.wrapper} ${s.labels} .${r.hidden}`
              , a = rs.call(this, o);
            Array.from(a).forEach(l => {
                le(l, this.config.classNames.hidden, !1),
                le(l, this.config.classNames.tooltip, !0)
            }
            )
        }
    },
    setMediaMetadata() {
        try {
            "mediaSession"in navigator && (navigator.mediaSession.metadata = new window.MediaMetadata({
                title: this.config.mediaMetadata.title,
                artist: this.config.mediaMetadata.artist,
                album: this.config.mediaMetadata.album,
                artwork: this.config.mediaMetadata.artwork
            }))
        } catch {}
    },
    setMarkers() {
        var n, e;
        if (!this.duration || this.elements.markers)
            return;
        const t = (n = this.config.markers) === null || n === void 0 || (e = n.points) === null || e === void 0 ? void 0 : e.filter( ({time: l}) => l > 0 && l < this.duration);
        if (t == null || !t.length)
            return;
        const i = document.createDocumentFragment()
          , r = document.createDocumentFragment();
        let s = null;
        const o = `${this.config.classNames.tooltip}--visible`
          , a = l => le(s, o, l);
        t.forEach(l => {
            const c = j("span", {
                class: this.config.classNames.marker
            }, "")
              , u = l.time / this.duration * 100 + "%";
            s && (c.addEventListener("mouseenter", () => {
                l.label || (s.style.left = u,
                s.innerHTML = l.label,
                a(!0))
            }
            ),
            c.addEventListener("mouseleave", () => {
                a(!1)
            }
            )),
            c.addEventListener("click", () => {
                this.currentTime = l.time
            }
            ),
            c.style.left = u,
            r.appendChild(c)
        }
        ),
        i.appendChild(r),
        this.config.tooltips.seek || (s = j("span", {
            class: this.config.classNames.tooltip
        }, ""),
        i.appendChild(s)),
        this.elements.markers = {
            points: r,
            tip: s
        },
        this.elements.progress.appendChild(i)
    }
};
function Sh(n, e=!0) {
    let t = n;
    if (e) {
        const i = document.createElement("a");
        i.href = t,
        t = i.href
    }
    try {
        return new URL(t)
    } catch {
        return null
    }
}
function kh(n) {
    const e = new URLSearchParams;
    return g.object(n) && Object.entries(n).forEach( ([t,i]) => {
        e.set(t, i)
    }
    ),
    e
}
const oe = {
    setup() {
        if (!this.supported.ui)
            return;
        if (!this.isVideo || this.isYouTube || this.isHTML5 && !Ae.textTracks)
            return void (g.array(this.config.controls) && this.config.controls.includes("settings") && this.config.settings.includes("captions") && O.setCaptionsMenu.call(this));
        if (g.element(this.elements.captions) || (this.elements.captions = j("div", ui(this.config.selectors.captions)),
        this.elements.captions.setAttribute("dir", "auto"),
        Fp(this.elements.captions, this.elements.wrapper)),
        Ye.isIE && window.URL) {
            const i = this.media.querySelectorAll("track");
            Array.from(i).forEach(r => {
                const s = r.getAttribute("src")
                  , o = Sh(s);
                o !== null && o.hostname !== window.location.href.hostname && ["http:", "https:"].includes(o.protocol) && ps(s, "blob").then(a => {
                    r.setAttribute("src", window.URL.createObjectURL(a))
                }
                ).catch( () => {
                    Mi(r)
                }
                )
            }
            )
        }
        const n = wa((navigator.languages || [navigator.language || navigator.userLanguage || "en"]).map(i => i.split("-")[0]));
        let e = (this.storage.get("language") || this.config.captions.language || "auto").toLowerCase();
        e === "auto" && ([e] = n);
        let t = this.storage.get("captions");
        if (g.boolean(t) || ({active: t} = this.config.captions),
        Object.assign(this.captions, {
            toggled: !1,
            active: t,
            language: e,
            languages: n
        }),
        this.isHTML5) {
            const i = this.config.captions.update ? "addtrack removetrack" : "removetrack";
            re.call(this, this.media.textTracks, i, oe.update.bind(this))
        }
        setTimeout(oe.update.bind(this), 0)
    },
    update() {
        const n = oe.getTracks.call(this, !0)
          , {active: e, language: t, meta: i, currentTrackNode: r} = this.captions
          , s = !!n.find(o => o.language === t);
        this.isHTML5 && this.isVideo && n.filter(o => !i.get(o)).forEach(o => {
            this.debug.log("Track added", o),
            i.set(o, {
                default: o.mode === "showing"
            }),
            o.mode === "showing" && (o.mode = "hidden"),
            re.call(this, o, "cuechange", () => oe.updateCues.call(this))
        }
        ),
        (s && this.language !== t || !n.includes(r)) && (oe.setLanguage.call(this, t),
        oe.toggle.call(this, e && s)),
        this.elements && le(this.elements.container, this.config.classNames.captions.enabled, !g.empty(n)),
        g.array(this.config.controls) && this.config.controls.includes("settings") && this.config.settings.includes("captions") && O.setCaptionsMenu.call(this)
    },
    toggle(n, e=!0) {
        if (!this.supported.ui)
            return;
        const {toggled: t} = this.captions
          , i = this.config.classNames.captions.active
          , r = g.nullOrUndefined(n) ? !t : n;
        if (r !== t) {
            if (e || (this.captions.active = r,
            this.storage.set({
                captions: r
            })),
            !this.language && r && !e) {
                const s = oe.getTracks.call(this)
                  , o = oe.findTrack.call(this, [this.captions.language, ...this.captions.languages], !0);
                return this.captions.language = o.language,
                void oe.set.call(this, s.indexOf(o))
            }
            this.elements.buttons.captions && (this.elements.buttons.captions.pressed = r),
            le(this.elements.container, i, r),
            this.captions.toggled = r,
            O.updateSetting.call(this, "captions"),
            U.call(this, this.media, r ? "captionsenabled" : "captionsdisabled")
        }
        setTimeout( () => {
            r && this.captions.toggled && (this.captions.currentTrackNode.mode = "hidden")
        }
        )
    },
    set(n, e=!0) {
        const t = oe.getTracks.call(this);
        if (n !== -1)
            if (g.number(n))
                if (n in t) {
                    if (this.captions.currentTrack !== n) {
                        this.captions.currentTrack = n;
                        const i = t[n]
                          , {language: r} = i || {};
                        this.captions.currentTrackNode = i,
                        O.updateSetting.call(this, "captions"),
                        e || (this.captions.language = r,
                        this.storage.set({
                            language: r
                        })),
                        this.isVimeo && this.embed.enableTextTrack(r),
                        U.call(this, this.media, "languagechange")
                    }
                    oe.toggle.call(this, !0, e),
                    this.isHTML5 && this.isVideo && oe.updateCues.call(this)
                } else
                    this.debug.warn("Track not found", n);
            else
                this.debug.warn("Invalid caption argument", n);
        else
            oe.toggle.call(this, !1, e)
    },
    setLanguage(n, e=!0) {
        if (!g.string(n))
            return void this.debug.warn("Invalid language argument", n);
        const t = n.toLowerCase();
        this.captions.language = t;
        const i = oe.getTracks.call(this)
          , r = oe.findTrack.call(this, [t]);
        oe.set.call(this, i.indexOf(r), e)
    },
    getTracks(n=!1) {
        return Array.from((this.media || {}).textTracks || []).filter(e => !this.isHTML5 || n || this.captions.meta.has(e)).filter(e => ["captions", "subtitles"].includes(e.kind))
    },
    findTrack(n, e=!1) {
        const t = oe.getTracks.call(this)
          , i = o => Number((this.captions.meta.get(o) || {}).default)
          , r = Array.from(t).sort( (o, a) => i(a) - i(o));
        let s;
        return n.every(o => (s = r.find(a => a.language === o),
        !s)),
        s || (e ? r[0] : void 0)
    },
    getCurrentTrack() {
        return oe.getTracks.call(this)[this.currentTrack]
    },
    getLabel(n) {
        let e = n;
        return !g.track(e) && Ae.textTracks && this.captions.toggled && (e = oe.getCurrentTrack.call(this)),
        g.track(e) ? g.empty(e.label) ? g.empty(e.language) ? We.get("enabled", this.config) : n.language.toUpperCase() : e.label : We.get("disabled", this.config)
    },
    updateCues(n) {
        if (!this.supported.ui)
            return;
        if (!g.element(this.elements.captions))
            return void this.debug.warn("No captions element to render to");
        if (!g.nullOrUndefined(n) && !Array.isArray(n))
            return void this.debug.warn("updateCues: Invalid input", n);
        let e = n;
        if (!e) {
            const i = oe.getCurrentTrack.call(this);
            e = Array.from((i || {}).activeCues || []).map(r => r.getCueAsHTML()).map(Gp)
        }
        const t = e.map(i => i.trim()).join(`
`);
        if (t !== this.elements.captions.innerHTML) {
            Hs(this.elements.captions);
            const i = j("span", ui(this.config.selectors.caption));
            i.innerHTML = t,
            this.elements.captions.appendChild(i),
            U.call(this, this.media, "cuechange")
        }
    }
}
  , Ch = {
    enabled: !0,
    title: "",
    debug: !1,
    autoplay: !1,
    autopause: !0,
    playsinline: !0,
    seekTime: 10,
    volume: 1,
    muted: !1,
    duration: null,
    displayDuration: !0,
    invertTime: !0,
    toggleInvert: !0,
    ratio: null,
    clickToPlay: !0,
    hideControls: !0,
    resetOnEnd: !1,
    disableContextMenu: !0,
    loadSprite: !0,
    iconPrefix: "plyr",
    iconUrl: "https://cdn.plyr.io/3.7.8/plyr.svg",
    blankVideo: "https://cdn.plyr.io/static/blank.mp4",
    quality: {
        default: 576,
        options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240],
        forced: !1,
        onChange: null
    },
    loop: {
        active: !1
    },
    speed: {
        selected: 1,
        options: [.5, .75, 1, 1.25, 1.5, 1.75, 2, 4]
    },
    keyboard: {
        focused: !0,
        global: !1
    },
    tooltips: {
        controls: !1,
        seek: !0
    },
    captions: {
        active: !1,
        language: "auto",
        update: !1
    },
    fullscreen: {
        enabled: !0,
        fallback: !0,
        iosNative: !1
    },
    storage: {
        enabled: !0,
        key: "plyr"
    },
    controls: ["play-large", "play", "progress", "current-time", "mute", "volume", "captions", "settings", "pip", "airplay", "fullscreen"],
    settings: ["captions", "quality", "speed"],
    i18n: {
        restart: "Restart",
        rewind: "Rewind {seektime}s",
        play: "Play",
        pause: "Pause",
        fastForward: "Forward {seektime}s",
        seek: "Seek",
        seekLabel: "{currentTime} of {duration}",
        played: "Played",
        buffered: "Buffered",
        currentTime: "Current time",
        duration: "Duration",
        volume: "Volume",
        mute: "Mute",
        unmute: "Unmute",
        enableCaptions: "Enable captions",
        disableCaptions: "Disable captions",
        download: "Download",
        enterFullscreen: "Enter fullscreen",
        exitFullscreen: "Exit fullscreen",
        frameTitle: "Player for {title}",
        captions: "Captions",
        settings: "Settings",
        pip: "PIP",
        menuBack: "Go back to previous menu",
        speed: "Speed",
        normal: "Normal",
        quality: "Quality",
        loop: "Loop",
        start: "Start",
        end: "End",
        all: "All",
        reset: "Reset",
        disabled: "Disabled",
        enabled: "Enabled",
        advertisement: "Ad",
        qualityBadge: {
            2160: "4K",
            1440: "HD",
            1080: "HD",
            720: "HD",
            576: "SD",
            480: "SD"
        }
    },
    urls: {
        download: null,
        vimeo: {
            sdk: "https://player.vimeo.com/api/player.js",
            iframe: "https://player.vimeo.com/video/{0}?{1}",
            api: "https://vimeo.com/api/oembed.json?url={0}"
        },
        youtube: {
            sdk: "https://www.youtube.com/iframe_api",
            api: "https://noembed.com/embed?url=https://www.youtube.com/watch?v={0}"
        },
        googleIMA: {
            sdk: "https://imasdk.googleapis.com/js/sdkloader/ima3.js"
        }
    },
    listeners: {
        seek: null,
        play: null,
        pause: null,
        restart: null,
        rewind: null,
        fastForward: null,
        mute: null,
        volume: null,
        captions: null,
        download: null,
        fullscreen: null,
        pip: null,
        airplay: null,
        speed: null,
        quality: null,
        loop: null,
        language: null
    },
    events: ["ended", "progress", "stalled", "playing", "waiting", "canplay", "canplaythrough", "loadstart", "loadeddata", "loadedmetadata", "timeupdate", "volumechange", "play", "pause", "error", "seeking", "seeked", "emptied", "ratechange", "cuechange", "download", "enterfullscreen", "exitfullscreen", "captionsenabled", "captionsdisabled", "languagechange", "controlshidden", "controlsshown", "ready", "statechange", "qualitychange", "adsloaded", "adscontentpause", "adscontentresume", "adstarted", "adsmidpoint", "adscomplete", "adsallcomplete", "adsimpression", "adsclick"],
    selectors: {
        editable: "input, textarea, select, [contenteditable]",
        container: ".plyr",
        controls: {
            container: null,
            wrapper: ".plyr__controls"
        },
        labels: "[data-plyr]",
        buttons: {
            play: '[data-plyr="play"]',
            pause: '[data-plyr="pause"]',
            restart: '[data-plyr="restart"]',
            rewind: '[data-plyr="rewind"]',
            fastForward: '[data-plyr="fast-forward"]',
            mute: '[data-plyr="mute"]',
            captions: '[data-plyr="captions"]',
            download: '[data-plyr="download"]',
            fullscreen: '[data-plyr="fullscreen"]',
            pip: '[data-plyr="pip"]',
            airplay: '[data-plyr="airplay"]',
            settings: '[data-plyr="settings"]',
            loop: '[data-plyr="loop"]'
        },
        inputs: {
            seek: '[data-plyr="seek"]',
            volume: '[data-plyr="volume"]',
            speed: '[data-plyr="speed"]',
            language: '[data-plyr="language"]',
            quality: '[data-plyr="quality"]'
        },
        display: {
            currentTime: ".plyr__time--current",
            duration: ".plyr__time--duration",
            buffer: ".plyr__progress__buffer",
            loop: ".plyr__progress__loop",
            volume: ".plyr__volume--display"
        },
        progress: ".plyr__progress",
        captions: ".plyr__captions",
        caption: ".plyr__caption"
    },
    classNames: {
        type: "plyr--{0}",
        provider: "plyr--{0}",
        video: "plyr__video-wrapper",
        embed: "plyr__video-embed",
        videoFixedRatio: "plyr__video-wrapper--fixed-ratio",
        embedContainer: "plyr__video-embed__container",
        poster: "plyr__poster",
        posterEnabled: "plyr__poster-enabled",
        ads: "plyr__ads",
        control: "plyr__control",
        controlPressed: "plyr__control--pressed",
        playing: "plyr--playing",
        paused: "plyr--paused",
        stopped: "plyr--stopped",
        loading: "plyr--loading",
        hover: "plyr--hover",
        tooltip: "plyr__tooltip",
        cues: "plyr__cues",
        marker: "plyr__progress__marker",
        hidden: "plyr__sr-only",
        hideControls: "plyr--hide-controls",
        isTouch: "plyr--is-touch",
        uiSupported: "plyr--full-ui",
        noTransition: "plyr--no-transition",
        display: {
            time: "plyr__time"
        },
        menu: {
            value: "plyr__menu__value",
            badge: "plyr__badge",
            open: "plyr--menu-open"
        },
        captions: {
            enabled: "plyr--captions-enabled",
            active: "plyr--captions-active"
        },
        fullscreen: {
            enabled: "plyr--fullscreen-enabled",
            fallback: "plyr--fullscreen-fallback"
        },
        pip: {
            supported: "plyr--pip-supported",
            active: "plyr--pip-active"
        },
        airplay: {
            supported: "plyr--airplay-supported",
            active: "plyr--airplay-active"
        },
        previewThumbnails: {
            thumbContainer: "plyr__preview-thumb",
            thumbContainerShown: "plyr__preview-thumb--is-shown",
            imageContainer: "plyr__preview-thumb__image-container",
            timeContainer: "plyr__preview-thumb__time-container",
            scrubbingContainer: "plyr__preview-scrubbing",
            scrubbingContainerShown: "plyr__preview-scrubbing--is-shown"
        }
    },
    attributes: {
        embed: {
            provider: "data-plyr-provider",
            id: "data-plyr-embed-id",
            hash: "data-plyr-embed-hash"
        }
    },
    ads: {
        enabled: !1,
        publisherId: "",
        tagUrl: ""
    },
    previewThumbnails: {
        enabled: !1,
        src: ""
    },
    vimeo: {
        byline: !1,
        portrait: !1,
        title: !1,
        speed: !0,
        transparent: !1,
        customControls: !0,
        referrerPolicy: null,
        premium: !1
    },
    youtube: {
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        customControls: !0,
        noCookie: !1
    },
    mediaMetadata: {
        title: "",
        artist: "",
        album: "",
        artwork: []
    },
    markers: {
        enabled: !1,
        points: []
    }
}
  , $o = {
    active: "picture-in-picture",
    inactive: "inline"
}
  , Vi = {
    html5: "html5",
    youtube: "youtube",
    vimeo: "vimeo"
}
  , Fo = {
    audio: "audio",
    video: "video"
};
function Jp(n) {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.?be)\/.+$/.test(n) ? Vi.youtube : /^https?:\/\/player.vimeo.com\/video\/\d{0,9}(?=\b|\/)/.test(n) ? Vi.vimeo : null
}
const zo = () => {}
;
class Zp {
    constructor(e=!1) {
        this.enabled = window.console && e,
        this.enabled && this.log("Debugging enabled")
    }
    get log() {
        return this.enabled ? Function.prototype.bind.call(console.log, console) : zo
    }
    get warn() {
        return this.enabled ? Function.prototype.bind.call(console.warn, console) : zo
    }
    get error() {
        return this.enabled ? Function.prototype.bind.call(console.error, console) : zo
    }
}
class ri {
    constructor(e) {
        D(this, "onChange", () => {
            if (!this.supported)
                return;
            const t = this.player.elements.buttons.fullscreen;
            g.element(t) && (t.pressed = this.active);
            const i = this.target === this.player.media ? this.target : this.player.elements.container;
            U.call(this.player, i, this.active ? "enterfullscreen" : "exitfullscreen", !0)
        }
        ),
        D(this, "toggleFallback", (t=!1) => {
            if (t ? this.scrollPosition = {
                x: window.scrollX ?? 0,
                y: window.scrollY ?? 0
            } : window.scrollTo(this.scrollPosition.x, this.scrollPosition.y),
            document.body.style.overflow = t ? "hidden" : "",
            le(this.target, this.player.config.classNames.fullscreen.fallback, t),
            Ye.isIos) {
                let i = document.head.querySelector('meta[name="viewport"]');
                const r = "viewport-fit=cover";
                i || (i = document.createElement("meta"),
                i.setAttribute("name", "viewport"));
                const s = g.string(i.content) && i.content.includes(r);
                t ? (this.cleanupViewport = !s,
                s || (i.content += `,${r}`)) : this.cleanupViewport && (i.content = i.content.split(",").filter(o => o.trim() !== r).join(","))
            }
            this.onChange()
        }
        ),
        D(this, "trapFocus", t => {
            if (Ye.isIos || Ye.isIPadOS || !this.active || t.key !== "Tab")
                return;
            const i = document.activeElement
              , r = rs.call(this.player, "a[href], button:not(:disabled), input:not(:disabled), [tabindex]")
              , [s] = r
              , o = r[r.length - 1];
            i !== o || t.shiftKey ? i === s && t.shiftKey && (o.focus(),
            t.preventDefault()) : (s.focus(),
            t.preventDefault())
        }
        ),
        D(this, "update", () => {
            if (this.supported) {
                let t;
                t = this.forceFallback ? "Fallback (forced)" : ri.nativeSupported ? "Native" : "Fallback",
                this.player.debug.log(`${t} fullscreen enabled`)
            } else
                this.player.debug.log("Fullscreen not supported and fallback disabled");
            le(this.player.elements.container, this.player.config.classNames.fullscreen.enabled, this.supported)
        }
        ),
        D(this, "enter", () => {
            this.supported && (Ye.isIos && this.player.config.fullscreen.iosNative ? this.player.isVimeo ? this.player.embed.requestFullscreen() : this.target.webkitEnterFullscreen() : !ri.nativeSupported || this.forceFallback ? this.toggleFallback(!0) : this.prefix ? g.empty(this.prefix) || this.target[`${this.prefix}Request${this.property}`]() : this.target.requestFullscreen({
                navigationUI: "hide"
            }))
        }
        ),
        D(this, "exit", () => {
            if (this.supported)
                if (Ye.isIos && this.player.config.fullscreen.iosNative)
                    this.player.isVimeo ? this.player.embed.exitFullscreen() : this.target.webkitEnterFullscreen(),
                    pi(this.player.play());
                else if (!ri.nativeSupported || this.forceFallback)
                    this.toggleFallback(!1);
                else if (this.prefix) {
                    if (!g.empty(this.prefix)) {
                        const t = this.prefix === "moz" ? "Cancel" : "Exit";
                        document[`${this.prefix}${t}${this.property}`]()
                    }
                } else
                    (document.cancelFullScreen || document.exitFullscreen).call(document)
        }
        ),
        D(this, "toggle", () => {
            this.active ? this.exit() : this.enter()
        }
        ),
        this.player = e,
        this.prefix = ri.prefix,
        this.property = ri.property,
        this.scrollPosition = {
            x: 0,
            y: 0
        },
        this.forceFallback = e.config.fullscreen.fallback === "force",
        this.player.elements.fullscreen = e.config.fullscreen.container && zp(this.player.elements.container, e.config.fullscreen.container),
        re.call(this.player, document, this.prefix === "ms" ? "MSFullscreenChange" : `${this.prefix}fullscreenchange`, () => {
            this.onChange()
        }
        ),
        re.call(this.player, this.player.elements.container, "dblclick", t => {
            g.element(this.player.elements.controls) && this.player.elements.controls.contains(t.target) || this.player.listeners.proxy(t, this.toggle, "fullscreen")
        }
        ),
        re.call(this, this.player.elements.container, "keydown", t => this.trapFocus(t)),
        this.update()
    }
    static get nativeSupported() {
        return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled)
    }
    get useNative() {
        return ri.nativeSupported && !this.forceFallback
    }
    static get prefix() {
        if (g.function(document.exitFullscreen))
            return "";
        let e = "";
        return ["webkit", "moz", "ms"].some(t => !(!g.function(document[`${t}ExitFullscreen`]) && !g.function(document[`${t}CancelFullScreen`])) && (e = t,
        !0)),
        e
    }
    static get property() {
        return this.prefix === "moz" ? "FullScreen" : "Fullscreen"
    }
    get supported() {
        return [this.player.config.fullscreen.enabled, this.player.isVideo, ri.nativeSupported || this.player.config.fullscreen.fallback, !this.player.isYouTube || ri.nativeSupported || !Ye.isIos || this.player.config.playsinline && !this.player.config.fullscreen.iosNative].every(Boolean)
    }
    get active() {
        if (!this.supported)
            return !1;
        if (!ri.nativeSupported || this.forceFallback)
            return so(this.target, this.player.config.classNames.fullscreen.fallback);
        const e = this.prefix ? this.target.getRootNode()[`${this.prefix}${this.property}Element`] : this.target.getRootNode().fullscreenElement;
        return e && e.shadowRoot ? e === this.target.getRootNode().host : e === this.target
    }
    get target() {
        return Ye.isIos && this.player.config.fullscreen.iosNative ? this.player.media : this.player.elements.fullscreen ?? this.player.elements.container
    }
}
function js(n, e=1) {
    return new Promise( (t, i) => {
        const r = new Image
          , s = () => {
            delete r.onload,
            delete r.onerror,
            (r.naturalWidth >= e ? t : i)(r)
        }
        ;
        Object.assign(r, {
            onload: s,
            onerror: s,
            src: n
        })
    }
    )
}
const ue = {
    addStyleHook() {
        le(this.elements.container, this.config.selectors.container.replace(".", ""), !0),
        le(this.elements.container, this.config.classNames.uiSupported, this.supported.ui)
    },
    toggleNativeControls(n=!1) {
        n && this.isHTML5 ? this.media.setAttribute("controls", "") : this.media.removeAttribute("controls")
    },
    build() {
        if (this.listeners.media(),
        !this.supported.ui)
            return this.debug.warn(`Basic support only for ${this.provider} ${this.type}`),
            void ue.toggleNativeControls.call(this, !0);
        g.element(this.elements.controls) || (O.inject.call(this),
        this.listeners.controls()),
        ue.toggleNativeControls.call(this),
        this.isHTML5 && oe.setup.call(this),
        this.volume = null,
        this.muted = null,
        this.loop = null,
        this.quality = null,
        this.speed = null,
        O.updateVolume.call(this),
        O.timeUpdate.call(this),
        O.durationUpdate.call(this),
        ue.checkPlaying.call(this),
        le(this.elements.container, this.config.classNames.pip.supported, Ae.pip && this.isHTML5 && this.isVideo),
        le(this.elements.container, this.config.classNames.airplay.supported, Ae.airplay && this.isHTML5),
        le(this.elements.container, this.config.classNames.isTouch, this.touch),
        this.ready = !0,
        setTimeout( () => {
            U.call(this, this.media, "ready")
        }
        , 0),
        ue.setTitle.call(this),
        this.poster && ue.setPoster.call(this, this.poster, !1).catch( () => {}
        ),
        this.config.duration && O.durationUpdate.call(this),
        this.config.mediaMetadata && O.setMediaMetadata.call(this)
    },
    setTitle() {
        let n = We.get("play", this.config);
        if (g.string(this.config.title) && !g.empty(this.config.title) && (n += `, ${this.config.title}`),
        Array.from(this.elements.buttons.play || []).forEach(e => {
            e.setAttribute("aria-label", n)
        }
        ),
        this.isEmbed) {
            const e = ze.call(this, "iframe");
            if (!g.element(e))
                return;
            const t = g.empty(this.config.title) ? "video" : this.config.title
              , i = We.get("frameTitle", this.config);
            e.setAttribute("title", i.replace("{title}", t))
        }
    },
    togglePoster(n) {
        le(this.elements.container, this.config.classNames.posterEnabled, n)
    },
    setPoster(n, e=!0) {
        return e && this.poster ? Promise.reject(new Error("Poster already set")) : (this.media.setAttribute("data-poster", n),
        this.elements.poster.removeAttribute("hidden"),
        Hp.call(this).then( () => js(n)).catch(t => {
            throw n === this.poster && ue.togglePoster.call(this, !1),
            t
        }
        ).then( () => {
            if (n !== this.poster)
                throw new Error("setPoster cancelled by later call to setPoster")
        }
        ).then( () => (Object.assign(this.elements.poster.style, {
            backgroundImage: `url('${n}')`,
            backgroundSize: ""
        }),
        ue.togglePoster.call(this, !0),
        n)))
    },
    checkPlaying(n) {
        le(this.elements.container, this.config.classNames.playing, this.playing),
        le(this.elements.container, this.config.classNames.paused, this.paused),
        le(this.elements.container, this.config.classNames.stopped, this.stopped),
        Array.from(this.elements.buttons.play || []).forEach(e => {
            Object.assign(e, {
                pressed: this.playing
            }),
            e.setAttribute("aria-label", We.get(this.playing ? "pause" : "play", this.config))
        }
        ),
        g.event(n) && n.type === "timeupdate" || ue.toggleControls.call(this)
    },
    checkLoading(n) {
        this.loading = ["stalled", "waiting"].includes(n.type),
        clearTimeout(this.timers.loading),
        this.timers.loading = setTimeout( () => {
            le(this.elements.container, this.config.classNames.loading, this.loading),
            ue.toggleControls.call(this)
        }
        , this.loading ? 250 : 0)
    },
    toggleControls(n) {
        const {controls: e} = this.elements;
        if (e && this.config.hideControls) {
            const t = this.touch && this.lastSeekTime + 2e3 > Date.now();
            this.toggleControls(!!(n || this.loading || this.paused || e.pressed || e.hover || t))
        }
    },
    migrateStyles() {
        Object.values({
            ...this.media.style
        }).filter(n => !g.empty(n) && g.string(n) && n.startsWith("--plyr")).forEach(n => {
            this.elements.container.style.setProperty(n, this.media.style.getPropertyValue(n)),
            this.media.style.removeProperty(n)
        }
        ),
        g.empty(this.media.style) && this.media.removeAttribute("style")
    }
};
class em {
    constructor(e) {
        D(this, "firstTouch", () => {
            const {player: t} = this
              , {elements: i} = t;
            t.touch = !0,
            le(i.container, t.config.classNames.isTouch, !0)
        }
        ),
        D(this, "global", (t=!0) => {
            const {player: i} = this;
            i.config.keyboard.global && ss.call(i, window, "keydown keyup", this.handleKey, t, !1),
            ss.call(i, document.body, "click", this.toggleMenu, t),
            cl.call(i, document.body, "touchstart", this.firstTouch)
        }
        ),
        D(this, "container", () => {
            const {player: t} = this
              , {config: i, elements: r, timers: s} = t;
            !i.keyboard.global && i.keyboard.focused && re.call(t, r.container, "keydown keyup", this.handleKey, !1),
            re.call(t, r.container, "mousemove mouseleave touchstart touchmove enterfullscreen exitfullscreen", l => {
                const {controls: c} = r;
                c && l.type === "enterfullscreen" && (c.pressed = !1,
                c.hover = !1);
                let u = 0;
                ["touchstart", "touchmove", "mousemove"].includes(l.type) && (ue.toggleControls.call(t, !0),
                u = t.touch ? 3e3 : 2e3),
                clearTimeout(s.controls),
                s.controls = setTimeout( () => ue.toggleControls.call(t, !1), u)
            }
            );
            const o = () => {
                if (!t.isVimeo || t.config.vimeo.premium)
                    return;
                const l = r.wrapper
                  , {active: c} = t.fullscreen
                  , [u,p] = ul.call(t)
                  , d = vh(`aspect-ratio: ${u} / ${p}`);
                if (!c)
                    return void (d ? (l.style.width = null,
                    l.style.height = null) : (l.style.maxWidth = null,
                    l.style.margin = null));
                const [h,m] = jp()
                  , f = h / m > u / p;
                d ? (l.style.width = f ? "auto" : "100%",
                l.style.height = f ? "100%" : "auto") : (l.style.maxWidth = f ? m / p * u + "px" : null,
                l.style.margin = f ? "0 auto" : null)
            }
              , a = () => {
                clearTimeout(s.resized),
                s.resized = setTimeout(o, 50)
            }
            ;
            re.call(t, r.container, "enterfullscreen exitfullscreen", l => {
                const {target: c} = t.fullscreen;
                c === r.container && (!t.isEmbed && g.empty(t.config.ratio) || (o(),
                (l.type === "enterfullscreen" ? re : go).call(t, window, "resize", a)))
            }
            )
        }
        ),
        D(this, "media", () => {
            const {player: t} = this
              , {elements: i} = t;
            if (re.call(t, t.media, "timeupdate seeking seeked", s => O.timeUpdate.call(t, s)),
            re.call(t, t.media, "durationchange loadeddata loadedmetadata", s => O.durationUpdate.call(t, s)),
            re.call(t, t.media, "ended", () => {
                t.isHTML5 && t.isVideo && t.config.resetOnEnd && (t.restart(),
                t.pause())
            }
            ),
            re.call(t, t.media, "progress playing seeking seeked", s => O.updateProgress.call(t, s)),
            re.call(t, t.media, "volumechange", s => O.updateVolume.call(t, s)),
            re.call(t, t.media, "playing play pause ended emptied timeupdate", s => ue.checkPlaying.call(t, s)),
            re.call(t, t.media, "waiting canplay seeked playing", s => ue.checkLoading.call(t, s)),
            t.supported.ui && t.config.clickToPlay && !t.isAudio) {
                const s = ze.call(t, `.${t.config.classNames.video}`);
                if (!g.element(s))
                    return;
                re.call(t, i.container, "click", o => {
                    ([i.container, s].includes(o.target) || s.contains(o.target)) && (t.touch && t.config.hideControls || (t.ended ? (this.proxy(o, t.restart, "restart"),
                    this.proxy(o, () => {
                        pi(t.play())
                    }
                    , "play")) : this.proxy(o, () => {
                        pi(t.togglePlay())
                    }
                    , "play")))
                }
                )
            }
            t.supported.ui && t.config.disableContextMenu && re.call(t, i.wrapper, "contextmenu", s => {
                s.preventDefault()
            }
            , !1),
            re.call(t, t.media, "volumechange", () => {
                t.storage.set({
                    volume: t.volume,
                    muted: t.muted
                })
            }
            ),
            re.call(t, t.media, "ratechange", () => {
                O.updateSetting.call(t, "speed"),
                t.storage.set({
                    speed: t.speed
                })
            }
            ),
            re.call(t, t.media, "qualitychange", s => {
                O.updateSetting.call(t, "quality", null, s.detail.quality)
            }
            ),
            re.call(t, t.media, "ready qualitychange", () => {
                O.setDownloadUrl.call(t)
            }
            );
            const r = t.config.events.concat(["keyup", "keydown"]).join(" ");
            re.call(t, t.media, r, s => {
                let {detail: o={}} = s;
                s.type === "error" && (o = t.media.error),
                U.call(t, i.container, s.type, !0, o)
            }
            )
        }
        ),
        D(this, "proxy", (t, i, r) => {
            const {player: s} = this
              , o = s.config.listeners[r];
            let a = !0;
            g.function(o) && (a = o.call(s, t)),
            a !== !1 && g.function(i) && i.call(s, t)
        }
        ),
        D(this, "bind", (t, i, r, s, o=!0) => {
            const {player: a} = this
              , l = a.config.listeners[s]
              , c = g.function(l);
            re.call(a, t, i, u => this.proxy(u, r, s), o && !c)
        }
        ),
        D(this, "controls", () => {
            const {player: t} = this
              , {elements: i} = t
              , r = Ye.isIE ? "change" : "input";
            if (i.buttons.play && Array.from(i.buttons.play).forEach(s => {
                this.bind(s, "click", () => {
                    pi(t.togglePlay())
                }
                , "play")
            }
            ),
            this.bind(i.buttons.restart, "click", t.restart, "restart"),
            this.bind(i.buttons.rewind, "click", () => {
                t.lastSeekTime = Date.now(),
                t.rewind()
            }
            , "rewind"),
            this.bind(i.buttons.fastForward, "click", () => {
                t.lastSeekTime = Date.now(),
                t.forward()
            }
            , "fastForward"),
            this.bind(i.buttons.mute, "click", () => {
                t.muted = !t.muted
            }
            , "mute"),
            this.bind(i.buttons.captions, "click", () => t.toggleCaptions()),
            this.bind(i.buttons.download, "click", () => {
                U.call(t, t.media, "download")
            }
            , "download"),
            this.bind(i.buttons.fullscreen, "click", () => {
                t.fullscreen.toggle()
            }
            , "fullscreen"),
            this.bind(i.buttons.pip, "click", () => {
                t.pip = "toggle"
            }
            , "pip"),
            this.bind(i.buttons.airplay, "click", t.airplay, "airplay"),
            this.bind(i.buttons.settings, "click", s => {
                s.stopPropagation(),
                s.preventDefault(),
                O.toggleMenu.call(t, s)
            }
            , null, !1),
            this.bind(i.buttons.settings, "keyup", s => {
                [" ", "Enter"].includes(s.key) && (s.key !== "Enter" ? (s.preventDefault(),
                s.stopPropagation(),
                O.toggleMenu.call(t, s)) : O.focusFirstMenuItem.call(t, null, !0))
            }
            , null, !1),
            this.bind(i.settings.menu, "keydown", s => {
                s.key === "Escape" && O.toggleMenu.call(t, s)
            }
            ),
            this.bind(i.inputs.seek, "mousedown mousemove", s => {
                const o = i.progress.getBoundingClientRect()
                  , a = 100 / o.width * (s.pageX - o.left);
                s.currentTarget.setAttribute("seek-value", a)
            }
            ),
            this.bind(i.inputs.seek, "mousedown mouseup keydown keyup touchstart touchend", s => {
                const o = s.currentTarget
                  , a = "play-on-seeked";
                if (g.keyboardEvent(s) && !["ArrowLeft", "ArrowRight"].includes(s.key))
                    return;
                t.lastSeekTime = Date.now();
                const l = o.hasAttribute(a)
                  , c = ["mouseup", "touchend", "keyup"].includes(s.type);
                l && c ? (o.removeAttribute(a),
                pi(t.play())) : !c && t.playing && (o.setAttribute(a, ""),
                t.pause())
            }
            ),
            Ye.isIos) {
                const s = rs.call(t, 'input[type="range"]');
                Array.from(s).forEach(o => this.bind(o, r, a => ph(a.target)))
            }
            this.bind(i.inputs.seek, r, s => {
                const o = s.currentTarget;
                let a = o.getAttribute("seek-value");
                g.empty(a) && (a = o.value),
                o.removeAttribute("seek-value"),
                t.currentTime = a / o.max * t.duration
            }
            , "seek"),
            this.bind(i.progress, "mouseenter mouseleave mousemove", s => O.updateSeekTooltip.call(t, s)),
            this.bind(i.progress, "mousemove touchmove", s => {
                const {previewThumbnails: o} = t;
                o && o.loaded && o.startMove(s)
            }
            ),
            this.bind(i.progress, "mouseleave touchend click", () => {
                const {previewThumbnails: s} = t;
                s && s.loaded && s.endMove(!1, !0)
            }
            ),
            this.bind(i.progress, "mousedown touchstart", s => {
                const {previewThumbnails: o} = t;
                o && o.loaded && o.startScrubbing(s)
            }
            ),
            this.bind(i.progress, "mouseup touchend", s => {
                const {previewThumbnails: o} = t;
                o && o.loaded && o.endScrubbing(s)
            }
            ),
            Ye.isWebKit && Array.from(rs.call(t, 'input[type="range"]')).forEach(s => {
                this.bind(s, "input", o => O.updateRangeFill.call(t, o.target))
            }
            ),
            t.config.toggleInvert && !g.element(i.display.duration) && this.bind(i.display.currentTime, "click", () => {
                t.currentTime !== 0 && (t.config.invertTime = !t.config.invertTime,
                O.timeUpdate.call(t))
            }
            ),
            this.bind(i.inputs.volume, r, s => {
                t.volume = s.target.value
            }
            , "volume"),
            this.bind(i.controls, "mouseenter mouseleave", s => {
                i.controls.hover = !t.touch && s.type === "mouseenter"
            }
            ),
            i.fullscreen && Array.from(i.fullscreen.children).filter(s => !s.contains(i.container)).forEach(s => {
                this.bind(s, "mouseenter mouseleave", o => {
                    i.controls && (i.controls.hover = !t.touch && o.type === "mouseenter")
                }
                )
            }
            ),
            this.bind(i.controls, "mousedown mouseup touchstart touchend touchcancel", s => {
                i.controls.pressed = ["mousedown", "touchstart"].includes(s.type)
            }
            ),
            this.bind(i.controls, "focusin", () => {
                const {config: s, timers: o} = t;
                le(i.controls, s.classNames.noTransition, !0),
                ue.toggleControls.call(t, !0),
                setTimeout( () => {
                    le(i.controls, s.classNames.noTransition, !1)
                }
                , 0);
                const a = this.touch ? 3e3 : 4e3;
                clearTimeout(o.controls),
                o.controls = setTimeout( () => ue.toggleControls.call(t, !1), a)
            }
            ),
            this.bind(i.inputs.volume, "wheel", s => {
                const o = s.webkitDirectionInvertedFromDevice
                  , [a,l] = [s.deltaX, -s.deltaY].map(p => o ? -p : p)
                  , c = Math.sign(Math.abs(a) > Math.abs(l) ? a : l);
                t.increaseVolume(c / 50);
                const {volume: u} = t.media;
                (c === 1 && u < 1 || c === -1 && u > 0) && s.preventDefault()
            }
            , "volume", !1)
        }
        ),
        this.player = e,
        this.lastKey = null,
        this.focusTimer = null,
        this.lastKeyDown = null,
        this.handleKey = this.handleKey.bind(this),
        this.toggleMenu = this.toggleMenu.bind(this),
        this.firstTouch = this.firstTouch.bind(this)
    }
    handleKey(e) {
        const {player: t} = this
          , {elements: i} = t
          , {key: r, type: s, altKey: o, ctrlKey: a, metaKey: l, shiftKey: c} = e
          , u = s === "keydown"
          , p = u && r === this.lastKey;
        if (!(o || a || l || c) && r) {
            if (u) {
                const h = document.activeElement;
                if (g.element(h)) {
                    const {editable: m} = t.config.selectors
                      , {seek: f} = i.inputs;
                    if (h !== f && Tn(h, m) || e.key === " " && Tn(h, 'button, [role^="menuitem"]'))
                        return
                }
                switch ([" ", "ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "c", "f", "k", "l", "m"].includes(r) && (e.preventDefault(),
                e.stopPropagation()),
                r) {
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    p || (d = parseInt(r, 10),
                    t.currentTime = t.duration / 10 * d);
                    break;
                case " ":
                case "k":
                    p || pi(t.togglePlay());
                    break;
                case "ArrowUp":
                    t.increaseVolume(.1);
                    break;
                case "ArrowDown":
                    t.decreaseVolume(.1);
                    break;
                case "m":
                    p || (t.muted = !t.muted);
                    break;
                case "ArrowRight":
                    t.forward();
                    break;
                case "ArrowLeft":
                    t.rewind();
                    break;
                case "f":
                    t.fullscreen.toggle();
                    break;
                case "c":
                    p || t.toggleCaptions();
                    break;
                case "l":
                    t.loop = !t.loop
                }
                r === "Escape" && !t.fullscreen.usingNative && t.fullscreen.active && t.fullscreen.toggle(),
                this.lastKey = r
            } else
                this.lastKey = null;
            var d
        }
    }
    toggleMenu(e) {
        O.toggleMenu.call(this.player, e)
    }
}
function tm(n, e) {
    return n(e = {
        exports: {}
    }, e.exports),
    e.exports
}
var im = tm(function(n, e) {
    n.exports = function() {
        var t = function() {}
          , i = {}
          , r = {}
          , s = {};
        function o(d, h) {
            d = d.push ? d : [d];
            var m, f, w, _ = [], v = d.length, b = v;
            for (m = function(y, x) {
                x.length && _.push(y),
                --b || h(_)
            }
            ; v--; )
                f = d[v],
                (w = r[f]) ? m(f, w) : (s[f] = s[f] || []).push(m)
        }
        function a(d, h) {
            if (d) {
                var m = s[d];
                if (r[d] = h,
                m)
                    for (; m.length; )
                        m[0](d, h),
                        m.splice(0, 1)
            }
        }
        function l(d, h) {
            d.call && (d = {
                success: d
            }),
            h.length ? (d.error || t)(h) : (d.success || t)(d)
        }
        function c(d, h, m, f) {
            var w, _, v = document, b = m.async, y = (m.numRetries || 0) + 1, x = m.before || t, k = d.replace(/[\?|#].*$/, ""), T = d.replace(/^(css|img)!/, "");
            f = f || 0,
            /(^css!|\.css$)/.test(k) ? ((_ = v.createElement("link")).rel = "stylesheet",
            _.href = T,
            (w = "hideFocus"in _) && _.relList && (w = 0,
            _.rel = "preload",
            _.as = "style")) : /(^img!|\.(png|gif|jpg|svg|webp)$)/.test(k) ? (_ = v.createElement("img")).src = T : ((_ = v.createElement("script")).src = d,
            _.async = b === void 0 || b),
            _.onload = _.onerror = _.onbeforeload = function(M) {
                var E = M.type[0];
                if (w)
                    try {
                        _.sheet.cssText.length || (E = "e")
                    } catch (C) {
                        C.code != 18 && (E = "e")
                    }
                if (E == "e") {
                    if ((f += 1) < y)
                        return c(d, h, m, f)
                } else if (_.rel == "preload" && _.as == "style")
                    return _.rel = "stylesheet";
                h(d, E, M.defaultPrevented)
            }
            ,
            x(d, _) !== !1 && v.head.appendChild(_)
        }
        function u(d, h, m) {
            var f, w, _ = (d = d.push ? d : [d]).length, v = _, b = [];
            for (f = function(y, x, k) {
                if (x == "e" && b.push(y),
                x == "b") {
                    if (!k)
                        return;
                    b.push(y)
                }
                --_ || h(b)
            }
            ,
            w = 0; w < v; w++)
                c(d[w], f, m)
        }
        function p(d, h, m) {
            var f, w;
            if (h && h.trim && (f = h),
            w = (f ? m : h) || {},
            f) {
                if (f in i)
                    throw "LoadJS";
                i[f] = !0
            }
            function _(v, b) {
                u(d, function(y) {
                    l(w, y),
                    v && l({
                        success: v,
                        error: b
                    }, y),
                    a(f, y)
                }, w)
            }
            if (w.returnPromise)
                return new Promise(_);
            _()
        }
        return p.ready = function(d, h) {
            return o(d, function(m) {
                l(h, m)
            }),
            p
        }
        ,
        p.done = function(d) {
            a(d, [])
        }
        ,
        p.reset = function() {
            i = {},
            r = {},
            s = {}
        }
        ,
        p.isDefined = function(d) {
            return d in i
        }
        ,
        p
    }()
});
function hl(n) {
    return new Promise( (e, t) => {
        im(n, {
            success: e,
            error: t
        })
    }
    )
}
function nm(n) {
    return g.empty(n) ? null : g.number(Number(n)) ? n : n.match(/^.*(vimeo.com\/|video\/)(\d+).*/) ? RegExp.$2 : n
}
function rm(n) {
    const e = n.match(/^.*(vimeo.com\/|video\/)(\d+)(\?.*&*h=|\/)+([\d,a-f]+)/);
    return e && e.length === 5 ? e[4] : null
}
function Sr(n) {
    n && !this.embed.hasPlayed && (this.embed.hasPlayed = !0),
    this.media.paused === n && (this.media.paused = !n,
    U.call(this, this.media, n ? "play" : "pause"))
}
const Ta = {
    setup() {
        const n = this;
        le(n.elements.wrapper, n.config.classNames.embed, !0),
        n.options.speed = n.config.speed.options,
        mr.call(n),
        g.object(window.Vimeo) ? Ta.ready.call(n) : hl(n.config.urls.vimeo.sdk).then( () => {
            Ta.ready.call(n)
        }
        ).catch(e => {
            n.debug.warn("Vimeo SDK (player.js) failed to load", e)
        }
        )
    },
    ready() {
        const n = this
          , e = n.config.vimeo
          , {premium: t, referrerPolicy: i, ...r} = e;
        let s = n.media.getAttribute("src")
          , o = "";
        g.empty(s) ? (s = n.media.getAttribute(n.config.attributes.embed.id),
        o = n.media.getAttribute(n.config.attributes.embed.hash)) : o = rm(s);
        const a = o ? {
            h: o
        } : {};
        t && Object.assign(r, {
            controls: !1,
            sidedock: !1
        });
        const l = kh({
            loop: n.config.loop.active,
            autoplay: n.autoplay,
            muted: n.muted,
            gesture: "media",
            playsinline: n.config.playsinline,
            ...a,
            ...r
        })
          , c = nm(s)
          , u = j("iframe")
          , p = xa(n.config.urls.vimeo.iframe, c, l);
        if (u.setAttribute("src", p),
        u.setAttribute("allowfullscreen", ""),
        u.setAttribute("allow", ["autoplay", "fullscreen", "picture-in-picture", "encrypted-media", "accelerometer", "gyroscope"].join("; ")),
        g.empty(i) || u.setAttribute("referrerPolicy", i),
        t || !e.customControls)
            u.setAttribute("data-poster", n.poster),
            n.media = ro(u, n.media);
        else {
            const v = j("div", {
                class: n.config.classNames.embedContainer,
                "data-poster": n.poster
            });
            v.appendChild(u),
            n.media = ro(v, n.media)
        }
        e.customControls || ps(xa(n.config.urls.vimeo.api, p)).then(v => {
            !g.empty(v) && v.thumbnail_url && ue.setPoster.call(n, v.thumbnail_url).catch( () => {}
            )
        }
        ),
        n.embed = new window.Vimeo.Player(u,{
            autopause: n.config.autopause,
            muted: n.muted
        }),
        n.media.paused = !0,
        n.media.currentTime = 0,
        n.supported.ui && n.embed.disableTextTrack(),
        n.media.play = () => (Sr.call(n, !0),
        n.embed.play()),
        n.media.pause = () => (Sr.call(n, !1),
        n.embed.pause()),
        n.media.stop = () => {
            n.pause(),
            n.currentTime = 0
        }
        ;
        let {currentTime: d} = n.media;
        Object.defineProperty(n.media, "currentTime", {
            get: () => d,
            set(v) {
                const {embed: b, media: y, paused: x, volume: k} = n
                  , T = x && !b.hasPlayed;
                y.seeking = !0,
                U.call(n, y, "seeking"),
                Promise.resolve(T && b.setVolume(0)).then( () => b.setCurrentTime(v)).then( () => T && b.pause()).then( () => T && b.setVolume(k)).catch( () => {}
                )
            }
        });
        let h = n.config.speed.selected;
        Object.defineProperty(n.media, "playbackRate", {
            get: () => h,
            set(v) {
                n.embed.setPlaybackRate(v).then( () => {
                    h = v,
                    U.call(n, n.media, "ratechange")
                }
                ).catch( () => {
                    n.options.speed = [1]
                }
                )
            }
        });
        let {volume: m} = n.config;
        Object.defineProperty(n.media, "volume", {
            get: () => m,
            set(v) {
                n.embed.setVolume(v).then( () => {
                    m = v,
                    U.call(n, n.media, "volumechange")
                }
                )
            }
        });
        let {muted: f} = n.config;
        Object.defineProperty(n.media, "muted", {
            get: () => f,
            set(v) {
                const b = !!g.boolean(v) && v;
                n.embed.setMuted(!!b || n.config.muted).then( () => {
                    f = b,
                    U.call(n, n.media, "volumechange")
                }
                )
            }
        });
        let w, {loop: _} = n.config;
        Object.defineProperty(n.media, "loop", {
            get: () => _,
            set(v) {
                const b = g.boolean(v) ? v : n.config.loop.active;
                n.embed.setLoop(b).then( () => {
                    _ = b
                }
                )
            }
        }),
        n.embed.getVideoUrl().then(v => {
            w = v,
            O.setDownloadUrl.call(n)
        }
        ).catch(v => {
            this.debug.warn(v)
        }
        ),
        Object.defineProperty(n.media, "currentSrc", {
            get: () => w
        }),
        Object.defineProperty(n.media, "ended", {
            get: () => n.currentTime === n.duration
        }),
        Promise.all([n.embed.getVideoWidth(), n.embed.getVideoHeight()]).then(v => {
            const [b,y] = v;
            n.embed.ratio = _h(b, y),
            mr.call(this)
        }
        ),
        n.embed.setAutopause(n.config.autopause).then(v => {
            n.config.autopause = v
        }
        ),
        n.embed.getVideoTitle().then(v => {
            n.config.title = v,
            ue.setTitle.call(this)
        }
        ),
        n.embed.getCurrentTime().then(v => {
            d = v,
            U.call(n, n.media, "timeupdate")
        }
        ),
        n.embed.getDuration().then(v => {
            n.media.duration = v,
            U.call(n, n.media, "durationchange")
        }
        ),
        n.embed.getTextTracks().then(v => {
            n.media.textTracks = v,
            oe.setup.call(n)
        }
        ),
        n.embed.on("cuechange", ({cues: v=[]}) => {
            const b = v.map(y => Xp(y.text));
            oe.updateCues.call(n, b)
        }
        ),
        n.embed.on("loaded", () => {
            n.embed.getPaused().then(v => {
                Sr.call(n, !v),
                v || U.call(n, n.media, "playing")
            }
            ),
            g.element(n.embed.element) && n.supported.ui && n.embed.element.setAttribute("tabindex", -1)
        }
        ),
        n.embed.on("bufferstart", () => {
            U.call(n, n.media, "waiting")
        }
        ),
        n.embed.on("bufferend", () => {
            U.call(n, n.media, "playing")
        }
        ),
        n.embed.on("play", () => {
            Sr.call(n, !0),
            U.call(n, n.media, "playing")
        }
        ),
        n.embed.on("pause", () => {
            Sr.call(n, !1)
        }
        ),
        n.embed.on("timeupdate", v => {
            n.media.seeking = !1,
            d = v.seconds,
            U.call(n, n.media, "timeupdate")
        }
        ),
        n.embed.on("progress", v => {
            n.media.buffered = v.percent,
            U.call(n, n.media, "progress"),
            parseInt(v.percent, 10) === 1 && U.call(n, n.media, "canplaythrough"),
            n.embed.getDuration().then(b => {
                b !== n.media.duration && (n.media.duration = b,
                U.call(n, n.media, "durationchange"))
            }
            )
        }
        ),
        n.embed.on("seeked", () => {
            n.media.seeking = !1,
            U.call(n, n.media, "seeked")
        }
        ),
        n.embed.on("ended", () => {
            n.media.paused = !0,
            U.call(n, n.media, "ended")
        }
        ),
        n.embed.on("error", v => {
            n.media.error = v,
            U.call(n, n.media, "error")
        }
        ),
        e.customControls && setTimeout( () => ue.build.call(n), 0)
    }
};
function sm(n) {
    return g.empty(n) ? null : n.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/) ? RegExp.$2 : n
}
function kr(n) {
    n && !this.embed.hasPlayed && (this.embed.hasPlayed = !0),
    this.media.paused === n && (this.media.paused = !n,
    U.call(this, this.media, n ? "play" : "pause"))
}
function om(n) {
    return n.noCookie ? "https://www.youtube-nocookie.com" : window.location.protocol === "http:" ? "http://www.youtube.com" : void 0
}
const Us = {
    setup() {
        if (le(this.elements.wrapper, this.config.classNames.embed, !0),
        g.object(window.YT) && g.function(window.YT.Player))
            Us.ready.call(this);
        else {
            const n = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                g.function(n) && n(),
                Us.ready.call(this)
            }
            ,
            hl(this.config.urls.youtube.sdk).catch(e => {
                this.debug.warn("YouTube API failed to load", e)
            }
            )
        }
    },
    getTitle(n) {
        ps(xa(this.config.urls.youtube.api, n)).then(e => {
            if (g.object(e)) {
                const {title: t, height: i, width: r} = e;
                this.config.title = t,
                ue.setTitle.call(this),
                this.embed.ratio = _h(r, i)
            }
            mr.call(this)
        }
        ).catch( () => {
            mr.call(this)
        }
        )
    },
    ready() {
        const n = this
          , e = n.config.youtube
          , t = n.media && n.media.getAttribute("id");
        if (!g.empty(t) && t.startsWith("youtube-"))
            return;
        let i = n.media.getAttribute("src");
        g.empty(i) && (i = n.media.getAttribute(this.config.attributes.embed.id));
        const r = sm(i)
          , s = j("div", {
            id: Up(n.provider),
            "data-poster": e.customControls ? n.poster : void 0
        });
        if (n.media = ro(s, n.media),
        e.customControls) {
            const o = a => `https://i.ytimg.com/vi/${r}/${a}default.jpg`;
            js(o("maxres"), 121).catch( () => js(o("sd"), 121)).catch( () => js(o("hq"))).then(a => ue.setPoster.call(n, a.src)).then(a => {
                a.includes("maxres") || (n.elements.poster.style.backgroundSize = "cover")
            }
            ).catch( () => {}
            )
        }
        n.embed = new window.YT.Player(n.media,{
            videoId: r,
            host: om(e),
            playerVars: Pe({}, {
                autoplay: n.config.autoplay ? 1 : 0,
                hl: n.config.hl,
                controls: n.supported.ui && e.customControls ? 0 : 1,
                disablekb: 1,
                playsinline: n.config.playsinline && !n.config.fullscreen.iosNative ? 1 : 0,
                cc_load_policy: n.captions.active ? 1 : 0,
                cc_lang_pref: n.config.captions.language,
                widget_referrer: window ? window.location.href : null
            }, e),
            events: {
                onError(o) {
                    if (!n.media.error) {
                        const a = o.data
                          , l = {
                            2: "The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.",
                            5: "The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.",
                            100: "The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.",
                            101: "The owner of the requested video does not allow it to be played in embedded players.",
                            150: "The owner of the requested video does not allow it to be played in embedded players."
                        }[a] || "An unknown error occurred";
                        n.media.error = {
                            code: a,
                            message: l
                        },
                        U.call(n, n.media, "error")
                    }
                },
                onPlaybackRateChange(o) {
                    const a = o.target;
                    n.media.playbackRate = a.getPlaybackRate(),
                    U.call(n, n.media, "ratechange")
                },
                onReady(o) {
                    if (g.function(n.media.play))
                        return;
                    const a = o.target;
                    Us.getTitle.call(n, r),
                    n.media.play = () => {
                        kr.call(n, !0),
                        a.playVideo()
                    }
                    ,
                    n.media.pause = () => {
                        kr.call(n, !1),
                        a.pauseVideo()
                    }
                    ,
                    n.media.stop = () => {
                        a.stopVideo()
                    }
                    ,
                    n.media.duration = a.getDuration(),
                    n.media.paused = !0,
                    n.media.currentTime = 0,
                    Object.defineProperty(n.media, "currentTime", {
                        get: () => Number(a.getCurrentTime()),
                        set(p) {
                            n.paused && !n.embed.hasPlayed && n.embed.mute(),
                            n.media.seeking = !0,
                            U.call(n, n.media, "seeking"),
                            a.seekTo(p)
                        }
                    }),
                    Object.defineProperty(n.media, "playbackRate", {
                        get: () => a.getPlaybackRate(),
                        set(p) {
                            a.setPlaybackRate(p)
                        }
                    });
                    let {volume: l} = n.config;
                    Object.defineProperty(n.media, "volume", {
                        get: () => l,
                        set(p) {
                            l = p,
                            a.setVolume(100 * l),
                            U.call(n, n.media, "volumechange")
                        }
                    });
                    let {muted: c} = n.config;
                    Object.defineProperty(n.media, "muted", {
                        get: () => c,
                        set(p) {
                            const d = g.boolean(p) ? p : c;
                            c = d,
                            a[d ? "mute" : "unMute"](),
                            a.setVolume(100 * l),
                            U.call(n, n.media, "volumechange")
                        }
                    }),
                    Object.defineProperty(n.media, "currentSrc", {
                        get: () => a.getVideoUrl()
                    }),
                    Object.defineProperty(n.media, "ended", {
                        get: () => n.currentTime === n.duration
                    });
                    const u = a.getAvailablePlaybackRates();
                    n.options.speed = u.filter(p => n.config.speed.options.includes(p)),
                    n.supported.ui && e.customControls && n.media.setAttribute("tabindex", -1),
                    U.call(n, n.media, "timeupdate"),
                    U.call(n, n.media, "durationchange"),
                    clearInterval(n.timers.buffering),
                    n.timers.buffering = setInterval( () => {
                        n.media.buffered = a.getVideoLoadedFraction(),
                        (n.media.lastBuffered === null || n.media.lastBuffered < n.media.buffered) && U.call(n, n.media, "progress"),
                        n.media.lastBuffered = n.media.buffered,
                        n.media.buffered === 1 && (clearInterval(n.timers.buffering),
                        U.call(n, n.media, "canplaythrough"))
                    }
                    , 200),
                    e.customControls && setTimeout( () => ue.build.call(n), 50)
                },
                onStateChange(o) {
                    const a = o.target;
                    switch (clearInterval(n.timers.playing),
                    n.media.seeking && [1, 2].includes(o.data) && (n.media.seeking = !1,
                    U.call(n, n.media, "seeked")),
                    o.data) {
                    case -1:
                        U.call(n, n.media, "timeupdate"),
                        n.media.buffered = a.getVideoLoadedFraction(),
                        U.call(n, n.media, "progress");
                        break;
                    case 0:
                        kr.call(n, !1),
                        n.media.loop ? (a.stopVideo(),
                        a.playVideo()) : U.call(n, n.media, "ended");
                        break;
                    case 1:
                        e.customControls && !n.config.autoplay && n.media.paused && !n.embed.hasPlayed ? n.media.pause() : (kr.call(n, !0),
                        U.call(n, n.media, "playing"),
                        n.timers.playing = setInterval( () => {
                            U.call(n, n.media, "timeupdate")
                        }
                        , 50),
                        n.media.duration !== a.getDuration() && (n.media.duration = a.getDuration(),
                        U.call(n, n.media, "durationchange")));
                        break;
                    case 2:
                        n.muted || n.embed.unMute(),
                        kr.call(n, !1);
                        break;
                    case 3:
                        U.call(n, n.media, "waiting")
                    }
                    U.call(n, n.elements.container, "statechange", !1, {
                        code: o.data
                    })
                }
            }
        })
    }
}
  , Eh = {
    setup() {
        this.media ? (le(this.elements.container, this.config.classNames.type.replace("{0}", this.type), !0),
        le(this.elements.container, this.config.classNames.provider.replace("{0}", this.provider), !0),
        this.isEmbed && le(this.elements.container, this.config.classNames.type.replace("{0}", "video"), !0),
        this.isVideo && (this.elements.wrapper = j("div", {
            class: this.config.classNames.video
        }),
        gh(this.media, this.elements.wrapper),
        this.elements.poster = j("div", {
            class: this.config.classNames.poster
        }),
        this.elements.wrapper.appendChild(this.elements.poster)),
        this.isHTML5 ? Zi.setup.call(this) : this.isYouTube ? Us.setup.call(this) : this.isVimeo && Ta.setup.call(this)) : this.debug.warn("No media element found!")
    }
};
class am {
    constructor(e) {
        D(this, "load", () => {
            this.enabled && (g.object(window.google) && g.object(window.google.ima) ? this.ready() : hl(this.player.config.urls.googleIMA.sdk).then( () => {
                this.ready()
            }
            ).catch( () => {
                this.trigger("error", new Error("Google IMA SDK failed to load"))
            }
            ))
        }
        ),
        D(this, "ready", () => {
            var t;
            this.enabled || ((t = this).manager && t.manager.destroy(),
            t.elements.displayContainer && t.elements.displayContainer.destroy(),
            t.elements.container.remove()),
            this.startSafetyTimer(12e3, "ready()"),
            this.managerPromise.then( () => {
                this.clearSafetyTimer("onAdsManagerLoaded()")
            }
            ),
            this.listeners(),
            this.setupIMA()
        }
        ),
        D(this, "setupIMA", () => {
            this.elements.container = j("div", {
                class: this.player.config.classNames.ads
            }),
            this.player.elements.container.appendChild(this.elements.container),
            google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED),
            google.ima.settings.setLocale(this.player.config.ads.language),
            google.ima.settings.setDisableCustomPlaybackForIOS10Plus(this.player.config.playsinline),
            this.elements.displayContainer = new google.ima.AdDisplayContainer(this.elements.container,this.player.media),
            this.loader = new google.ima.AdsLoader(this.elements.displayContainer),
            this.loader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, t => this.onAdsManagerLoaded(t), !1),
            this.loader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, t => this.onAdError(t), !1),
            this.requestAds()
        }
        ),
        D(this, "requestAds", () => {
            const {container: t} = this.player.elements;
            try {
                const i = new google.ima.AdsRequest;
                i.adTagUrl = this.tagUrl,
                i.linearAdSlotWidth = t.offsetWidth,
                i.linearAdSlotHeight = t.offsetHeight,
                i.nonLinearAdSlotWidth = t.offsetWidth,
                i.nonLinearAdSlotHeight = t.offsetHeight,
                i.forceNonLinearFullSlot = !1,
                i.setAdWillPlayMuted(!this.player.muted),
                this.loader.requestAds(i)
            } catch (i) {
                this.onAdError(i)
            }
        }
        ),
        D(this, "pollCountdown", (t=!1) => {
            if (!t)
                return clearInterval(this.countdownTimer),
                void this.elements.container.removeAttribute("data-badge-text");
            this.countdownTimer = setInterval( () => {
                const i = yo(Math.max(this.manager.getRemainingTime(), 0))
                  , r = `${We.get("advertisement", this.player.config)} - ${i}`;
                this.elements.container.setAttribute("data-badge-text", r)
            }
            , 100)
        }
        ),
        D(this, "onAdsManagerLoaded", t => {
            if (!this.enabled)
                return;
            const i = new google.ima.AdsRenderingSettings;
            i.restoreCustomPlaybackStateOnAdBreakComplete = !0,
            i.enablePreloading = !0,
            this.manager = t.getAdsManager(this.player, i),
            this.cuePoints = this.manager.getCuePoints(),
            this.manager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, r => this.onAdError(r)),
            Object.keys(google.ima.AdEvent.Type).forEach(r => {
                this.manager.addEventListener(google.ima.AdEvent.Type[r], s => this.onAdEvent(s))
            }
            ),
            this.trigger("loaded")
        }
        ),
        D(this, "addCuePoints", () => {
            g.empty(this.cuePoints) || this.cuePoints.forEach(t => {
                if (t !== 0 && t !== -1 && t < this.player.duration) {
                    const i = this.player.elements.progress;
                    if (g.element(i)) {
                        const r = 100 / this.player.duration * t
                          , s = j("span", {
                            class: this.player.config.classNames.cues
                        });
                        s.style.left = `${r.toString()}%`,
                        i.appendChild(s)
                    }
                }
            }
            )
        }
        ),
        D(this, "onAdEvent", t => {
            const {container: i} = this.player.elements
              , r = t.getAd()
              , s = t.getAdData();
            switch ((o => {
                U.call(this.player, this.player.media, `ads${o.replace(/_/g, "").toLowerCase()}`)
            }
            )(t.type),
            t.type) {
            case google.ima.AdEvent.Type.LOADED:
                this.trigger("loaded"),
                this.pollCountdown(!0),
                r.isLinear() || (r.width = i.offsetWidth,
                r.height = i.offsetHeight);
                break;
            case google.ima.AdEvent.Type.STARTED:
                this.manager.setVolume(this.player.volume);
                break;
            case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
                this.player.ended ? this.loadAds() : this.loader.contentComplete();
                break;
            case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED:
                this.pauseContent();
                break;
            case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED:
                this.pollCountdown(),
                this.resumeContent();
                break;
            case google.ima.AdEvent.Type.LOG:
                s.adError && this.player.debug.warn(`Non-fatal ad error: ${s.adError.getMessage()}`)
            }
        }
        ),
        D(this, "onAdError", t => {
            this.cancel(),
            this.player.debug.warn("Ads error", t)
        }
        ),
        D(this, "listeners", () => {
            const {container: t} = this.player.elements;
            let i;
            this.player.on("canplay", () => {
                this.addCuePoints()
            }
            ),
            this.player.on("ended", () => {
                this.loader.contentComplete()
            }
            ),
            this.player.on("timeupdate", () => {
                i = this.player.currentTime
            }
            ),
            this.player.on("seeked", () => {
                const r = this.player.currentTime;
                g.empty(this.cuePoints) || this.cuePoints.forEach( (s, o) => {
                    i < s && s < r && (this.manager.discardAdBreak(),
                    this.cuePoints.splice(o, 1))
                }
                )
            }
            ),
            window.addEventListener("resize", () => {
                this.manager && this.manager.resize(t.offsetWidth, t.offsetHeight, google.ima.ViewMode.NORMAL)
            }
            )
        }
        ),
        D(this, "play", () => {
            const {container: t} = this.player.elements;
            this.managerPromise || this.resumeContent(),
            this.managerPromise.then( () => {
                this.manager.setVolume(this.player.volume),
                this.elements.displayContainer.initialize();
                try {
                    this.initialized || (this.manager.init(t.offsetWidth, t.offsetHeight, google.ima.ViewMode.NORMAL),
                    this.manager.start()),
                    this.initialized = !0
                } catch (i) {
                    this.onAdError(i)
                }
            }
            ).catch( () => {}
            )
        }
        ),
        D(this, "resumeContent", () => {
            this.elements.container.style.zIndex = "",
            this.playing = !1,
            pi(this.player.media.play())
        }
        ),
        D(this, "pauseContent", () => {
            this.elements.container.style.zIndex = 3,
            this.playing = !0,
            this.player.media.pause()
        }
        ),
        D(this, "cancel", () => {
            this.initialized && this.resumeContent(),
            this.trigger("error"),
            this.loadAds()
        }
        ),
        D(this, "loadAds", () => {
            this.managerPromise.then( () => {
                this.manager && this.manager.destroy(),
                this.managerPromise = new Promise(t => {
                    this.on("loaded", t),
                    this.player.debug.log(this.manager)
                }
                ),
                this.initialized = !1,
                this.requestAds()
            }
            ).catch( () => {}
            )
        }
        ),
        D(this, "trigger", (t, ...i) => {
            const r = this.events[t];
            g.array(r) && r.forEach(s => {
                g.function(s) && s.apply(this, i)
            }
            )
        }
        ),
        D(this, "on", (t, i) => (g.array(this.events[t]) || (this.events[t] = []),
        this.events[t].push(i),
        this)),
        D(this, "startSafetyTimer", (t, i) => {
            this.player.debug.log(`Safety timer invoked from: ${i}`),
            this.safetyTimer = setTimeout( () => {
                this.cancel(),
                this.clearSafetyTimer("startSafetyTimer()")
            }
            , t)
        }
        ),
        D(this, "clearSafetyTimer", t => {
            g.nullOrUndefined(this.safetyTimer) || (this.player.debug.log(`Safety timer cleared from: ${t}`),
            clearTimeout(this.safetyTimer),
            this.safetyTimer = null)
        }
        ),
        this.player = e,
        this.config = e.config.ads,
        this.playing = !1,
        this.initialized = !1,
        this.elements = {
            container: null,
            displayContainer: null
        },
        this.manager = null,
        this.loader = null,
        this.cuePoints = null,
        this.events = {},
        this.safetyTimer = null,
        this.countdownTimer = null,
        this.managerPromise = new Promise( (t, i) => {
            this.on("loaded", t),
            this.on("error", i)
        }
        ),
        this.load()
    }
    get enabled() {
        const {config: e} = this;
        return this.player.isHTML5 && this.player.isVideo && e.enabled && (!g.empty(e.publisherId) || g.url(e.tagUrl))
    }
    get tagUrl() {
        const {config: e} = this;
        return g.url(e.tagUrl) ? e.tagUrl : `https://go.aniview.com/api/adserver6/vast/?${kh({
            AV_PUBLISHERID: "58c25bb0073ef448b1087ad6",
            AV_CHANNELID: "5a0458dc28a06145e4519d21",
            AV_URL: window.location.hostname,
            cb: Date.now(),
            AV_WIDTH: 640,
            AV_HEIGHT: 480,
            AV_CDIM2: e.publisherId
        })}`
    }
}
function Ph(n=0, e=0, t=255) {
    return Math.min(Math.max(n, e), t)
}
const lm = n => {
    const e = [];
    return n.split(/\r\n\r\n|\n\n|\r\r/).forEach(t => {
        const i = {};
        t.split(/\r\n|\n|\r/).forEach(r => {
            if (g.number(i.startTime)) {
                if (!g.empty(r.trim()) && g.empty(i.text)) {
                    const s = r.trim().split("#xywh=");
                    [i.text] = s,
                    s[1] && ([i.x,i.y,i.w,i.h] = s[1].split(","))
                }
            } else {
                const s = r.match(/([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})( ?--> ?)([0-9]{2})?:?([0-9]{2}):([0-9]{2}).([0-9]{2,3})/);
                s && (i.startTime = 60 * Number(s[1] || 0) * 60 + 60 * Number(s[2]) + Number(s[3]) + +`0.${s[4]}`,
                i.endTime = 60 * Number(s[6] || 0) * 60 + 60 * Number(s[7]) + Number(s[8]) + +`0.${s[9]}`)
            }
        }
        ),
        i.text && e.push(i)
    }
    ),
    e
}
  , lc = (n, e) => {
    const t = {};
    return n > e.width / e.height ? (t.width = e.width,
    t.height = 1 / n * e.width) : (t.height = e.height,
    t.width = n * e.height),
    t
}
;
class Sa {
    constructor(e) {
        D(this, "load", () => {
            this.player.elements.display.seekTooltip && (this.player.elements.display.seekTooltip.hidden = this.enabled),
            this.enabled && this.getThumbnails().then( () => {
                this.enabled && (this.render(),
                this.determineContainerAutoSizing(),
                this.listeners(),
                this.loaded = !0)
            }
            )
        }
        ),
        D(this, "getThumbnails", () => new Promise(t => {
            const {src: i} = this.player.config.previewThumbnails;
            if (g.empty(i))
                throw new Error("Missing previewThumbnails.src config attribute");
            const r = () => {
                this.thumbnails.sort( (s, o) => s.height - o.height),
                this.player.debug.log("Preview thumbnails", this.thumbnails),
                t()
            }
            ;
            if (g.function(i))
                i(s => {
                    this.thumbnails = s,
                    r()
                }
                );
            else {
                const s = (g.string(i) ? [i] : i).map(o => this.getThumbnail(o));
                Promise.all(s).then(r)
            }
        }
        )),
        D(this, "getThumbnail", t => new Promise(i => {
            ps(t).then(r => {
                const s = {
                    frames: lm(r),
                    height: null,
                    urlPrefix: ""
                };
                s.frames[0].text.startsWith("/") || s.frames[0].text.startsWith("http://") || s.frames[0].text.startsWith("https://") || (s.urlPrefix = t.substring(0, t.lastIndexOf("/") + 1));
                const o = new Image;
                o.onload = () => {
                    s.height = o.naturalHeight,
                    s.width = o.naturalWidth,
                    this.thumbnails.push(s),
                    i()
                }
                ,
                o.src = s.urlPrefix + s.frames[0].text
            }
            )
        }
        )),
        D(this, "startMove", t => {
            if (this.loaded && g.event(t) && ["touchmove", "mousemove"].includes(t.type) && this.player.media.duration) {
                if (t.type === "touchmove")
                    this.seekTime = this.player.media.duration * (this.player.elements.inputs.seek.value / 100);
                else {
                    var i, r;
                    const s = this.player.elements.progress.getBoundingClientRect()
                      , o = 100 / s.width * (t.pageX - s.left);
                    this.seekTime = this.player.media.duration * (o / 100),
                    this.seekTime < 0 && (this.seekTime = 0),
                    this.seekTime > this.player.media.duration - 1 && (this.seekTime = this.player.media.duration - 1),
                    this.mousePosX = t.pageX,
                    this.elements.thumb.time.innerText = yo(this.seekTime);
                    const a = (i = this.player.config.markers) === null || i === void 0 || (r = i.points) === null || r === void 0 ? void 0 : r.find( ({time: l}) => l === Math.round(this.seekTime));
                    a && this.elements.thumb.time.insertAdjacentHTML("afterbegin", `${a.label}<br>`)
                }
                this.showImageAtCurrentTime()
            }
        }
        ),
        D(this, "endMove", () => {
            this.toggleThumbContainer(!1, !0)
        }
        ),
        D(this, "startScrubbing", t => {
            (g.nullOrUndefined(t.button) || t.button === !1 || t.button === 0) && (this.mouseDown = !0,
            this.player.media.duration && (this.toggleScrubbingContainer(!0),
            this.toggleThumbContainer(!1, !0),
            this.showImageAtCurrentTime()))
        }
        ),
        D(this, "endScrubbing", () => {
            this.mouseDown = !1,
            Math.ceil(this.lastTime) === Math.ceil(this.player.media.currentTime) ? this.toggleScrubbingContainer(!1) : cl.call(this.player, this.player.media, "timeupdate", () => {
                this.mouseDown || this.toggleScrubbingContainer(!1)
            }
            )
        }
        ),
        D(this, "listeners", () => {
            this.player.on("play", () => {
                this.toggleThumbContainer(!1, !0)
            }
            ),
            this.player.on("seeked", () => {
                this.toggleThumbContainer(!1)
            }
            ),
            this.player.on("timeupdate", () => {
                this.lastTime = this.player.media.currentTime
            }
            )
        }
        ),
        D(this, "render", () => {
            this.elements.thumb.container = j("div", {
                class: this.player.config.classNames.previewThumbnails.thumbContainer
            }),
            this.elements.thumb.imageContainer = j("div", {
                class: this.player.config.classNames.previewThumbnails.imageContainer
            }),
            this.elements.thumb.container.appendChild(this.elements.thumb.imageContainer);
            const t = j("div", {
                class: this.player.config.classNames.previewThumbnails.timeContainer
            });
            this.elements.thumb.time = j("span", {}, "00:00"),
            t.appendChild(this.elements.thumb.time),
            this.elements.thumb.imageContainer.appendChild(t),
            g.element(this.player.elements.progress) && this.player.elements.progress.appendChild(this.elements.thumb.container),
            this.elements.scrubbing.container = j("div", {
                class: this.player.config.classNames.previewThumbnails.scrubbingContainer
            }),
            this.player.elements.wrapper.appendChild(this.elements.scrubbing.container)
        }
        ),
        D(this, "destroy", () => {
            this.elements.thumb.container && this.elements.thumb.container.remove(),
            this.elements.scrubbing.container && this.elements.scrubbing.container.remove()
        }
        ),
        D(this, "showImageAtCurrentTime", () => {
            this.mouseDown ? this.setScrubbingContainerSize() : this.setThumbContainerSizeAndPos();
            const t = this.thumbnails[0].frames.findIndex(s => this.seekTime >= s.startTime && this.seekTime <= s.endTime)
              , i = t >= 0;
            let r = 0;
            this.mouseDown || this.toggleThumbContainer(i),
            i && (this.thumbnails.forEach( (s, o) => {
                this.loadedImages.includes(s.frames[t].text) && (r = o)
            }
            ),
            t !== this.showingThumb && (this.showingThumb = t,
            this.loadImage(r)))
        }
        ),
        D(this, "loadImage", (t=0) => {
            const i = this.showingThumb
              , r = this.thumbnails[t]
              , {urlPrefix: s} = r
              , o = r.frames[i]
              , a = r.frames[i].text
              , l = s + a;
            if (this.currentImageElement && this.currentImageElement.dataset.filename === a)
                this.showImage(this.currentImageElement, o, t, i, a, !1),
                this.currentImageElement.dataset.index = i,
                this.removeOldImages(this.currentImageElement);
            else {
                this.loadingImage && this.usingSprites && (this.loadingImage.onload = null);
                const c = new Image;
                c.src = l,
                c.dataset.index = i,
                c.dataset.filename = a,
                this.showingThumbFilename = a,
                this.player.debug.log(`Loading image: ${l}`),
                c.onload = () => this.showImage(c, o, t, i, a, !0),
                this.loadingImage = c,
                this.removeOldImages(c)
            }
        }
        ),
        D(this, "showImage", (t, i, r, s, o, a=!0) => {
            this.player.debug.log(`Showing thumb: ${o}. num: ${s}. qual: ${r}. newimg: ${a}`),
            this.setImageSizeAndOffset(t, i),
            a && (this.currentImageContainer.appendChild(t),
            this.currentImageElement = t,
            this.loadedImages.includes(o) || this.loadedImages.push(o)),
            this.preloadNearby(s, !0).then(this.preloadNearby(s, !1)).then(this.getHigherQuality(r, t, i, o))
        }
        ),
        D(this, "removeOldImages", t => {
            Array.from(this.currentImageContainer.children).forEach(i => {
                if (i.tagName.toLowerCase() !== "img")
                    return;
                const r = this.usingSprites ? 500 : 1e3;
                if (i.dataset.index !== t.dataset.index && !i.dataset.deleting) {
                    i.dataset.deleting = !0;
                    const {currentImageContainer: s} = this;
                    setTimeout( () => {
                        s.removeChild(i),
                        this.player.debug.log(`Removing thumb: ${i.dataset.filename}`)
                    }
                    , r)
                }
            }
            )
        }
        ),
        D(this, "preloadNearby", (t, i=!0) => new Promise(r => {
            setTimeout( () => {
                const s = this.thumbnails[0].frames[t].text;
                if (this.showingThumbFilename === s) {
                    let o;
                    o = i ? this.thumbnails[0].frames.slice(t) : this.thumbnails[0].frames.slice(0, t).reverse();
                    let a = !1;
                    o.forEach(l => {
                        const c = l.text;
                        if (c !== s && !this.loadedImages.includes(c)) {
                            a = !0,
                            this.player.debug.log(`Preloading thumb filename: ${c}`);
                            const {urlPrefix: u} = this.thumbnails[0]
                              , p = u + c
                              , d = new Image;
                            d.src = p,
                            d.onload = () => {
                                this.player.debug.log(`Preloaded thumb filename: ${c}`),
                                this.loadedImages.includes(c) || this.loadedImages.push(c),
                                r()
                            }
                        }
                    }
                    ),
                    a || r()
                }
            }
            , 300)
        }
        )),
        D(this, "getHigherQuality", (t, i, r, s) => {
            if (t < this.thumbnails.length - 1) {
                let o = i.naturalHeight;
                this.usingSprites && (o = r.h),
                o < this.thumbContainerHeight && setTimeout( () => {
                    this.showingThumbFilename === s && (this.player.debug.log(`Showing higher quality thumb for: ${s}`),
                    this.loadImage(t + 1))
                }
                , 300)
            }
        }
        ),
        D(this, "toggleThumbContainer", (t=!1, i=!1) => {
            const r = this.player.config.classNames.previewThumbnails.thumbContainerShown;
            this.elements.thumb.container.classList.toggle(r, t),
            !t && i && (this.showingThumb = null,
            this.showingThumbFilename = null)
        }
        ),
        D(this, "toggleScrubbingContainer", (t=!1) => {
            const i = this.player.config.classNames.previewThumbnails.scrubbingContainerShown;
            this.elements.scrubbing.container.classList.toggle(i, t),
            t || (this.showingThumb = null,
            this.showingThumbFilename = null)
        }
        ),
        D(this, "determineContainerAutoSizing", () => {
            (this.elements.thumb.imageContainer.clientHeight > 20 || this.elements.thumb.imageContainer.clientWidth > 20) && (this.sizeSpecifiedInCSS = !0)
        }
        ),
        D(this, "setThumbContainerSizeAndPos", () => {
            const {imageContainer: t} = this.elements.thumb;
            if (this.sizeSpecifiedInCSS) {
                if (t.clientHeight > 20 && t.clientWidth < 20) {
                    const i = Math.floor(t.clientHeight * this.thumbAspectRatio);
                    t.style.width = `${i}px`
                } else if (t.clientHeight < 20 && t.clientWidth > 20) {
                    const i = Math.floor(t.clientWidth / this.thumbAspectRatio);
                    t.style.height = `${i}px`
                }
            } else {
                const i = Math.floor(this.thumbContainerHeight * this.thumbAspectRatio);
                t.style.height = `${this.thumbContainerHeight}px`,
                t.style.width = `${i}px`
            }
            this.setThumbContainerPos()
        }
        ),
        D(this, "setThumbContainerPos", () => {
            const t = this.player.elements.progress.getBoundingClientRect()
              , i = this.player.elements.container.getBoundingClientRect()
              , {container: r} = this.elements.thumb
              , s = i.left - t.left + 10
              , o = i.right - t.left - r.clientWidth - 10
              , a = this.mousePosX - t.left - r.clientWidth / 2
              , l = Ph(a, s, o);
            r.style.left = `${l}px`,
            r.style.setProperty("--preview-arrow-offset", a - l + "px")
        }
        ),
        D(this, "setScrubbingContainerSize", () => {
            const {width: t, height: i} = lc(this.thumbAspectRatio, {
                width: this.player.media.clientWidth,
                height: this.player.media.clientHeight
            });
            this.elements.scrubbing.container.style.width = `${t}px`,
            this.elements.scrubbing.container.style.height = `${i}px`
        }
        ),
        D(this, "setImageSizeAndOffset", (t, i) => {
            if (!this.usingSprites)
                return;
            const r = this.thumbContainerHeight / i.h;
            t.style.height = t.naturalHeight * r + "px",
            t.style.width = t.naturalWidth * r + "px",
            t.style.left = `-${i.x * r}px`,
            t.style.top = `-${i.y * r}px`
        }
        ),
        this.player = e,
        this.thumbnails = [],
        this.loaded = !1,
        this.lastMouseMoveTime = Date.now(),
        this.mouseDown = !1,
        this.loadedImages = [],
        this.elements = {
            thumb: {},
            scrubbing: {}
        },
        this.load()
    }
    get enabled() {
        return this.player.isHTML5 && this.player.isVideo && this.player.config.previewThumbnails.enabled
    }
    get currentImageContainer() {
        return this.mouseDown ? this.elements.scrubbing.container : this.elements.thumb.imageContainer
    }
    get usingSprites() {
        return Object.keys(this.thumbnails[0].frames[0]).includes("w")
    }
    get thumbAspectRatio() {
        return this.usingSprites ? this.thumbnails[0].frames[0].w / this.thumbnails[0].frames[0].h : this.thumbnails[0].width / this.thumbnails[0].height
    }
    get thumbContainerHeight() {
        if (this.mouseDown) {
            const {height: e} = lc(this.thumbAspectRatio, {
                width: this.player.media.clientWidth,
                height: this.player.media.clientHeight
            });
            return e
        }
        return this.sizeSpecifiedInCSS ? this.elements.thumb.imageContainer.clientHeight : Math.floor(this.player.media.clientWidth / this.thumbAspectRatio / 4)
    }
    get currentImageElement() {
        return this.mouseDown ? this.currentScrubbingImageElement : this.currentThumbnailImageElement
    }
    set currentImageElement(e) {
        this.mouseDown ? this.currentScrubbingImageElement = e : this.currentThumbnailImageElement = e
    }
}
const ka = {
    insertElements(n, e) {
        g.string(e) ? rc(n, this.media, {
            src: e
        }) : g.array(e) && e.forEach(t => {
            rc(n, this.media, t)
        }
        )
    },
    change(n) {
        mh(n, "sources.length") ? (Zi.cancelRequests.call(this),
        this.destroy.call(this, () => {
            this.options.quality = [],
            Mi(this.media),
            this.media = null,
            g.element(this.elements.container) && this.elements.container.removeAttribute("class");
            const {sources: e, type: t} = n
              , [{provider: i=Vi.html5, src: r}] = e
              , s = i === "html5" ? t : "div"
              , o = i === "html5" ? {} : {
                src: r
            };
            Object.assign(this, {
                provider: i,
                type: t,
                supported: Ae.check(t, i, this.config.playsinline),
                media: j(s, o)
            }),
            this.elements.container.appendChild(this.media),
            g.boolean(n.autoplay) && (this.config.autoplay = n.autoplay),
            this.isHTML5 && (this.config.crossorigin && this.media.setAttribute("crossorigin", ""),
            this.config.autoplay && this.media.setAttribute("autoplay", ""),
            g.empty(n.poster) || (this.poster = n.poster),
            this.config.loop.active && this.media.setAttribute("loop", ""),
            this.config.muted && this.media.setAttribute("muted", ""),
            this.config.playsinline && this.media.setAttribute("playsinline", "")),
            ue.addStyleHook.call(this),
            this.isHTML5 && ka.insertElements.call(this, "source", e),
            this.config.title = n.title,
            Eh.setup.call(this),
            this.isHTML5 && Object.keys(n).includes("tracks") && ka.insertElements.call(this, "track", n.tracks),
            (this.isHTML5 || this.isEmbed && !this.supported.ui) && ue.build.call(this),
            this.isHTML5 && this.media.load(),
            g.empty(n.previewThumbnails) || (Object.assign(this.config.previewThumbnails, n.previewThumbnails),
            this.previewThumbnails && this.previewThumbnails.loaded && (this.previewThumbnails.destroy(),
            this.previewThumbnails = null),
            this.config.previewThumbnails.enabled && (this.previewThumbnails = new Sa(this))),
            this.fullscreen.update()
        }
        , !0)) : this.debug.warn("Invalid source format")
    }
};
class as {
    constructor(e, t) {
        if (D(this, "play", () => g.function(this.media.play) ? (this.ads && this.ads.enabled && this.ads.managerPromise.then( () => this.ads.play()).catch( () => pi(this.media.play())),
        this.media.play()) : null),
        D(this, "pause", () => this.playing && g.function(this.media.pause) ? this.media.pause() : null),
        D(this, "togglePlay", a => (g.boolean(a) ? a : !this.playing) ? this.play() : this.pause()),
        D(this, "stop", () => {
            this.isHTML5 ? (this.pause(),
            this.restart()) : g.function(this.media.stop) && this.media.stop()
        }
        ),
        D(this, "restart", () => {
            this.currentTime = 0
        }
        ),
        D(this, "rewind", a => {
            this.currentTime -= g.number(a) ? a : this.config.seekTime
        }
        ),
        D(this, "forward", a => {
            this.currentTime += g.number(a) ? a : this.config.seekTime
        }
        ),
        D(this, "increaseVolume", a => {
            const l = this.media.muted ? 0 : this.volume;
            this.volume = l + (g.number(a) ? a : 0)
        }
        ),
        D(this, "decreaseVolume", a => {
            this.increaseVolume(-a)
        }
        ),
        D(this, "airplay", () => {
            Ae.airplay && this.media.webkitShowPlaybackTargetPicker()
        }
        ),
        D(this, "toggleControls", a => {
            if (this.supported.ui && !this.isAudio) {
                const l = so(this.elements.container, this.config.classNames.hideControls)
                  , c = a === void 0 ? void 0 : !a
                  , u = le(this.elements.container, this.config.classNames.hideControls, c);
                if (u && g.array(this.config.controls) && this.config.controls.includes("settings") && !g.empty(this.config.settings) && O.toggleMenu.call(this, !1),
                u !== l) {
                    const p = u ? "controlshidden" : "controlsshown";
                    U.call(this, this.media, p)
                }
                return !u
            }
            return !1
        }
        ),
        D(this, "on", (a, l) => {
            re.call(this, this.elements.container, a, l)
        }
        ),
        D(this, "once", (a, l) => {
            cl.call(this, this.elements.container, a, l)
        }
        ),
        D(this, "off", (a, l) => {
            go(this.elements.container, a, l)
        }
        ),
        D(this, "destroy", (a, l=!1) => {
            if (!this.ready)
                return;
            const c = () => {
                document.body.style.overflow = "",
                this.embed = null,
                l ? (Object.keys(this.elements).length && (Mi(this.elements.buttons.play),
                Mi(this.elements.captions),
                Mi(this.elements.controls),
                Mi(this.elements.wrapper),
                this.elements.buttons.play = null,
                this.elements.captions = null,
                this.elements.controls = null,
                this.elements.wrapper = null),
                g.function(a) && a()) : (Bp.call(this),
                Zi.cancelRequests.call(this),
                ro(this.elements.original, this.elements.container),
                U.call(this, this.elements.original, "destroyed", !0),
                g.function(a) && a.call(this.elements.original),
                this.ready = !1,
                setTimeout( () => {
                    this.elements = null,
                    this.media = null
                }
                , 200))
            }
            ;
            this.stop(),
            clearTimeout(this.timers.loading),
            clearTimeout(this.timers.controls),
            clearTimeout(this.timers.resized),
            this.isHTML5 ? (ue.toggleNativeControls.call(this, !0),
            c()) : this.isYouTube ? (clearInterval(this.timers.buffering),
            clearInterval(this.timers.playing),
            this.embed !== null && g.function(this.embed.destroy) && this.embed.destroy(),
            c()) : this.isVimeo && (this.embed !== null && this.embed.unload().then(c),
            setTimeout(c, 200))
        }
        ),
        D(this, "supports", a => Ae.mime.call(this, a)),
        this.timers = {},
        this.ready = !1,
        this.loading = !1,
        this.failed = !1,
        this.touch = Ae.touch,
        this.media = e,
        g.string(this.media) && (this.media = document.querySelectorAll(this.media)),
        (window.jQuery && this.media instanceof jQuery || g.nodeList(this.media) || g.array(this.media)) && (this.media = this.media[0]),
        this.config = Pe({}, Ch, as.defaults, t || {}, ( () => {
            try {
                return JSON.parse(this.media.getAttribute("data-plyr-config"))
            } catch {
                return {}
            }
        }
        )()),
        this.elements = {
            container: null,
            fullscreen: null,
            captions: null,
            buttons: {},
            display: {},
            progress: {},
            inputs: {},
            settings: {
                popup: null,
                menu: null,
                panels: {},
                buttons: {}
            }
        },
        this.captions = {
            active: null,
            currentTrack: -1,
            meta: new WeakMap
        },
        this.fullscreen = {
            active: !1
        },
        this.options = {
            speed: [],
            quality: []
        },
        this.debug = new Zp(this.config.debug),
        this.debug.log("Config", this.config),
        this.debug.log("Support", Ae),
        g.nullOrUndefined(this.media) || !g.element(this.media))
            return void this.debug.error("Setup failed: no suitable element passed");
        if (this.media.plyr)
            return void this.debug.warn("Target already setup");
        if (!this.config.enabled)
            return void this.debug.error("Setup failed: disabled by config");
        if (!Ae.check().api)
            return void this.debug.error("Setup failed: no support");
        const i = this.media.cloneNode(!0);
        i.autoplay = !1,
        this.elements.original = i;
        const r = this.media.tagName.toLowerCase();
        let s = null
          , o = null;
        switch (r) {
        case "div":
            if (s = this.media.querySelector("iframe"),
            g.element(s)) {
                if (o = Sh(s.getAttribute("src")),
                this.provider = Jp(o.toString()),
                this.elements.container = this.media,
                this.media = s,
                this.elements.container.className = "",
                o.search.length) {
                    const a = ["1", "true"];
                    a.includes(o.searchParams.get("autoplay")) && (this.config.autoplay = !0),
                    a.includes(o.searchParams.get("loop")) && (this.config.loop.active = !0),
                    this.isYouTube ? (this.config.playsinline = a.includes(o.searchParams.get("playsinline")),
                    this.config.youtube.hl = o.searchParams.get("hl")) : this.config.playsinline = !0
                }
            } else
                this.provider = this.media.getAttribute(this.config.attributes.embed.provider),
                this.media.removeAttribute(this.config.attributes.embed.provider);
            if (g.empty(this.provider) || !Object.values(Vi).includes(this.provider))
                return void this.debug.error("Setup failed: Invalid provider");
            this.type = Fo.video;
            break;
        case "video":
        case "audio":
            this.type = r,
            this.provider = Vi.html5,
            this.media.hasAttribute("crossorigin") && (this.config.crossorigin = !0),
            this.media.hasAttribute("autoplay") && (this.config.autoplay = !0),
            (this.media.hasAttribute("playsinline") || this.media.hasAttribute("webkit-playsinline")) && (this.config.playsinline = !0),
            this.media.hasAttribute("muted") && (this.config.muted = !0),
            this.media.hasAttribute("loop") && (this.config.loop.active = !0);
            break;
        default:
            return void this.debug.error("Setup failed: unsupported type")
        }
        this.supported = Ae.check(this.type, this.provider),
        this.supported.api ? (this.eventListeners = [],
        this.listeners = new em(this),
        this.storage = new os(this),
        this.media.plyr = this,
        g.element(this.elements.container) || (this.elements.container = j("div"),
        gh(this.media, this.elements.container)),
        ue.migrateStyles.call(this),
        ue.addStyleHook.call(this),
        Eh.setup.call(this),
        this.config.debug && re.call(this, this.elements.container, this.config.events.join(" "), a => {
            this.debug.log(`event: ${a.type}`)
        }
        ),
        this.fullscreen = new ri(this),
        (this.isHTML5 || this.isEmbed && !this.supported.ui) && ue.build.call(this),
        this.listeners.container(),
        this.listeners.global(),
        this.config.ads.enabled && (this.ads = new am(this)),
        this.isHTML5 && this.config.autoplay && this.once("canplay", () => pi(this.play())),
        this.lastSeekTime = 0,
        this.config.previewThumbnails.enabled && (this.previewThumbnails = new Sa(this))) : this.debug.error("Setup failed: no support")
    }
    get isHTML5() {
        return this.provider === Vi.html5
    }
    get isEmbed() {
        return this.isYouTube || this.isVimeo
    }
    get isYouTube() {
        return this.provider === Vi.youtube
    }
    get isVimeo() {
        return this.provider === Vi.vimeo
    }
    get isVideo() {
        return this.type === Fo.video
    }
    get isAudio() {
        return this.type === Fo.audio
    }
    get playing() {
        return !!(this.ready && !this.paused && !this.ended)
    }
    get paused() {
        return !!this.media.paused
    }
    get stopped() {
        return !!(this.paused && this.currentTime === 0)
    }
    get ended() {
        return !!this.media.ended
    }
    set currentTime(e) {
        if (!this.duration)
            return;
        const t = g.number(e) && e > 0;
        this.media.currentTime = t ? Math.min(e, this.duration) : 0,
        this.debug.log(`Seeking to ${this.currentTime} seconds`)
    }
    get currentTime() {
        return Number(this.media.currentTime)
    }
    get buffered() {
        const {buffered: e} = this.media;
        return g.number(e) ? e : e && e.length && this.duration > 0 ? e.end(0) / this.duration : 0
    }
    get seeking() {
        return !!this.media.seeking
    }
    get duration() {
        const e = parseFloat(this.config.duration)
          , t = (this.media || {}).duration
          , i = g.number(t) && t !== 1 / 0 ? t : 0;
        return e || i
    }
    set volume(e) {
        let t = e;
        g.string(t) && (t = Number(t)),
        g.number(t) || (t = this.storage.get("volume")),
        g.number(t) || ({volume: t} = this.config),
        t > 1 && (t = 1),
        t < 0 && (t = 0),
        this.config.volume = t,
        this.media.volume = t,
        !g.empty(e) && this.muted && t > 0 && (this.muted = !1)
    }
    get volume() {
        return Number(this.media.volume)
    }
    set muted(e) {
        let t = e;
        g.boolean(t) || (t = this.storage.get("muted")),
        g.boolean(t) || (t = this.config.muted),
        this.config.muted = t,
        this.media.muted = t
    }
    get muted() {
        return !!this.media.muted
    }
    get hasAudio() {
        return !this.isHTML5 || !!this.isAudio || !!this.media.mozHasAudio || !!this.media.webkitAudioDecodedByteCount || !!(this.media.audioTracks && this.media.audioTracks.length)
    }
    set speed(e) {
        let t = null;
        g.number(e) && (t = e),
        g.number(t) || (t = this.storage.get("speed")),
        g.number(t) || (t = this.config.speed.selected);
        const {minimumSpeed: i, maximumSpeed: r} = this;
        t = Ph(t, i, r),
        this.config.speed.selected = t,
        setTimeout( () => {
            this.media && (this.media.playbackRate = t)
        }
        , 0)
    }
    get speed() {
        return Number(this.media.playbackRate)
    }
    get minimumSpeed() {
        return this.isYouTube ? Math.min(...this.options.speed) : this.isVimeo ? .5 : .0625
    }
    get maximumSpeed() {
        return this.isYouTube ? Math.max(...this.options.speed) : this.isVimeo ? 2 : 16
    }
    set quality(e) {
        const t = this.config.quality
          , i = this.options.quality;
        if (!i.length)
            return;
        let r = [!g.empty(e) && Number(e), this.storage.get("quality"), t.selected, t.default].find(g.number)
          , s = !0;
        if (!i.includes(r)) {
            const o = yh(i, r);
            this.debug.warn(`Unsupported quality option: ${r}, using ${o} instead`),
            r = o,
            s = !1
        }
        t.selected = r,
        this.media.quality = r,
        s && this.storage.set({
            quality: r
        })
    }
    get quality() {
        return this.media.quality
    }
    set loop(e) {
        const t = g.boolean(e) ? e : this.config.loop.active;
        this.config.loop.active = t,
        this.media.loop = t
    }
    get loop() {
        return !!this.media.loop
    }
    set source(e) {
        ka.change.call(this, e)
    }
    get source() {
        return this.media.currentSrc
    }
    get download() {
        const {download: e} = this.config.urls;
        return g.url(e) ? e : this.source
    }
    set download(e) {
        g.url(e) && (this.config.urls.download = e,
        O.setDownloadUrl.call(this))
    }
    set poster(e) {
        this.isVideo ? ue.setPoster.call(this, e, !1).catch( () => {}
        ) : this.debug.warn("Poster can only be set for video")
    }
    get poster() {
        return this.isVideo ? this.media.getAttribute("poster") || this.media.getAttribute("data-poster") : null
    }
    get ratio() {
        if (!this.isVideo)
            return null;
        const e = oo(ul.call(this));
        return g.array(e) ? e.join(":") : e
    }
    set ratio(e) {
        this.isVideo ? g.string(e) && bh(e) ? (this.config.ratio = oo(e),
        mr.call(this)) : this.debug.error(`Invalid aspect ratio specified (${e})`) : this.debug.warn("Aspect ratio can only be set for video")
    }
    set autoplay(e) {
        this.config.autoplay = g.boolean(e) ? e : this.config.autoplay
    }
    get autoplay() {
        return !!this.config.autoplay
    }
    toggleCaptions(e) {
        oe.toggle.call(this, e, !1)
    }
    set currentTrack(e) {
        oe.set.call(this, e, !1),
        oe.setup.call(this)
    }
    get currentTrack() {
        const {toggled: e, currentTrack: t} = this.captions;
        return e ? t : -1
    }
    set language(e) {
        oe.setLanguage.call(this, e, !1)
    }
    get language() {
        return (oe.getCurrentTrack.call(this) || {}).language
    }
    set pip(e) {
        if (!Ae.pip)
            return;
        const t = g.boolean(e) ? e : !this.pip;
        g.function(this.media.webkitSetPresentationMode) && this.media.webkitSetPresentationMode(t ? $o.active : $o.inactive),
        g.function(this.media.requestPictureInPicture) && (!this.pip && t ? this.media.requestPictureInPicture() : this.pip && !t && document.exitPictureInPicture())
    }
    get pip() {
        return Ae.pip ? g.empty(this.media.webkitPresentationMode) ? this.media === document.pictureInPictureElement : this.media.webkitPresentationMode === $o.active : null
    }
    setPreviewThumbnails(e) {
        this.previewThumbnails && this.previewThumbnails.loaded && (this.previewThumbnails.destroy(),
        this.previewThumbnails = null),
        Object.assign(this.config.previewThumbnails, e),
        this.config.previewThumbnails.enabled && (this.previewThumbnails = new Sa(this))
    }
    static supported(e, t) {
        return Ae.check(e, t)
    }
    static loadSprite(e, t) {
        return xh(e, t)
    }
    static setup(e, t={}) {
        let i = null;
        return g.string(e) ? i = Array.from(document.querySelectorAll(e)) : g.nodeList(e) ? i = Array.from(e) : g.array(e) && (i = e.filter(g.element)),
        g.empty(i) ? null : i.map(r => new as(r,t))
    }
}
as.defaults = $p(Ch);
var Ah = {
    exports: {}
};
(function(n) {
    function e(l, c, u, p) {
        Object.defineProperty(l, c, {
            get: u,
            set: p,
            enumerable: !0,
            configurable: !0
        })
    }
    e(n.exports, "Gradient", () => a),
    e(n.exports, "MiniGl", () => i);
    class t {
        constructor(c, u, p, d=!1) {
            const h = this
              , m = document.location.search.toLowerCase().indexOf("debug=webgl") !== -1;
            h.canvas = c,
            h.gl = h.canvas.getContext("webgl", {
                antialias: !0
            }),
            h.meshes = [];
            const f = h.gl;
            u && p && this.setSize(u, p),
            h.lastDebugMsg,
            h.debug = d && m ? function(_) {
                const v = new Date;
                v - h.lastDebugMsg > 1e3 && console.log("---"),
                console.log(v.toLocaleTimeString() + Array(Math.max(0, 32 - _.length)).join(" ") + _ + ": ", ...Array.from(arguments).slice(1)),
                h.lastDebugMsg = v
            }
            : () => {}
            ,
            Object.defineProperties(h, {
                Material: {
                    enumerable: !1,
                    value: class {
                        constructor(_, v, b={}) {
                            const y = this;
                            function x(M, E) {
                                const C = f.createShader(M);
                                return f.shaderSource(C, E),
                                f.compileShader(C),
                                f.getShaderParameter(C, f.COMPILE_STATUS) || console.error(f.getShaderInfoLog(C)),
                                h.debug("Material.compileShaderSource", {
                                    source: E
                                }),
                                C
                            }
                            function k(M, E) {
                                return Object.entries(M).map( ([C,N]) => N.getDeclaration(C, E)).join(`
`)
                            }
                            y.uniforms = b,
                            y.uniformInstances = [];
                            const T = `
              precision highp float;
            `;
                            y.vertexSource = `
              ${T}
              attribute vec4 position;
              attribute vec2 uv;
              attribute vec2 uvNorm;
              ${k(h.commonUniforms, "vertex")}
              ${k(b, "vertex")}
              ${_}
            `,
                            y.Source = `
              ${T}
              ${k(h.commonUniforms, "fragment")}
              ${k(b, "fragment")}
              ${v}
            `,
                            y.vertexShader = x(f.VERTEX_SHADER, y.vertexSource),
                            y.fragmentShader = x(f.FRAGMENT_SHADER, y.Source),
                            y.program = f.createProgram(),
                            f.attachShader(y.program, y.vertexShader),
                            f.attachShader(y.program, y.fragmentShader),
                            f.linkProgram(y.program),
                            f.getProgramParameter(y.program, f.LINK_STATUS) || console.error(f.getProgramInfoLog(y.program)),
                            f.useProgram(y.program),
                            y.attachUniforms(void 0, h.commonUniforms),
                            y.attachUniforms(void 0, y.uniforms)
                        }
                        attachUniforms(_, v) {
                            const b = this;
                            _ === void 0 ? Object.entries(v).forEach( ([y,x]) => {
                                b.attachUniforms(y, x)
                            }
                            ) : v.type == "array" ? v.value.forEach( (y, x) => b.attachUniforms(`${_}[${x}]`, y)) : v.type == "struct" ? Object.entries(v.value).forEach( ([y,x]) => b.attachUniforms(`${_}.${y}`, x)) : (h.debug("Material.attachUniforms", {
                                name: _,
                                uniform: v
                            }),
                            b.uniformInstances.push({
                                uniform: v,
                                location: f.getUniformLocation(b.program, _)
                            }))
                        }
                    }
                },
                Uniform: {
                    enumerable: !1,
                    value: class {
                        constructor(_) {
                            this.type = "float",
                            Object.assign(this, _),
                            this.typeFn = {
                                float: "1f",
                                int: "1i",
                                vec2: "2fv",
                                vec3: "3fv",
                                vec4: "4fv",
                                mat4: "Matrix4fv"
                            }[this.type] || "1f",
                            this.update()
                        }
                        update(_) {
                            this.value !== void 0 && f[`uniform${this.typeFn}`](_, this.typeFn.indexOf("Matrix") === 0 ? this.transpose : this.value, this.typeFn.indexOf("Matrix") === 0 ? this.value : null)
                        }
                        getDeclaration(_, v, b) {
                            const y = this;
                            if (y.excludeFrom !== v) {
                                if (y.type === "array")
                                    return y.value[0].getDeclaration(_, v, y.value.length) + `
const int ${_}_length = ${y.value.length};`;
                                if (y.type === "struct") {
                                    let x = _.replace("u_", "");
                                    return x = x.charAt(0).toUpperCase() + x.slice(1),
                                    `uniform struct ${x}
                                  {
` + Object.entries(y.value).map( ([k,T]) => T.getDeclaration(k, v).replace(/^uniform/, "")).join("") + `
} ${_}${b > 0 ? `[${b}]` : ""};`
                                }
                                return `uniform ${y.type} ${_}${b > 0 ? `[${b}]` : ""};`
                            }
                        }
                    }
                },
                PlaneGeometry: {
                    enumerable: !1,
                    value: class {
                        constructor(_, v, b, y, x) {
                            f.createBuffer(),
                            this.attributes = {
                                position: new h.Attribute({
                                    target: f.ARRAY_BUFFER,
                                    size: 3
                                }),
                                uv: new h.Attribute({
                                    target: f.ARRAY_BUFFER,
                                    size: 2
                                }),
                                uvNorm: new h.Attribute({
                                    target: f.ARRAY_BUFFER,
                                    size: 2
                                }),
                                index: new h.Attribute({
                                    target: f.ELEMENT_ARRAY_BUFFER,
                                    size: 3,
                                    type: f.UNSIGNED_SHORT
                                })
                            },
                            this.setTopology(b, y),
                            this.setSize(_, v, x)
                        }
                        setTopology(_=1, v=1) {
                            const b = this;
                            b.xSegCount = _,
                            b.ySegCount = v,
                            b.vertexCount = (b.xSegCount + 1) * (b.ySegCount + 1),
                            b.quadCount = b.xSegCount * b.ySegCount * 2,
                            b.attributes.uv.values = new Float32Array(2 * b.vertexCount),
                            b.attributes.uvNorm.values = new Float32Array(2 * b.vertexCount),
                            b.attributes.index.values = new Uint16Array(3 * b.quadCount);
                            for (let y = 0; y <= b.ySegCount; y++)
                                for (let x = 0; x <= b.xSegCount; x++) {
                                    const k = y * (b.xSegCount + 1) + x;
                                    if (b.attributes.uv.values[2 * k] = x / b.xSegCount,
                                    b.attributes.uv.values[2 * k + 1] = 1 - y / b.ySegCount,
                                    b.attributes.uvNorm.values[2 * k] = x / b.xSegCount * 2 - 1,
                                    b.attributes.uvNorm.values[2 * k + 1] = 1 - y / b.ySegCount * 2,
                                    x < b.xSegCount && y < b.ySegCount) {
                                        const T = y * b.xSegCount + x;
                                        b.attributes.index.values[6 * T] = k,
                                        b.attributes.index.values[6 * T + 1] = k + 1 + b.xSegCount,
                                        b.attributes.index.values[6 * T + 2] = k + 1,
                                        b.attributes.index.values[6 * T + 3] = k + 1,
                                        b.attributes.index.values[6 * T + 4] = k + 1 + b.xSegCount,
                                        b.attributes.index.values[6 * T + 5] = k + 2 + b.xSegCount
                                    }
                                }
                            b.attributes.uv.update(),
                            b.attributes.uvNorm.update(),
                            b.attributes.index.update(),
                            h.debug("Geometry.setTopology", {
                                uv: b.attributes.uv,
                                uvNorm: b.attributes.uvNorm,
                                index: b.attributes.index
                            })
                        }
                        setSize(_=1, v=1, b="xz") {
                            const y = this;
                            y.width = _,
                            y.height = v,
                            y.orientation = b,
                            y.attributes.position.values && y.attributes.position.values.length === 3 * y.vertexCount || (y.attributes.position.values = new Float32Array(3 * y.vertexCount));
                            const x = _ / -2
                              , k = v / -2
                              , T = _ / y.xSegCount
                              , M = v / y.ySegCount;
                            for (let E = 0; E <= y.ySegCount; E++) {
                                const C = k + E * M;
                                for (let N = 0; N <= y.xSegCount; N++) {
                                    const A = x + N * T
                                      , $ = E * (y.xSegCount + 1) + N;
                                    y.attributes.position.values[3 * $ + "xyz".indexOf(b[0])] = A,
                                    y.attributes.position.values[3 * $ + "xyz".indexOf(b[1])] = -C
                                }
                            }
                            y.attributes.position.update(),
                            h.debug("Geometry.setSize", {
                                position: y.attributes.position
                            })
                        }
                    }
                },
                Mesh: {
                    enumerable: !1,
                    value: class {
                        constructor(_, v) {
                            const b = this;
                            b.geometry = _,
                            b.material = v,
                            b.wireframe = !1,
                            b.attributeInstances = [],
                            Object.entries(b.geometry.attributes).forEach( ([y,x]) => {
                                b.attributeInstances.push({
                                    attribute: x,
                                    location: x.attach(y, b.material.program)
                                })
                            }
                            ),
                            h.meshes.push(b),
                            h.debug("Mesh.constructor", {
                                mesh: b
                            })
                        }
                        draw() {
                            f.useProgram(this.material.program),
                            this.material.uniformInstances.forEach( ({uniform: _, location: v}) => _.update(v)),
                            this.attributeInstances.forEach( ({attribute: _, location: v}) => _.use(v)),
                            f.drawElements(this.wireframe ? f.LINES : f.TRIANGLES, this.geometry.attributes.index.values.length, f.UNSIGNED_SHORT, 0)
                        }
                        remove() {
                            h.meshes = h.meshes.filter(_ => _ != this)
                        }
                    }
                },
                Attribute: {
                    enumerable: !1,
                    value: class {
                        constructor(_) {
                            this.type = f.FLOAT,
                            this.normalized = !1,
                            this.buffer = f.createBuffer(),
                            Object.assign(this, _),
                            this.update()
                        }
                        update() {
                            this.values !== void 0 && (f.bindBuffer(this.target, this.buffer),
                            f.bufferData(this.target, this.values, f.STATIC_DRAW))
                        }
                        attach(_, v) {
                            const b = f.getAttribLocation(v, _);
                            return this.target === f.ARRAY_BUFFER && (f.enableVertexAttribArray(b),
                            f.vertexAttribPointer(b, this.size, this.type, this.normalized, 0, 0)),
                            b
                        }
                        use(_) {
                            f.bindBuffer(this.target, this.buffer),
                            this.target === f.ARRAY_BUFFER && (f.enableVertexAttribArray(_),
                            f.vertexAttribPointer(_, this.size, this.type, this.normalized, 0, 0))
                        }
                    }
                }
            });
            const w = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
            h.commonUniforms = {
                projectionMatrix: new h.Uniform({
                    type: "mat4",
                    value: w
                }),
                modelViewMatrix: new h.Uniform({
                    type: "mat4",
                    value: w
                }),
                resolution: new h.Uniform({
                    type: "vec2",
                    value: [1, 1]
                }),
                aspectRatio: new h.Uniform({
                    type: "float",
                    value: 1
                })
            }
        }
        setSize(c=640, u=480) {
            this.width = c,
            this.height = u,
            this.canvas.width = c,
            this.canvas.height = u,
            this.gl.viewport(0, 0, c, u),
            this.commonUniforms.resolution.value = [c, u],
            this.commonUniforms.aspectRatio.value = c / u,
            this.debug("MiniGL.setSize", {
                width: c,
                height: u
            })
        }
        setOrthographicCamera(c=0, u=0, p=0, d=-2e3, h=2e3) {
            this.commonUniforms.projectionMatrix.value = [2 / this.width, 0, 0, 0, 0, 2 / this.height, 0, 0, 0, 0, 2 / (d - h), 0, c, u, p, 1],
            this.debug("setOrthographicCamera", this.commonUniforms.projectionMatrix.value)
        }
        render() {
            this.gl.clearColor(0, 0, 0, 0),
            this.gl.clearDepth(1),
            this.meshes.forEach(c => c.draw())
        }
    }
    var i = t;
    function r(l) {
        return [(l >> 16 & 255) / 255, (l >> 8 & 255) / 255, (255 & l) / 255]
    }
    ["SCREEN", "LINEAR_LIGHT"].reduce( (l, c, u) => Object.assign(l, {
        [c]: u
    }), {});
    function s(l, c, u) {
        return c in l ? Object.defineProperty(l, c, {
            value: u,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : l[c] = u,
        l
    }
    class o {
        constructor(...c) {
            s(this, "el", void 0),
            s(this, "cssVarRetries", 0),
            s(this, "maxCssVarRetries", 200),
            s(this, "angle", 0),
            s(this, "isLoadedClass", !1),
            s(this, "isScrolling", !1),
            s(this, "scrollingTimeout", void 0),
            s(this, "scrollingRefreshDelay", 200),
            s(this, "isIntersecting", !1),
            s(this, "shaderFiles", void 0),
            s(this, "vertexShader", void 0),
            s(this, "sectionColors", void 0),
            s(this, "computedCanvasStyle", void 0),
            s(this, "conf", void 0),
            s(this, "uniforms", void 0),
            s(this, "t", 1253106),
            s(this, "last", 0),
            s(this, "width", void 0),
            s(this, "minWidth", 1111),
            s(this, "height", 600),
            s(this, "xSegCount", void 0),
            s(this, "ySegCount", void 0),
            s(this, "mesh", void 0),
            s(this, "material", void 0),
            s(this, "geometry", void 0),
            s(this, "minigl", void 0),
            s(this, "scrollObserver", void 0),
            s(this, "amp", 320),
            s(this, "seed", 5),
            s(this, "freqX", 14e-5),
            s(this, "freqY", 29e-5),
            s(this, "freqDelta", 1e-5),
            s(this, "activeColors", [1, 1, 1, 1]),
            s(this, "isMetaKey", !1),
            s(this, "isGradientLegendVisible", !1),
            s(this, "isMouseDown", !1),
            s(this, "handleScroll", () => {
                clearTimeout(this.scrollingTimeout),
                this.scrollingTimeout = setTimeout(this.handleScrollEnd, this.scrollingRefreshDelay),
                this.isGradientLegendVisible && this.hideGradientLegend(),
                this.conf.playing && (this.isScrolling = !0,
                this.paussetInitialProperty())
            }
            ),
            s(this, "handleScrollEnd", () => {
                this.isScrolling = !1,
                this.isIntersecting && this.play()
            }
            ),
            s(this, "resize", () => {
                this.width = window.innerWidth,
                this.minigl.setSize(this.width, this.height),
                this.minigl.setOrthographicCamera(),
                this.xSegCount = Math.ceil(this.width * this.conf.density[0]),
                this.ySegCount = Math.ceil(this.height * this.conf.density[1]),
                this.mesh.geometry.setTopology(this.xSegCount, this.ySegCount),
                this.mesh.geometry.setSize(this.width, this.height),
                this.mesh.material.uniforms.u_shadow_power.value = this.width < 600 ? 5 : 6
            }
            ),
            s(this, "handleMouseDown", u => {
                this.isGradientLegendVisible && (this.isMetaKey = u.metaKey,
                this.isMouseDown = !0,
                this.conf.playing === !1 && requestAnimationFrame(this.animate))
            }
            ),
            s(this, "handleMouseUp", () => {
                this.isMouseDown = !1
            }
            ),
            s(this, "animate", u => {
                if (!this.shouldSkipFrame(u) || this.isMouseDown) {
                    if (this.t += Math.min(u - this.last, 1e3 / 15),
                    this.last = u,
                    this.isMouseDown) {
                        let p = 160;
                        this.isMetaKey && (p = -160),
                        this.t += p
                    }
                    this.mesh.material.uniforms.u_time.value = this.t,
                    this.minigl.render()
                }
                if (this.last !== 0 && this.isStatic)
                    return this.minigl.render(),
                    void this.disconnect();
                (this.conf.playing || this.isMouseDown) && requestAnimationFrame(this.animate)
            }
            ),
            s(this, "addIsLoadedClass", () => {
                !this.isLoadedClass && (this.isLoadedClass = !0,
                this.el.classList.add("isLoaded"),
                setTimeout( () => {
                    this.el.parentElement.classList.add("isLoaded")
                }
                , 3e3))
            }
            ),
            s(this, "pause", () => {
                this.conf.playing = !1
            }
            ),
            s(this, "play", () => {
                requestAnimationFrame(this.animate),
                this.conf.playing = !0
            }
            ),
            s(this, "initGradient", u => (this.el = document.querySelector(u),
            this.connect(),
            this))
        }
        async connect() {
            this.shaderFiles = {
                vertex: `varying vec3 v_color;

void main() {
  float time = u_time * u_global.noiseSpeed;

  vec2 noiseCoord = resolution * uvNorm * u_global.noiseFreq;

  vec2 st = 1. - uvNorm.xy;

  //
  // Tilting the plane
  //

  // Front-to-back tilt
  float tilt = resolution.y / 2.0 * uvNorm.y;

  // Left-to-right angle
  float incline = resolution.x * uvNorm.x / 2.0 * u_vertDeform.incline;

  // Up-down shift to offset incline
  float offset = resolution.x / 2.0 * u_vertDeform.incline * mix(u_vertDeform.offsetBottom, u_vertDeform.offsetTop, uv.y);

  //
  // Vertex noise
  //

  float noise = snoise(vec3(
    noiseCoord.x * u_vertDeform.noiseFreq.x + time * u_vertDeform.noiseFlow,
    noiseCoord.y * u_vertDeform.noiseFreq.y,
    time * u_vertDeform.noiseSpeed + u_vertDeform.noiseSeed
  )) * u_vertDeform.noiseAmp;

  // Fade noise to zero at edges
  noise *= 1.0 - pow(abs(uvNorm.y), 2.0);

  // Clamp to 0
  noise = max(0.0, noise);

  vec3 pos = vec3(
    position.x,
    position.y + tilt + incline + noise - offset,
    position.z
  );

  //
  // Vertex color, to be passed to fragment shader
  //

  if (u_active_colors[0] == 1.) {
    v_color = u_baseColor;
  }

  for (int i = 0; i < u_waveLayers_length; i++) {
    if (u_active_colors[i + 1] == 1.) {
      WaveLayers layer = u_waveLayers[i];

      float noise = smoothstep(
        layer.noiseFloor,
        layer.noiseCeil,
        snoise(vec3(
          noiseCoord.x * layer.noiseFreq.x + time * layer.noiseFlow,
          noiseCoord.y * layer.noiseFreq.y,
          time * layer.noiseSpeed + layer.noiseSeed
        )) / 2.0 + 0.5
      );

      v_color = blendNormal(v_color, layer.color, pow(noise, 4.));
    }
  }

  //
  // Finish
  //

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`,
                noise: `//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
{
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}`,
                blend: `//
// https://github.com/jamieowen/glsl-blend
//

// Normal

vec3 blendNormal(vec3 base, vec3 blend) {
	return blend;
}

vec3 blendNormal(vec3 base, vec3 blend, float opacity) {
	return (blendNormal(base, blend) * opacity + base * (1.0 - opacity));
}

// Screen

float blendScreen(float base, float blend) {
	return 1.0-((1.0-base)*(1.0-blend));
}

vec3 blendScreen(vec3 base, vec3 blend) {
	return vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));
}

vec3 blendScreen(vec3 base, vec3 blend, float opacity) {
	return (blendScreen(base, blend) * opacity + base * (1.0 - opacity));
}

// Multiply

vec3 blendMultiply(vec3 base, vec3 blend) {
	return base*blend;
}

vec3 blendMultiply(vec3 base, vec3 blend, float opacity) {
	return (blendMultiply(base, blend) * opacity + base * (1.0 - opacity));
}

// Overlay

float blendOverlay(float base, float blend) {
	return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
}

vec3 blendOverlay(vec3 base, vec3 blend) {
	return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));
}

vec3 blendOverlay(vec3 base, vec3 blend, float opacity) {
	return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));
}

// Hard light

vec3 blendHardLight(vec3 base, vec3 blend) {
	return blendOverlay(blend,base);
}

vec3 blendHardLight(vec3 base, vec3 blend, float opacity) {
	return (blendHardLight(base, blend) * opacity + base * (1.0 - opacity));
}

// Soft light

float blendSoftLight(float base, float blend) {
	return (blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));
}

vec3 blendSoftLight(vec3 base, vec3 blend) {
	return vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));
}

vec3 blendSoftLight(vec3 base, vec3 blend, float opacity) {
	return (blendSoftLight(base, blend) * opacity + base * (1.0 - opacity));
}

// Color dodge

float blendColorDodge(float base, float blend) {
	return (blend==1.0)?blend:min(base/(1.0-blend),1.0);
}

vec3 blendColorDodge(vec3 base, vec3 blend) {
	return vec3(blendColorDodge(base.r,blend.r),blendColorDodge(base.g,blend.g),blendColorDodge(base.b,blend.b));
}

vec3 blendColorDodge(vec3 base, vec3 blend, float opacity) {
	return (blendColorDodge(base, blend) * opacity + base * (1.0 - opacity));
}

// Color burn

float blendColorBurn(float base, float blend) {
	return (blend==0.0)?blend:max((1.0-((1.0-base)/blend)),0.0);
}

vec3 blendColorBurn(vec3 base, vec3 blend) {
	return vec3(blendColorBurn(base.r,blend.r),blendColorBurn(base.g,blend.g),blendColorBurn(base.b,blend.b));
}

vec3 blendColorBurn(vec3 base, vec3 blend, float opacity) {
	return (blendColorBurn(base, blend) * opacity + base * (1.0 - opacity));
}

// Vivid Light

float blendVividLight(float base, float blend) {
	return (blend<0.5)?blendColorBurn(base,(2.0*blend)):blendColorDodge(base,(2.0*(blend-0.5)));
}

vec3 blendVividLight(vec3 base, vec3 blend) {
	return vec3(blendVividLight(base.r,blend.r),blendVividLight(base.g,blend.g),blendVividLight(base.b,blend.b));
}

vec3 blendVividLight(vec3 base, vec3 blend, float opacity) {
	return (blendVividLight(base, blend) * opacity + base * (1.0 - opacity));
}

// Lighten

float blendLighten(float base, float blend) {
	return max(blend,base);
}

vec3 blendLighten(vec3 base, vec3 blend) {
	return vec3(blendLighten(base.r,blend.r),blendLighten(base.g,blend.g),blendLighten(base.b,blend.b));
}

vec3 blendLighten(vec3 base, vec3 blend, float opacity) {
	return (blendLighten(base, blend) * opacity + base * (1.0 - opacity));
}

// Linear burn

float blendLinearBurn(float base, float blend) {
	// Note : Same implementation as BlendSubtractf
	return max(base+blend-1.0,0.0);
}

vec3 blendLinearBurn(vec3 base, vec3 blend) {
	// Note : Same implementation as BlendSubtract
	return max(base+blend-vec3(1.0),vec3(0.0));
}

vec3 blendLinearBurn(vec3 base, vec3 blend, float opacity) {
	return (blendLinearBurn(base, blend) * opacity + base * (1.0 - opacity));
}

// Linear dodge

float blendLinearDodge(float base, float blend) {
	// Note : Same implementation as BlendAddf
	return min(base+blend,1.0);
}

vec3 blendLinearDodge(vec3 base, vec3 blend) {
	// Note : Same implementation as BlendAdd
	return min(base+blend,vec3(1.0));
}

vec3 blendLinearDodge(vec3 base, vec3 blend, float opacity) {
	return (blendLinearDodge(base, blend) * opacity + base * (1.0 - opacity));
}

// Linear light

float blendLinearLight(float base, float blend) {
	return blend<0.5?blendLinearBurn(base,(2.0*blend)):blendLinearDodge(base,(2.0*(blend-0.5)));
}

vec3 blendLinearLight(vec3 base, vec3 blend) {
	return vec3(blendLinearLight(base.r,blend.r),blendLinearLight(base.g,blend.g),blendLinearLight(base.b,blend.b));
}

vec3 blendLinearLight(vec3 base, vec3 blend, float opacity) {
	return (blendLinearLight(base, blend) * opacity + base * (1.0 - opacity));
}`,
                fragment: `varying vec3 v_color;

void main() {
  vec3 color = v_color;
  if (u_darken_top == 1.0) {
    vec2 st = gl_FragCoord.xy/resolution.xy;
    color.g -= pow(st.y + sin(-12.0) * st.x, u_shadow_power) * 0.4;
  }
  gl_FragColor = vec4(color, 1.0);
}`
            },
            this.conf = {
                presetName: "",
                wireframe: !1,
                density: [.06, .16],
                zoom: 1,
                rotation: 0,
                playing: !0
            },
            document.querySelectorAll("canvas").length < 1 ? console.log("DID NOT LOAD HERO STRIPE CANVAS") : (this.minigl = new i(this.el,null,null,!0),
            requestAnimationFrame( () => {
                this.el && (this.computedCanvasStyle = getComputedStyle(this.el),
                this.waitForCssVars())
            }
            ))
        }
        disconnect() {
            this.scrollObserver && (window.removeEventListener("scroll", this.handleScroll),
            window.removeEventListener("mousedown", this.handleMouseDown),
            window.removeEventListener("mouseup", this.handleMouseUp),
            window.removeEventListener("keydown", this.handleKeyDown),
            this.scrollObserver.disconnect()),
            window.removeEventListener("resize", this.resize)
        }
        initMaterial() {
            this.uniforms = {
                u_time: new this.minigl.Uniform({
                    value: 0
                }),
                u_shadow_power: new this.minigl.Uniform({
                    value: 5
                }),
                u_darken_top: new this.minigl.Uniform({
                    value: this.el.dataset.jsDarkenTop === "" ? 1 : 0
                }),
                u_active_colors: new this.minigl.Uniform({
                    value: this.activeColors,
                    type: "vec4"
                }),
                u_global: new this.minigl.Uniform({
                    value: {
                        noiseFreq: new this.minigl.Uniform({
                            value: [this.freqX, this.freqY],
                            type: "vec2"
                        }),
                        noiseSpeed: new this.minigl.Uniform({
                            value: 5e-6
                        })
                    },
                    type: "struct"
                }),
                u_vertDeform: new this.minigl.Uniform({
                    value: {
                        incline: new this.minigl.Uniform({
                            value: Math.sin(this.angle) / Math.cos(this.angle)
                        }),
                        offsetTop: new this.minigl.Uniform({
                            value: -.5
                        }),
                        offsetBottom: new this.minigl.Uniform({
                            value: -.5
                        }),
                        noiseFreq: new this.minigl.Uniform({
                            value: [3, 4],
                            type: "vec2"
                        }),
                        noiseAmp: new this.minigl.Uniform({
                            value: this.amp
                        }),
                        noiseSpeed: new this.minigl.Uniform({
                            value: 10
                        }),
                        noiseFlow: new this.minigl.Uniform({
                            value: 3
                        }),
                        noiseSeed: new this.minigl.Uniform({
                            value: this.seed
                        })
                    },
                    type: "struct",
                    excludeFrom: "fragment"
                }),
                u_baseColor: new this.minigl.Uniform({
                    value: this.sectionColors[0],
                    type: "vec3",
                    excludeFrom: "fragment"
                }),
                u_waveLayers: new this.minigl.Uniform({
                    value: [],
                    excludeFrom: "fragment",
                    type: "array"
                })
            };
            for (let c = 1; c < this.sectionColors.length; c += 1)
                this.uniforms.u_waveLayers.value.push(new this.minigl.Uniform({
                    value: {
                        color: new this.minigl.Uniform({
                            value: this.sectionColors[c],
                            type: "vec3"
                        }),
                        noiseFreq: new this.minigl.Uniform({
                            value: [2 + c / this.sectionColors.length, 3 + c / this.sectionColors.length],
                            type: "vec2"
                        }),
                        noiseSpeed: new this.minigl.Uniform({
                            value: 11 + .3 * c
                        }),
                        noiseFlow: new this.minigl.Uniform({
                            value: 6.5 + .3 * c
                        }),
                        noiseSeed: new this.minigl.Uniform({
                            value: this.seed + 10 * c
                        }),
                        noiseFloor: new this.minigl.Uniform({
                            value: .1
                        }),
                        noiseCeil: new this.minigl.Uniform({
                            value: .63 + .07 * c
                        })
                    },
                    type: "struct"
                }));
            return this.vertexShader = [this.shaderFiles.noise, this.shaderFiles.blend, this.shaderFiles.vertex].join(`

`),
            new this.minigl.Material(this.vertexShader,this.shaderFiles.fragment,this.uniforms)
        }
        initMesh() {
            this.material = this.initMaterial(),
            this.geometry = new this.minigl.PlaneGeometry,
            this.mesh = new this.minigl.Mesh(this.geometry,this.material)
        }
        shouldSkipFrame(c) {
            return !!window.document.hidden || !this.conf.playing || parseInt(c, 10) % 2 == 0 || void 0
        }
        updateFrequency(c) {
            this.freqX += c,
            this.freqY += c
        }
        toggleColor(c) {
            this.activeColors[c] = this.activeColors[c] === 0 ? 1 : 0
        }
        showGradientLegend() {
            this.width > this.minWidth && (this.isGradientLegendVisible = !0,
            document.body.classList.add("isGradientLegendVisible"))
        }
        hideGradientLegend() {
            this.isGradientLegendVisible = !1,
            document.body.classList.remove("isGradientLegendVisible")
        }
        init() {
            this.initGradientColors(),
            this.initMesh(),
            this.resize(),
            requestAnimationFrame(this.animate),
            window.addEventListener("resize", this.resize)
        }
        waitForCssVars() {
            if (this.computedCanvasStyle && this.computedCanvasStyle.getPropertyValue("--gradient-color-1").indexOf("#") !== -1)
                this.init(),
                this.addIsLoadedClass();
            else {
                if (this.cssVarRetries += 1,
                this.cssVarRetries > this.maxCssVarRetries)
                    return this.sectionColors = [16711680, 16711680, 16711935, 65280, 255],
                    void this.init();
                requestAnimationFrame( () => this.waitForCssVars())
            }
        }
        initGradientColors() {
            this.sectionColors = ["--gradient-color-1", "--gradient-color-2", "--gradient-color-3", "--gradient-color-4"].map(c => {
                let u = this.computedCanvasStyle.getPropertyValue(c).trim();
                return u.length === 4 && (u = `#${u.substr(1).split("").map(d => d + d).join("")}`),
                u && `0x${u.substr(1)}`
            }
            ).filter(Boolean).map(r)
        }
    }
    var a = o
}
)(Ah);
var cm = Ah.exports;
const Ni = "header"
  , Mh = ".pp"
  , Oh = ".pp__circle"
  , Lh = ".pp__circle-stroke"
  , Ca = ".pp__circle-image"
  , Ea = ".overlay-container"
  , Xr = ".overlay-transition"
  , Dh = ".overlay-transition__next-page"
  , ao = ".overlay-transition__next-page-inner .split-inner"
  , um = ".overlay-transition__round-container"
  , cc = ".overlay-transition__round-container--top"
  , uc = ".overlay-transition__round-container--bottom"
  , Ze = "Expo.easeOut"
  , pe = .8;
F.config({
    force3D: !0
});
function qo(n) {
    F.to(Ni, {
        y: n == 1 ? "-100%" : 0,
        ease: n == 1 ? "Expo.easeIn" : "Expo.easeOut",
        duration: pe
    })
}
F.registerPlugin(Y);
F.config({
    force3D: !0
});
window.matchMedia("(max-width: 1200px), (orientation: portrait)");
function Rh() {
    mm(),
    gm(),
    ym(),
    dm(),
    vm(),
    bm(),
    fm(),
    hm(),
    pm(),
    F.to(".footer__middle-border", {
        width: "100%",
        height: "100%",
        opacity: 1,
        borderRadius: "3rem",
        scrollTrigger: {
            start: "top 60%",
            end: "bottom bottom",
            trigger: "footer",
            scrub: !0
        }
    })
}
const Nh = new cm.Gradient;
let Cr = !0
  , Bo = !1;
const qn = new Uh({
    smooth: !0,
    lerp: .1,
    wheelMultiplier: .9,
    smooth: !0
});
window.lenis = qn;
qn.on("scroll", n => {
    const e = n.targetScroll
      , t = document.documentElement.scrollHeight
      , i = window.innerHeight;
    Y.update,
    Bo || (requestAnimationFrame( () => {
        n.direction == 1 ? (Cr && (qo(1),
        Cr = !1),
        (e <= 10 || e + i >= t - 10) && (qo(-1),
        Cr = !0)) : n.direction == -1 && !Cr && (qo(-1),
        Cr = !0),
        Bo = !1
    }
    ),
    Bo = !0)
}
);
F.ticker.add(n => {
    qn.raf(n * 1e3)
}
);
F.ticker.lagSmoothing(0);
const hc = getComputedStyle(document.documentElement).getPropertyValue("--background-color");
getComputedStyle(document.documentElement).getPropertyValue("--foreground-color");
document.querySelectorAll(".btn");
const Ht = new np(".pointer__circle--small",{
    default: {
        size: "0.375rem"
    },
    hover: {
        size: "0"
    }
},".pointer__circle--big",{
    default: {
        size: "2rem",
        bgColor: "rgba(" + hc + ",0)",
        bgBlur: "blur(0px)",
        opacity: .2
    },
    hover: {
        size: "6rem",
        bgColor: "rgba(" + hc + ",0.4)",
        bgBlur: "blur(4px)",
        outlineOffset: "0.25rem"
    }
},".pointer__circle-text");
function hm() {
    const n = document.querySelectorAll(".divider__line:not(.hero .divider__line)");
    n.length && n.forEach(e => {
        F.to(e, {
            scaleX: 1,
            duration: 1,
            ease: "Expo.easeInOut",
            scrollTrigger: {
                start: "center bottom",
                trigger: e
            }
        })
    }
    )
}
function dm() {
    document.querySelectorAll(".work video[autoplay]").forEach(i => {
        setTimeout( () => {
            i.play().catch(r => {
                console.log("Autoplay was prevented for a video:", r)
            }
            )
        }
        , 100)
    }
    );
    function e(i, r) {
        const s = document.querySelectorAll(i);
        s.length && s.forEach(o => {
            F.to(o, {
                x: r,
                ease: "none",
                scrollTrigger: {
                    trigger: o,
                    scrub: 1
                }
            })
        }
        )
    }
    e(".work:not(.is-title) .work__categories-row:nth-of-type(1) .work__categories-inner, .work__categories-row:nth-of-type(3) .work__categories-inner", "-10vw"),
    e(".work:not(.is-title) .work__categories-row:nth-of-type(2) .work__categories-inner, .work__categories-row:nth-of-type(4) .work__categories-inner", "+10vw");
    const t = document.querySelectorAll(".work:not(.is-title) .work__categories-row");
    t.forEach(i => {
        const r = i.querySelector("video");
        i.addEventListener("mouseenter", () => {
            t.forEach(s => {
                F.to(r, {
                    display: "block",
                    scale: 1,
                    opacity: 1,
                    duration: .3
                }),
                s !== i && F.to(s, {
                    opacity: .2,
                    duration: .3
                })
            }
            ),
            r && r.play()
        }
        ),
        i.addEventListener("mouseleave", () => {
            F.to(r, {
                display: "none",
                scale: .8,
                opacity: 0,
                duration: .3
            }),
            t.forEach(s => {
                F.to(s, {
                    opacity: 1,
                    duration: .3
                })
            }
            ),
            r && (r.pause(),
            setTimeout( () => {
                r.currentTime = 0
            }
            , 300))
        }
        )
    }
    )
}
function fm() {
    const n = document.querySelector(".header__logo-link");
    function e(t) {
        const i = n.querySelector(".header__logo-link-inner:nth-of-type(1)")
          , r = n.querySelector(".header__logo-link-inner:nth-of-type(2)")
          , s = n.querySelector(".header__logo-link-inner:nth-of-type(3)")
          , o = t === "in"
          , a = F.timeline();
        a.isActive() || a.fromTo([i, r, s], {
            yPercent: o ? 0 : -100
        }, {
            yPercent: o ? -100 : -200,
            duration: .8,
            ease: "Expo.easeOut"
        }).set([i, r, s], {
            yPercent: o ? -100 : 0
        })
    }
    n.addEventListener("mouseenter", () => e("in")),
    n.addEventListener("mouseleave", () => {
        n.matches(":focus") || e("out")
    }
    )
}
function pm() {
    function n(e, t) {
        const i = document.querySelectorAll(e);
        i.length && i.forEach(r => {
            const s = r.querySelectorAll(".split-inner");
            F.to(s, {
                y: 0,
                ...t,
                scrollTrigger: {
                    trigger: r,
                    start: "top 90%"
                }
            })
        }
        )
    }
    n("[data-anim='from-bottom']:has(.char)", {
        duration: .8,
        stagger: .005,
        ease: "Expo.easeOut"
    }),
    n("[data-anim='from-bottom']:has(.word)", {
        duration: .8,
        stagger: .005,
        ease: "Expo.easeOut"
    }),
    n("[data-anim='from-bottom']:has(.line)", {
        duration: .8,
        stagger: .1,
        ease: "Expo.easeOut"
    })
}
function mm() {
    document.querySelectorAll("[data-split]").forEach(e => {
        let t, i;
        switch (e.getAttribute("data-split")) {
        case "lines":
            t = {
                types: "lines",
                lineClass: "split-wrap line",
                tagName: "span"
            },
            i = {
                types: "lines",
                lineClass: "split-inner",
                tagName: "span"
            };
            break;
        case "words":
            t = {
                types: "words",
                wordClass: "split-wrap word",
                tagName: "span"
            },
            i = {
                types: "words",
                wordClass: "split-inner",
                tagName: "span"
            };
            break;
        case "chars":
            t = {
                types: "chars",
                charClass: "split-wrap char",
                tagName: "span"
            },
            i = {
                types: "chars",
                charClass: "split-inner",
                tagName: "span"
            };
            break;
        case "words chars":
            t = {
                types: "words, chars",
                charClass: "split-wrap",
                tagName: "span"
            },
            i = {
                types: "words, chars",
                charClass: "split-inner",
                tagName: "span"
            };
            break;
        case "lines chars":
            t = {
                types: "lines, chars",
                charClass: "split-wrap",
                tagName: "span"
            },
            i = {
                types: "lines, chars",
                charClass: "split-inner",
                tagName: "span"
            };
            break;
        default:
            t = {},
            i = {};
            break
        }
        new va(e,t),
        e.querySelectorAll(".split-wrap").forEach(o => {
            va.create(o, i)
        }
        )
    }
    )
}
function gm() {
    document.querySelector("footer");
    const n = document.querySelector(".footer__middle-email")
      , e = document.querySelectorAll("a, button");
    function t(a) {
        const l = a.target.dataset.pointer;
        l ? (Ht.changePointerText(l),
        Ht.adjustPointer(!0, !0)) : Ht.adjustPointer(!0, !1)
    }
    function i(a) {
        a.target.dataset.pointer ? Ht.adjustPointer(!1, !0) : Ht.adjustPointer(!1, !1)
    }
    function r(a) {
        Ht.copyTargetText(),
        Ht.changePointerText("Copied"),
        Ht.adjustPointer(!0, !0)
    }
    function s() {
        Ht.adjustPointer(!1, !1, !0)
    }
    function o() {
        Ht.adjustPointer(!1, !1)
    }
    document.addEventListener("mousemove", Ht.movePointer.bind(Ht)),
    document.addEventListener("mouseleave", s),
    document.addEventListener("mouseenter", o),
    e.length > 0 && e.forEach(a => {
        a.addEventListener("mouseenter", t),
        a.addEventListener("mouseleave", i)
    }
    ),
    n && (n.addEventListener("mouseenter", t),
    n.addEventListener("mouseleave", i),
    n.addEventListener("click", r))
}
function ym() {
    const n = document.querySelectorAll("[data-magnetic]");
    if (window.innerWidth < 540)
        return;
    function e(t) {
        const i = t.currentTarget
          , r = i.getBoundingClientRect()
          , s = parseInt(i.getAttribute("data-magnetic")) || 25;
        F.to(i, {
            x: ((t.clientX - r.left) / i.offsetWidth - .5) * s,
            y: ((t.clientY - r.top) / i.offsetHeight - .5) * s,
            ease: "Expo.easeOut",
            duration: .8
        })
    }
    n.forEach(t => {
        t.addEventListener("mousemove", e),
        t.addEventListener("mouseout", function(i) {
            F.to(i.currentTarget, {
                x: 0,
                y: 0,
                ease: "Elastic.easeOut",
                duration: .8
            })
        })
    }
    )
}
function vm() {
    const n = document.querySelectorAll(".btn");
    if (F.timeline(),
    !n.length)
        return;
    function e(t, i) {
        const r = t.currentTarget.querySelector(".btn__circle")
          , s = t.currentTarget.querySelector(".btn__circle__arrow")
          , o = t.currentTarget.querySelector(".btn__text-inner:nth-of-type(1)")
          , a = t.currentTarget.querySelector(".btn__text-inner:nth-of-type(2)")
          , l = t.currentTarget.querySelector(".btn__text-inner:nth-of-type(3)")
          , c = i === "in"
          , u = F.timeline();
        u.isActive() || u.fromTo(s, {
            x: c ? "-300%" : "0%",
            y: c ? "300%" : "0%"
        }, {
            x: c ? "0%" : "300%",
            y: c ? "0%" : "-300%",
            duration: .6,
            ease: "Expo.easeOut"
        }).to(r, {
            scale: c ? 1 : .3,
            duration: .6,
            ease: "Expo.easeOut"
        }, "<").set([o, a, l], {
            yPercent: c ? 0 : -100
        }, "<").to([o, a, l], {
            yPercent: c ? -100 : -200,
            duration: .6,
            ease: "Expo.easeOut"
        }, "<")
    }
    n.forEach(t => {
        const i = t.querySelectorAll(".btn__text-inner")
          , r = t.querySelectorAll(".btn__circle");
        F.timeline({
            scrollTrigger: {
                trigger: t,
                start: "center 90%"
            }
        }).to(r, {
            scale: .3,
            duration: .6,
            ease: "Expo.easeOut"
        }).to(i, {
            y: 0,
            duration: .6,
            ease: "Expo.easeOut"
        }, "<"),
        t.addEventListener("mouseenter", s => e(s, "in")),
        t.addEventListener("mouseleave", s => {
            t.matches(":focus") || e(s, "out")
        }
        )
    }
    )
}
function bm() {
    const n = document.querySelectorAll(".header__menu-link");
    if (!n.length)
        return;
    function e(t, i) {
        const r = t.currentTarget.querySelector(".header__menu-link-content span:nth-of-type(1)")
          , s = t.currentTarget.querySelector(".header__menu-link-content span:nth-of-type(2)")
          , o = t.currentTarget.querySelector(".header__menu-link-content span:nth-of-type(3)")
          , a = i === "in"
          , l = F.timeline();
        l.isActive() || l.set([r, s, o], {
            yPercent: a ? 0 : -100
        }).to([r, s, o], {
            yPercent: a ? -100 : -200,
            duration: .8,
            ease: "Expo.easeOut"
        })
    }
    n.forEach(t => {
        t.addEventListener("mouseenter", i => e(i, "in")),
        t.addEventListener("mouseleave", i => {
            t.matches(":focus") || e(i, "out")
        }
        )
    }
    )
}
function _m(n, e) {
    for (var t = 0; t < e.length; t++) {
        var i = e[t];
        i.enumerable = i.enumerable || !1,
        i.configurable = !0,
        "value"in i && (i.writable = !0),
        Object.defineProperty(n, typeof (r = function(s, o) {
            if (typeof s != "object" || s === null)
                return s;
            var a = s[Symbol.toPrimitive];
            if (a !== void 0) {
                var l = a.call(s, "string");
                if (typeof l != "object")
                    return l;
                throw new TypeError("@@toPrimitive must return a primitive value.")
            }
            return String(s)
        }(i.key)) == "symbol" ? r : String(r), i)
    }
    var r
}
function dl(n, e, t) {
    return e && _m(n.prototype, e),
    Object.defineProperty(n, "prototype", {
        writable: !1
    }),
    n
}
function vi() {
    return vi = Object.assign ? Object.assign.bind() : function(n) {
        for (var e = 1; e < arguments.length; e++) {
            var t = arguments[e];
            for (var i in t)
                Object.prototype.hasOwnProperty.call(t, i) && (n[i] = t[i])
        }
        return n
    }
    ,
    vi.apply(this, arguments)
}
function vo(n, e) {
    n.prototype = Object.create(e.prototype),
    n.prototype.constructor = n,
    ls(n, e)
}
function Pa(n) {
    return Pa = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(e) {
        return e.__proto__ || Object.getPrototypeOf(e)
    }
    ,
    Pa(n)
}
function ls(n, e) {
    return ls = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t, i) {
        return t.__proto__ = i,
        t
    }
    ,
    ls(n, e)
}
function wm() {
    if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham)
        return !1;
    if (typeof Proxy == "function")
        return !0;
    try {
        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})),
        !0
    } catch {
        return !1
    }
}
function Aa(n, e, t) {
    return Aa = wm() ? Reflect.construct.bind() : function(i, r, s) {
        var o = [null];
        o.push.apply(o, r);
        var a = new (Function.bind.apply(i, o));
        return s && ls(a, s.prototype),
        a
    }
    ,
    Aa.apply(null, arguments)
}
function Ma(n) {
    var e = typeof Map == "function" ? new Map : void 0;
    return Ma = function(t) {
        if (t === null || Function.toString.call(t).indexOf("[native code]") === -1)
            return t;
        if (typeof t != "function")
            throw new TypeError("Super expression must either be null or a function");
        if (e !== void 0) {
            if (e.has(t))
                return e.get(t);
            e.set(t, i)
        }
        function i() {
            return Aa(t, arguments, Pa(this).constructor)
        }
        return i.prototype = Object.create(t.prototype, {
            constructor: {
                value: i,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }),
        ls(i, t)
    }
    ,
    Ma(n)
}
function xm(n) {
    if (n === void 0)
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return n
}
var Wi, Tm = function() {
    this.before = void 0,
    this.beforeLeave = void 0,
    this.leave = void 0,
    this.afterLeave = void 0,
    this.beforeEnter = void 0,
    this.enter = void 0,
    this.afterEnter = void 0,
    this.after = void 0
};
(function(n) {
    n[n.off = 0] = "off",
    n[n.error = 1] = "error",
    n[n.warning = 2] = "warning",
    n[n.info = 3] = "info",
    n[n.debug = 4] = "debug"
}
)(Wi || (Wi = {}));
var dc = Wi.off
  , Sn = function() {
    function n(t) {
        this.t = void 0,
        this.t = t
    }
    n.getLevel = function() {
        return dc
    }
    ,
    n.setLevel = function(t) {
        return dc = Wi[t]
    }
    ;
    var e = n.prototype;
    return e.error = function() {
        this.i(console.error, Wi.error, [].slice.call(arguments))
    }
    ,
    e.warn = function() {
        this.i(console.warn, Wi.warning, [].slice.call(arguments))
    }
    ,
    e.info = function() {
        this.i(console.info, Wi.info, [].slice.call(arguments))
    }
    ,
    e.debug = function() {
        this.i(console.log, Wi.debug, [].slice.call(arguments))
    }
    ,
    e.i = function(t, i, r) {
        i <= n.getLevel() && t.apply(console, ["[" + this.t + "] "].concat(r))
    }
    ,
    n
}();
function Gn(n) {
    return n.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1")
}
function fc(n) {
    return n && n.sensitive ? "" : "i"
}
var wi = {
    container: "container",
    history: "history",
    namespace: "namespace",
    prefix: "data-barba",
    prevent: "prevent",
    wrapper: "wrapper"
}
  , kn = new (function() {
    function n() {
        this.o = wi,
        this.u = void 0,
        this.h = {
            after: null,
            before: null,
            parent: null
        }
    }
    var e = n.prototype;
    return e.toString = function(t) {
        return t.outerHTML
    }
    ,
    e.toDocument = function(t) {
        return this.u || (this.u = new DOMParser),
        this.u.parseFromString(t, "text/html")
    }
    ,
    e.toElement = function(t) {
        var i = document.createElement("div");
        return i.innerHTML = t,
        i
    }
    ,
    e.getHtml = function(t) {
        return t === void 0 && (t = document),
        this.toString(t.documentElement)
    }
    ,
    e.getWrapper = function(t) {
        return t === void 0 && (t = document),
        t.querySelector("[" + this.o.prefix + '="' + this.o.wrapper + '"]')
    }
    ,
    e.getContainer = function(t) {
        return t === void 0 && (t = document),
        t.querySelector("[" + this.o.prefix + '="' + this.o.container + '"]')
    }
    ,
    e.removeContainer = function(t) {
        document.body.contains(t) && (this.v(t),
        t.parentNode.removeChild(t))
    }
    ,
    e.addContainer = function(t, i) {
        var r = this.getContainer() || this.h.before;
        r ? this.l(t, r) : this.h.after ? this.h.after.parentNode.insertBefore(t, this.h.after) : this.h.parent ? this.h.parent.appendChild(t) : i.appendChild(t)
    }
    ,
    e.getSibling = function() {
        return this.h
    }
    ,
    e.getNamespace = function(t) {
        t === void 0 && (t = document);
        var i = t.querySelector("[" + this.o.prefix + "-" + this.o.namespace + "]");
        return i ? i.getAttribute(this.o.prefix + "-" + this.o.namespace) : null
    }
    ,
    e.getHref = function(t) {
        if (t.tagName && t.tagName.toLowerCase() === "a") {
            if (typeof t.href == "string")
                return t.href;
            var i = t.getAttribute("href") || t.getAttribute("xlink:href");
            if (i)
                return this.resolveUrl(i.baseVal || i)
        }
        return null
    }
    ,
    e.resolveUrl = function() {
        var t = [].slice.call(arguments).length;
        if (t === 0)
            throw new Error("resolveUrl requires at least one argument; got none.");
        var i = document.createElement("base");
        if (i.href = arguments[0],
        t === 1)
            return i.href;
        var r = document.getElementsByTagName("head")[0];
        r.insertBefore(i, r.firstChild);
        for (var s, o = document.createElement("a"), a = 1; a < t; a++)
            o.href = arguments[a],
            i.href = s = o.href;
        return r.removeChild(i),
        s
    }
    ,
    e.l = function(t, i) {
        i.parentNode.insertBefore(t, i.nextSibling)
    }
    ,
    e.v = function(t) {
        return this.h = {
            after: t.nextElementSibling,
            before: t.previousElementSibling,
            parent: t.parentElement
        },
        this.h
    }
    ,
    n
}())
  , Sm = function() {
    function n() {
        this.p = void 0,
        this.m = [],
        this.P = -1
    }
    var e = n.prototype;
    return e.init = function(t, i) {
        this.p = "barba";
        var r = {
            data: {},
            ns: i,
            scroll: {
                x: window.scrollX,
                y: window.scrollY
            },
            url: t
        };
        this.P = 0,
        this.m.push(r);
        var s = {
            from: this.p,
            index: this.P,
            states: [].concat(this.m)
        };
        window.history && window.history.replaceState(s, "", t)
    }
    ,
    e.change = function(t, i, r) {
        if (r && r.state) {
            var s = r.state
              , o = s.index;
            i = this.g(this.P - o),
            this.replace(s.states),
            this.P = o
        } else
            this.add(t, i);
        return i
    }
    ,
    e.add = function(t, i, r, s) {
        var o = r ?? this.R(i)
          , a = {
            data: s ?? {},
            ns: "tmp",
            scroll: {
                x: window.scrollX,
                y: window.scrollY
            },
            url: t
        };
        switch (o) {
        case "push":
            this.P = this.size,
            this.m.push(a);
            break;
        case "replace":
            this.set(this.P, a)
        }
        var l = {
            from: this.p,
            index: this.P,
            states: [].concat(this.m)
        };
        switch (o) {
        case "push":
            window.history && window.history.pushState(l, "", t);
            break;
        case "replace":
            window.history && window.history.replaceState(l, "", t)
        }
    }
    ,
    e.store = function(t, i) {
        var r = i || this.P
          , s = this.get(r);
        s.data = vi({}, s.data, t),
        this.set(r, s);
        var o = {
            from: this.p,
            index: this.P,
            states: [].concat(this.m)
        };
        window.history.replaceState(o, "")
    }
    ,
    e.update = function(t, i) {
        var r = i || this.P
          , s = vi({}, this.get(r), t);
        this.set(r, s)
    }
    ,
    e.remove = function(t) {
        t ? this.m.splice(t, 1) : this.m.pop(),
        this.P--
    }
    ,
    e.clear = function() {
        this.m = [],
        this.P = -1
    }
    ,
    e.replace = function(t) {
        this.m = t
    }
    ,
    e.get = function(t) {
        return this.m[t]
    }
    ,
    e.set = function(t, i) {
        return this.m[t] = i
    }
    ,
    e.R = function(t) {
        var i = "push"
          , r = t
          , s = wi.prefix + "-" + wi.history;
        return r.hasAttribute && r.hasAttribute(s) && (i = r.getAttribute(s)),
        i
    }
    ,
    e.g = function(t) {
        return Math.abs(t) > 1 ? t > 0 ? "forward" : "back" : t === 0 ? "popstate" : t > 0 ? "back" : "forward"
    }
    ,
    dl(n, [{
        key: "current",
        get: function() {
            return this.m[this.P]
        }
    }, {
        key: "previous",
        get: function() {
            return this.P < 1 ? null : this.m[this.P - 1]
        }
    }, {
        key: "size",
        get: function() {
            return this.m.length
        }
    }]),
    n
}()
  , Ih = new Sm
  , lo = function(n, e) {
    try {
        var t = function() {
            if (!e.next.html)
                return Promise.resolve(n).then(function(i) {
                    var r = e.next;
                    if (i) {
                        var s = kn.toElement(i.html);
                        r.namespace = kn.getNamespace(s),
                        r.container = kn.getContainer(s),
                        r.url = i.url,
                        r.html = i.html,
                        Ih.update({
                            ns: r.namespace
                        });
                        var o = kn.toDocument(i.html);
                        document.title = o.title
                    }
                })
        }();
        return Promise.resolve(t && t.then ? t.then(function() {}) : void 0)
    } catch (i) {
        return Promise.reject(i)
    }
}
  , $h = function n(e, t, i) {
    return e instanceof RegExp ? function(r, s) {
        if (!s)
            return r;
        for (var o = /\((?:\?<(.*?)>)?(?!\?)/g, a = 0, l = o.exec(r.source); l; )
            s.push({
                name: l[1] || a++,
                prefix: "",
                suffix: "",
                modifier: "",
                pattern: ""
            }),
            l = o.exec(r.source);
        return r
    }(e, t) : Array.isArray(e) ? function(r, s, o) {
        var a = r.map(function(l) {
            return n(l, s, o).source
        });
        return new RegExp("(?:".concat(a.join("|"), ")"),fc(o))
    }(e, t, i) : function(r, s, o) {
        return function(a, l, c) {
            c === void 0 && (c = {});
            for (var u = c.strict, p = u !== void 0 && u, d = c.start, h = d === void 0 || d, m = c.end, f = m === void 0 || m, w = c.encode, _ = w === void 0 ? function(W) {
                return W
            }
            : w, v = c.delimiter, b = v === void 0 ? "/#?" : v, y = c.endsWith, x = "[".concat(Gn(y === void 0 ? "" : y), "]|$"), k = "[".concat(Gn(b), "]"), T = h ? "^" : "", M = 0, E = a; M < E.length; M++) {
                var C = E[M];
                if (typeof C == "string")
                    T += Gn(_(C));
                else {
                    var N = Gn(_(C.prefix))
                      , A = Gn(_(C.suffix));
                    if (C.pattern)
                        if (l && l.push(C),
                        N || A)
                            if (C.modifier === "+" || C.modifier === "*") {
                                var $ = C.modifier === "*" ? "?" : "";
                                T += "(?:".concat(N, "((?:").concat(C.pattern, ")(?:").concat(A).concat(N, "(?:").concat(C.pattern, "))*)").concat(A, ")").concat($)
                            } else
                                T += "(?:".concat(N, "(").concat(C.pattern, ")").concat(A, ")").concat(C.modifier);
                        else
                            T += C.modifier === "+" || C.modifier === "*" ? "((?:".concat(C.pattern, ")").concat(C.modifier, ")") : "(".concat(C.pattern, ")").concat(C.modifier);
                    else
                        T += "(?:".concat(N).concat(A, ")").concat(C.modifier)
                }
            }
            if (f)
                p || (T += "".concat(k, "?")),
                T += c.endsWith ? "(?=".concat(x, ")") : "$";
            else {
                var L = a[a.length - 1]
                  , B = typeof L == "string" ? k.indexOf(L[L.length - 1]) > -1 : L === void 0;
                p || (T += "(?:".concat(k, "(?=").concat(x, "))?")),
                B || (T += "(?=".concat(k, "|").concat(x, ")"))
            }
            return new RegExp(T,fc(c))
        }(function(a, l) {
            l === void 0 && (l = {});
            for (var c = function(A) {
                for (var $ = [], L = 0; L < A.length; ) {
                    var B = A[L];
                    if (B !== "*" && B !== "+" && B !== "?")
                        if (B !== "\\")
                            if (B !== "{")
                                if (B !== "}")
                                    if (B !== ":")
                                        if (B !== "(")
                                            $.push({
                                                type: "CHAR",
                                                index: L,
                                                value: A[L++]
                                            });
                                        else {
                                            var W = 1
                                              , z = "";
                                            if (A[V = L + 1] === "?")
                                                throw new TypeError('Pattern cannot start with "?" at '.concat(V));
                                            for (; V < A.length; )
                                                if (A[V] !== "\\") {
                                                    if (A[V] === ")") {
                                                        if (--W == 0) {
                                                            V++;
                                                            break
                                                        }
                                                    } else if (A[V] === "(" && (W++,
                                                    A[V + 1] !== "?"))
                                                        throw new TypeError("Capturing groups are not allowed at ".concat(V));
                                                    z += A[V++]
                                                } else
                                                    z += A[V++] + A[V++];
                                            if (W)
                                                throw new TypeError("Unbalanced pattern at ".concat(L));
                                            if (!z)
                                                throw new TypeError("Missing pattern at ".concat(L));
                                            $.push({
                                                type: "PATTERN",
                                                index: L,
                                                value: z
                                            }),
                                            L = V
                                        }
                                    else {
                                        for (var Q = "", V = L + 1; V < A.length; ) {
                                            var S = A.charCodeAt(V);
                                            if (!(S >= 48 && S <= 57 || S >= 65 && S <= 90 || S >= 97 && S <= 122 || S === 95))
                                                break;
                                            Q += A[V++]
                                        }
                                        if (!Q)
                                            throw new TypeError("Missing parameter name at ".concat(L));
                                        $.push({
                                            type: "NAME",
                                            index: L,
                                            value: Q
                                        }),
                                        L = V
                                    }
                                else
                                    $.push({
                                        type: "CLOSE",
                                        index: L,
                                        value: A[L++]
                                    });
                            else
                                $.push({
                                    type: "OPEN",
                                    index: L,
                                    value: A[L++]
                                });
                        else
                            $.push({
                                type: "ESCAPED_CHAR",
                                index: L++,
                                value: A[L++]
                            });
                    else
                        $.push({
                            type: "MODIFIER",
                            index: L,
                            value: A[L++]
                        })
                }
                return $.push({
                    type: "END",
                    index: L,
                    value: ""
                }),
                $
            }(a), u = l.prefixes, p = u === void 0 ? "./" : u, d = "[^".concat(Gn(l.delimiter || "/#?"), "]+?"), h = [], m = 0, f = 0, w = "", _ = function(A) {
                if (f < c.length && c[f].type === A)
                    return c[f++].value
            }, v = function(A) {
                var $ = _(A);
                if ($ !== void 0)
                    return $;
                var L = c[f]
                  , B = L.index;
                throw new TypeError("Unexpected ".concat(L.type, " at ").concat(B, ", expected ").concat(A))
            }, b = function() {
                for (var A, $ = ""; A = _("CHAR") || _("ESCAPED_CHAR"); )
                    $ += A;
                return $
            }; f < c.length; ) {
                var y = _("CHAR")
                  , x = _("NAME")
                  , k = _("PATTERN");
                if (x || k)
                    p.indexOf(M = y || "") === -1 && (w += M,
                    M = ""),
                    w && (h.push(w),
                    w = ""),
                    h.push({
                        name: x || m++,
                        prefix: M,
                        suffix: "",
                        pattern: k || d,
                        modifier: _("MODIFIER") || ""
                    });
                else {
                    var T = y || _("ESCAPED_CHAR");
                    if (T)
                        w += T;
                    else if (w && (h.push(w),
                    w = ""),
                    _("OPEN")) {
                        var M = b()
                          , E = _("NAME") || ""
                          , C = _("PATTERN") || ""
                          , N = b();
                        v("CLOSE"),
                        h.push({
                            name: E || (C ? m++ : ""),
                            pattern: E && !C ? d : C,
                            prefix: M,
                            suffix: N,
                            modifier: _("MODIFIER") || ""
                        })
                    } else
                        v("END")
                }
            }
            return h
        }(r, o), s, o)
    }(e, t, i)
}
  , km = {
    __proto__: null,
    update: lo,
    nextTick: function() {
        return new Promise(function(n) {
            window.requestAnimationFrame(n)
        }
        )
    },
    pathToRegexp: $h
}
  , Fh = function() {
    return window.location.origin
}
  , cs = function(n) {
    return n === void 0 && (n = window.location.href),
    Yi(n).port
}
  , Yi = function(n) {
    var e, t = n.match(/:\d+/);
    if (t === null)
        /^http/.test(n) && (e = 80),
        /^https/.test(n) && (e = 443);
    else {
        var i = t[0].substring(1);
        e = parseInt(i, 10)
    }
    var r, s = n.replace(Fh(), ""), o = {}, a = s.indexOf("#");
    a >= 0 && (r = s.slice(a + 1),
    s = s.slice(0, a));
    var l = s.indexOf("?");
    return l >= 0 && (o = zh(s.slice(l + 1)),
    s = s.slice(0, l)),
    {
        hash: r,
        path: s,
        port: e,
        query: o
    }
}
  , zh = function(n) {
    return n.split("&").reduce(function(e, t) {
        var i = t.split("=");
        return e[i[0]] = i[1],
        e
    }, {})
}
  , Oa = function(n) {
    return n === void 0 && (n = window.location.href),
    n.replace(/(\/#.*|\/|#.*)$/, "")
}
  , Cm = {
    __proto__: null,
    getHref: function() {
        return window.location.href
    },
    getAbsoluteHref: function(n, e) {
        return e === void 0 && (e = document.baseURI),
        new URL(n,e).href
    },
    getOrigin: Fh,
    getPort: cs,
    getPath: function(n) {
        return n === void 0 && (n = window.location.href),
        Yi(n).path
    },
    getQuery: function(n, e) {
        return e === void 0 && (e = !1),
        e ? JSON.stringify(Yi(n).query) : Yi(n).query
    },
    getHash: function(n) {
        return Yi(n).hash
    },
    parse: Yi,
    parseQuery: zh,
    clean: Oa
};
function Em(n, e, t, i, r) {
    return e === void 0 && (e = 2e3),
    new Promise(function(s, o) {
        var a = new XMLHttpRequest;
        a.onreadystatechange = function() {
            if (a.readyState === XMLHttpRequest.DONE) {
                if (a.status === 200) {
                    var l = a.responseURL !== "" && a.responseURL !== n ? a.responseURL : n;
                    s({
                        html: a.responseText,
                        url: vi({
                            href: l
                        }, Yi(l))
                    }),
                    i.update(n, {
                        status: "fulfilled",
                        target: l
                    })
                } else if (a.status) {
                    var c = {
                        status: a.status,
                        statusText: a.statusText
                    };
                    t(n, c),
                    o(c),
                    i.update(n, {
                        status: "rejected"
                    })
                }
            }
        }
        ,
        a.ontimeout = function() {
            var l = new Error("Timeout error [" + e + "]");
            t(n, l),
            o(l),
            i.update(n, {
                status: "rejected"
            })
        }
        ,
        a.onerror = function() {
            var l = new Error("Fetch error");
            t(n, l),
            o(l),
            i.update(n, {
                status: "rejected"
            })
        }
        ,
        a.open("GET", n),
        a.timeout = e,
        a.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml"),
        a.setRequestHeader("x-barba", "yes"),
        r.all().forEach(function(l, c) {
            a.setRequestHeader(c, l)
        }),
        a.send()
    }
    )
}
function Pm(n) {
    return !!n && (typeof n == "object" || typeof n == "function") && typeof n.then == "function"
}
function tr(n, e) {
    return e === void 0 && (e = {}),
    function() {
        var t = arguments
          , i = !1
          , r = new Promise(function(s, o) {
            e.async = function() {
                return i = !0,
                function(l, c) {
                    l ? o(l) : s(c)
                }
            }
            ;
            var a = n.apply(e, [].slice.call(t));
            i || (Pm(a) ? a.then(s, o) : s(a))
        }
        );
        return r
    }
}
var Ui = new (function(n) {
    function e() {
        var i;
        return (i = n.call(this) || this).logger = new Sn("@barba/core"),
        i.all = ["ready", "page", "reset", "currentAdded", "currentRemoved", "nextAdded", "nextRemoved", "beforeOnce", "once", "afterOnce", "before", "beforeLeave", "leave", "afterLeave", "beforeEnter", "enter", "afterEnter", "after"],
        i.registered = new Map,
        i.init(),
        i
    }
    vo(e, n);
    var t = e.prototype;
    return t.init = function() {
        var i = this;
        this.registered.clear(),
        this.all.forEach(function(r) {
            i[r] || (i[r] = function(s, o) {
                i.registered.has(r) || i.registered.set(r, new Set),
                i.registered.get(r).add({
                    ctx: o || {},
                    fn: s
                })
            }
            )
        })
    }
    ,
    t.do = function(i) {
        var r = arguments
          , s = this;
        if (this.registered.has(i)) {
            var o = Promise.resolve();
            return this.registered.get(i).forEach(function(a) {
                o = o.then(function() {
                    return tr(a.fn, a.ctx).apply(void 0, [].slice.call(r, 1))
                })
            }),
            o.catch(function(a) {
                s.logger.debug("Hook error [" + i + "]"),
                s.logger.error(a)
            })
        }
        return Promise.resolve()
    }
    ,
    t.clear = function() {
        var i = this;
        this.all.forEach(function(r) {
            delete i[r]
        }),
        this.init()
    }
    ,
    t.help = function() {
        this.logger.info("Available hooks: " + this.all.join(","));
        var i = [];
        this.registered.forEach(function(r, s) {
            return i.push(s)
        }),
        this.logger.info("Registered hooks: " + i.join(","))
    }
    ,
    e
}(Tm))
  , qh = function() {
    function n(e) {
        if (this.k = void 0,
        this.O = [],
        typeof e == "boolean")
            this.k = e;
        else {
            var t = Array.isArray(e) ? e : [e];
            this.O = t.map(function(i) {
                return $h(i)
            })
        }
    }
    return n.prototype.checkHref = function(e) {
        if (typeof this.k == "boolean")
            return this.k;
        var t = Yi(e).path;
        return this.O.some(function(i) {
            return i.exec(t) !== null
        })
    }
    ,
    n
}()
  , Am = function(n) {
    function e(i) {
        var r;
        return (r = n.call(this, i) || this).T = new Map,
        r
    }
    vo(e, n);
    var t = e.prototype;
    return t.set = function(i, r, s, o, a) {
        return this.T.set(i, {
            action: s,
            request: r,
            status: o,
            target: a ?? i
        }),
        {
            action: s,
            request: r,
            status: o,
            target: a
        }
    }
    ,
    t.get = function(i) {
        return this.T.get(i)
    }
    ,
    t.getRequest = function(i) {
        return this.T.get(i).request
    }
    ,
    t.getAction = function(i) {
        return this.T.get(i).action
    }
    ,
    t.getStatus = function(i) {
        return this.T.get(i).status
    }
    ,
    t.getTarget = function(i) {
        return this.T.get(i).target
    }
    ,
    t.has = function(i) {
        return !this.checkHref(i) && this.T.has(i)
    }
    ,
    t.delete = function(i) {
        return this.T.delete(i)
    }
    ,
    t.update = function(i, r) {
        var s = vi({}, this.T.get(i), r);
        return this.T.set(i, s),
        s
    }
    ,
    e
}(qh)
  , Mm = function() {
    function n() {
        this.A = new Map
    }
    var e = n.prototype;
    return e.set = function(t, i) {
        return this.A.set(t, i),
        {
            name: i
        }
    }
    ,
    e.get = function(t) {
        return this.A.get(t)
    }
    ,
    e.all = function() {
        return this.A
    }
    ,
    e.has = function(t) {
        return this.A.has(t)
    }
    ,
    e.delete = function(t) {
        return this.A.delete(t)
    }
    ,
    e.clear = function() {
        return this.A.clear()
    }
    ,
    n
}()
  , Om = function() {
    return !window.history.pushState
}
  , Lm = function(n) {
    return !n.el || !n.href
}
  , Dm = function(n) {
    var e = n.event;
    return e.which > 1 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
}
  , Rm = function(n) {
    var e = n.el;
    return e.hasAttribute("target") && e.target === "_blank"
}
  , Nm = function(n) {
    var e = n.el;
    return e.protocol !== void 0 && window.location.protocol !== e.protocol || e.hostname !== void 0 && window.location.hostname !== e.hostname
}
  , Im = function(n) {
    var e = n.el;
    return e.port !== void 0 && cs() !== cs(e.href)
}
  , $m = function(n) {
    var e = n.el;
    return e.getAttribute && typeof e.getAttribute("download") == "string"
}
  , Fm = function(n) {
    return n.el.hasAttribute(wi.prefix + "-" + wi.prevent)
}
  , zm = function(n) {
    return !!n.el.closest("[" + wi.prefix + "-" + wi.prevent + '="all"]')
}
  , qm = function(n) {
    var e = n.href;
    return Oa(e) === Oa() && cs(e) === cs()
}
  , Bm = function(n) {
    function e(i) {
        var r;
        return (r = n.call(this, i) || this).suite = [],
        r.tests = new Map,
        r.init(),
        r
    }
    vo(e, n);
    var t = e.prototype;
    return t.init = function() {
        this.add("pushState", Om),
        this.add("exists", Lm),
        this.add("newTab", Dm),
        this.add("blank", Rm),
        this.add("corsDomain", Nm),
        this.add("corsPort", Im),
        this.add("download", $m),
        this.add("preventSelf", Fm),
        this.add("preventAll", zm),
        this.add("sameUrl", qm, !1)
    }
    ,
    t.add = function(i, r, s) {
        s === void 0 && (s = !0),
        this.tests.set(i, r),
        s && this.suite.push(i)
    }
    ,
    t.run = function(i, r, s, o) {
        return this.tests.get(i)({
            el: r,
            event: s,
            href: o
        })
    }
    ,
    t.checkLink = function(i, r, s) {
        var o = this;
        return this.suite.some(function(a) {
            return o.run(a, i, r, s)
        })
    }
    ,
    e
}(qh)
  , Ho = function(n) {
    function e(t, i) {
        var r;
        return i === void 0 && (i = "Barba error"),
        (r = n.call.apply(n, [this].concat([].slice.call(arguments, 2))) || this).error = void 0,
        r.label = void 0,
        r.error = t,
        r.label = i,
        Error.captureStackTrace && Error.captureStackTrace(xm(r), e),
        r.name = "BarbaError",
        r
    }
    return vo(e, n),
    e
}(Ma(Error))
  , Hm = function() {
    function n(t) {
        t === void 0 && (t = []),
        this.logger = new Sn("@barba/core"),
        this.all = [],
        this.page = [],
        this.once = [],
        this.j = [{
            name: "namespace",
            type: "strings"
        }, {
            name: "custom",
            type: "function"
        }],
        t && (this.all = this.all.concat(t)),
        this.update()
    }
    var e = n.prototype;
    return e.add = function(t, i) {
        t === "rule" ? this.j.splice(i.position || 0, 0, i.value) : this.all.push(i),
        this.update()
    }
    ,
    e.resolve = function(t, i) {
        var r = this;
        i === void 0 && (i = {});
        var s = i.once ? this.once : this.page;
        s = s.filter(i.self ? function(d) {
            return d.name && d.name === "self"
        }
        : function(d) {
            return !d.name || d.name !== "self"
        }
        );
        var o = new Map
          , a = s.find(function(d) {
            var h = !0
              , m = {};
            return i.self && d.name === "self" ? (o.set(d, m),
            !0) : (r.j.reverse().forEach(function(f) {
                h && (h = r.M(d, f, t, m),
                d.from && d.to && (h = r.M(d, f, t, m, "from") && r.M(d, f, t, m, "to")),
                d.from && !d.to && (h = r.M(d, f, t, m, "from")),
                !d.from && d.to && (h = r.M(d, f, t, m, "to")))
            }),
            o.set(d, m),
            h)
        })
          , l = o.get(a)
          , c = [];
        if (c.push(i.once ? "once" : "page"),
        i.self && c.push("self"),
        l) {
            var u, p = [a];
            Object.keys(l).length > 0 && p.push(l),
            (u = this.logger).info.apply(u, ["Transition found [" + c.join(",") + "]"].concat(p))
        } else
            this.logger.info("No transition found [" + c.join(",") + "]");
        return a
    }
    ,
    e.update = function() {
        var t = this;
        this.all = this.all.map(function(i) {
            return t.N(i)
        }).sort(function(i, r) {
            return i.priority - r.priority
        }).reverse().map(function(i) {
            return delete i.priority,
            i
        }),
        this.page = this.all.filter(function(i) {
            return i.leave !== void 0 || i.enter !== void 0
        }),
        this.once = this.all.filter(function(i) {
            return i.once !== void 0
        })
    }
    ,
    e.M = function(t, i, r, s, o) {
        var a = !0
          , l = !1
          , c = t
          , u = i.name
          , p = u
          , d = u
          , h = u
          , m = o ? c[o] : c
          , f = o === "to" ? r.next : r.current;
        if (o ? m && m[u] : m[u]) {
            switch (i.type) {
            case "strings":
            default:
                var w = Array.isArray(m[p]) ? m[p] : [m[p]];
                f[p] && w.indexOf(f[p]) !== -1 && (l = !0),
                w.indexOf(f[p]) === -1 && (a = !1);
                break;
            case "object":
                var _ = Array.isArray(m[d]) ? m[d] : [m[d]];
                f[d] ? (f[d].name && _.indexOf(f[d].name) !== -1 && (l = !0),
                _.indexOf(f[d].name) === -1 && (a = !1)) : a = !1;
                break;
            case "function":
                m[h](r) ? l = !0 : a = !1
            }
            l && (o ? (s[o] = s[o] || {},
            s[o][u] = c[o][u]) : s[u] = c[u])
        }
        return a
    }
    ,
    e.S = function(t, i, r) {
        var s = 0;
        return (t[i] || t.from && t.from[i] || t.to && t.to[i]) && (s += Math.pow(10, r),
        t.from && t.from[i] && (s += 1),
        t.to && t.to[i] && (s += 2)),
        s
    }
    ,
    e.N = function(t) {
        var i = this;
        t.priority = 0;
        var r = 0;
        return this.j.forEach(function(s, o) {
            r += i.S(t, s.name, o + 1)
        }),
        t.priority = r,
        t
    }
    ,
    n
}();
function Er(n, e) {
    try {
        var t = n()
    } catch (i) {
        return e(i)
    }
    return t && t.then ? t.then(void 0, e) : t
}
var jm = function() {
    function n(t) {
        t === void 0 && (t = []),
        this.logger = new Sn("@barba/core"),
        this.store = void 0,
        this.C = !1,
        this.store = new Hm(t)
    }
    var e = n.prototype;
    return e.get = function(t, i) {
        return this.store.resolve(t, i)
    }
    ,
    e.doOnce = function(t) {
        var i = t.data
          , r = t.transition;
        try {
            var s = function() {
                o.C = !1
            }
              , o = this
              , a = r || {};
            o.C = !0;
            var l = Er(function() {
                return Promise.resolve(o.L("beforeOnce", i, a)).then(function() {
                    return Promise.resolve(o.once(i, a)).then(function() {
                        return Promise.resolve(o.L("afterOnce", i, a)).then(function() {})
                    })
                })
            }, function(c) {
                o.C = !1,
                o.logger.debug("Transition error [before/after/once]"),
                o.logger.error(c)
            });
            return Promise.resolve(l && l.then ? l.then(s) : s())
        } catch (c) {
            return Promise.reject(c)
        }
    }
    ,
    e.doPage = function(t) {
        var i = t.data
          , r = t.transition
          , s = t.page
          , o = t.wrapper;
        try {
            var a = function(d) {
                l.C = !1
            }
              , l = this
              , c = r || {}
              , u = c.sync === !0 || !1;
            l.C = !0;
            var p = Er(function() {
                function d() {
                    return Promise.resolve(l.L("before", i, c)).then(function() {
                        function m(w) {
                            return Promise.resolve(l.remove(i)).then(function() {
                                return Promise.resolve(l.L("after", i, c)).then(function() {})
                            })
                        }
                        var f = function() {
                            if (u)
                                return Er(function() {
                                    return Promise.resolve(l.add(i, o)).then(function() {
                                        return Promise.resolve(l.L("beforeLeave", i, c)).then(function() {
                                            return Promise.resolve(l.L("beforeEnter", i, c)).then(function() {
                                                return Promise.resolve(Promise.all([l.leave(i, c), l.enter(i, c)])).then(function() {
                                                    return Promise.resolve(l.L("afterLeave", i, c)).then(function() {
                                                        return Promise.resolve(l.L("afterEnter", i, c)).then(function() {})
                                                    })
                                                })
                                            })
                                        })
                                    })
                                }, function(b) {
                                    if (l.H(b))
                                        throw new Ho(b,"Transition error [sync]")
                                });
                            var w = function(b) {
                                return Er(function() {
                                    var y = function() {
                                        if (_ !== !1)
                                            return Promise.resolve(l.add(i, o)).then(function() {
                                                return Promise.resolve(l.L("beforeEnter", i, c)).then(function() {
                                                    return Promise.resolve(l.enter(i, c, _)).then(function() {
                                                        return Promise.resolve(l.L("afterEnter", i, c)).then(function() {})
                                                    })
                                                })
                                            })
                                    }();
                                    if (y && y.then)
                                        return y.then(function() {})
                                }, function(y) {
                                    if (l.H(y))
                                        throw new Ho(y,"Transition error [before/after/enter]")
                                })
                            }
                              , _ = !1
                              , v = Er(function() {
                                return Promise.resolve(l.L("beforeLeave", i, c)).then(function() {
                                    return Promise.resolve(Promise.all([l.leave(i, c), lo(s, i)]).then(function(b) {
                                        return b[0]
                                    })).then(function(b) {
                                        return _ = b,
                                        Promise.resolve(l.L("afterLeave", i, c)).then(function() {})
                                    })
                                })
                            }, function(b) {
                                if (l.H(b))
                                    throw new Ho(b,"Transition error [before/after/leave]")
                            });
                            return v && v.then ? v.then(w) : w()
                        }();
                        return f && f.then ? f.then(m) : m()
                    })
                }
                var h = function() {
                    if (u)
                        return Promise.resolve(lo(s, i)).then(function() {})
                }();
                return h && h.then ? h.then(d) : d()
            }, function(d) {
                throw l.C = !1,
                d.name && d.name === "BarbaError" ? (l.logger.debug(d.label),
                l.logger.error(d.error),
                d) : (l.logger.debug("Transition error [page]"),
                l.logger.error(d),
                d)
            });
            return Promise.resolve(p && p.then ? p.then(a) : a())
        } catch (d) {
            return Promise.reject(d)
        }
    }
    ,
    e.once = function(t, i) {
        try {
            return Promise.resolve(Ui.do("once", t, i)).then(function() {
                return i.once ? tr(i.once, i)(t) : Promise.resolve()
            })
        } catch (r) {
            return Promise.reject(r)
        }
    }
    ,
    e.leave = function(t, i) {
        try {
            return Promise.resolve(Ui.do("leave", t, i)).then(function() {
                return i.leave ? tr(i.leave, i)(t) : Promise.resolve()
            })
        } catch (r) {
            return Promise.reject(r)
        }
    }
    ,
    e.enter = function(t, i, r) {
        try {
            return Promise.resolve(Ui.do("enter", t, i)).then(function() {
                return i.enter ? tr(i.enter, i)(t, r) : Promise.resolve()
            })
        } catch (s) {
            return Promise.reject(s)
        }
    }
    ,
    e.add = function(t, i) {
        try {
            return kn.addContainer(t.next.container, i),
            Ui.do("nextAdded", t),
            Promise.resolve()
        } catch (r) {
            return Promise.reject(r)
        }
    }
    ,
    e.remove = function(t) {
        try {
            return kn.removeContainer(t.current.container),
            Ui.do("currentRemoved", t),
            Promise.resolve()
        } catch (i) {
            return Promise.reject(i)
        }
    }
    ,
    e.H = function(t) {
        return t.message ? !/Timeout error|Fetch error/.test(t.message) : !t.status
    }
    ,
    e.L = function(t, i, r) {
        try {
            return Promise.resolve(Ui.do(t, i, r)).then(function() {
                return r[t] ? tr(r[t], r)(i) : Promise.resolve()
            })
        } catch (s) {
            return Promise.reject(s)
        }
    }
    ,
    dl(n, [{
        key: "isRunning",
        get: function() {
            return this.C
        },
        set: function(t) {
            this.C = t
        }
    }, {
        key: "hasOnce",
        get: function() {
            return this.store.once.length > 0
        }
    }, {
        key: "hasSelf",
        get: function() {
            return this.store.all.some(function(t) {
                return t.name === "self"
            })
        }
    }, {
        key: "shouldWait",
        get: function() {
            return this.store.all.some(function(t) {
                return t.to && !t.to.route || t.sync
            })
        }
    }]),
    n
}()
  , Um = function() {
    function n(e) {
        var t = this;
        this.names = ["beforeLeave", "afterLeave", "beforeEnter", "afterEnter"],
        this.byNamespace = new Map,
        e.length !== 0 && (e.forEach(function(i) {
            t.byNamespace.set(i.namespace, i)
        }),
        this.names.forEach(function(i) {
            Ui[i](t._(i))
        }))
    }
    return n.prototype._ = function(e) {
        var t = this;
        return function(i) {
            var r = e.match(/enter/i) ? i.next : i.current
              , s = t.byNamespace.get(r.namespace);
            return s && s[e] ? tr(s[e], s)(i) : Promise.resolve()
        }
    }
    ,
    n
}();
Element.prototype.matches || (Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector),
Element.prototype.closest || (Element.prototype.closest = function(n) {
    var e = this;
    do {
        if (e.matches(n))
            return e;
        e = e.parentElement || e.parentNode
    } while (e !== null && e.nodeType === 1);
    return null
}
);
var Vm = {
    container: null,
    html: "",
    namespace: "",
    url: {
        hash: "",
        href: "",
        path: "",
        port: null,
        query: {}
    }
}
  , lr = new (function() {
    function n() {
        this.version = "2.10.3",
        this.schemaPage = Vm,
        this.Logger = Sn,
        this.logger = new Sn("@barba/core"),
        this.plugins = [],
        this.timeout = void 0,
        this.cacheIgnore = void 0,
        this.cacheFirstPage = void 0,
        this.prefetchIgnore = void 0,
        this.preventRunning = void 0,
        this.hooks = Ui,
        this.cache = void 0,
        this.headers = void 0,
        this.prevent = void 0,
        this.transitions = void 0,
        this.views = void 0,
        this.dom = kn,
        this.helpers = km,
        this.history = Ih,
        this.request = Em,
        this.url = Cm,
        this.D = void 0,
        this.B = void 0,
        this.q = void 0,
        this.F = void 0
    }
    var e = n.prototype;
    return e.use = function(t, i) {
        var r = this.plugins;
        r.indexOf(t) > -1 ? this.logger.warn("Plugin [" + t.name + "] already installed.") : typeof t.install == "function" ? (t.install(this, i),
        r.push(t)) : this.logger.warn("Plugin [" + t.name + '] has no "install" method.')
    }
    ,
    e.init = function(t) {
        var i = t === void 0 ? {} : t
          , r = i.transitions
          , s = r === void 0 ? [] : r
          , o = i.views
          , a = o === void 0 ? [] : o
          , l = i.schema
          , c = l === void 0 ? wi : l
          , u = i.requestError
          , p = i.timeout
          , d = p === void 0 ? 2e3 : p
          , h = i.cacheIgnore
          , m = h !== void 0 && h
          , f = i.cacheFirstPage
          , w = f !== void 0 && f
          , _ = i.prefetchIgnore
          , v = _ !== void 0 && _
          , b = i.preventRunning
          , y = b !== void 0 && b
          , x = i.prevent
          , k = x === void 0 ? null : x
          , T = i.debug
          , M = i.logLevel;
        if (Sn.setLevel((T !== void 0 && T) === !0 ? "debug" : M === void 0 ? "off" : M),
        this.logger.info(this.version),
        Object.keys(c).forEach(function(N) {
            wi[N] && (wi[N] = c[N])
        }),
        this.B = u,
        this.timeout = d,
        this.cacheIgnore = m,
        this.cacheFirstPage = w,
        this.prefetchIgnore = v,
        this.preventRunning = y,
        this.q = this.dom.getWrapper(),
        !this.q)
            throw new Error("[@barba/core] No Barba wrapper found");
        this.I();
        var E = this.data.current;
        if (!E.container)
            throw new Error("[@barba/core] No Barba container found");
        if (this.cache = new Am(m),
        this.headers = new Mm,
        this.prevent = new Bm(v),
        this.transitions = new jm(s),
        this.views = new Um(a),
        k !== null) {
            if (typeof k != "function")
                throw new Error("[@barba/core] Prevent should be a function");
            this.prevent.add("preventCustom", k)
        }
        this.history.init(E.url.href, E.namespace),
        w && this.cache.set(E.url.href, Promise.resolve({
            html: E.html,
            url: E.url
        }), "init", "fulfilled"),
        this.U = this.U.bind(this),
        this.$ = this.$.bind(this),
        this.X = this.X.bind(this),
        this.G(),
        this.plugins.forEach(function(N) {
            return N.init()
        });
        var C = this.data;
        C.trigger = "barba",
        C.next = C.current,
        C.current = vi({}, this.schemaPage),
        this.hooks.do("ready", C),
        this.once(C),
        this.I()
    }
    ,
    e.destroy = function() {
        this.I(),
        this.J(),
        this.history.clear(),
        this.hooks.clear(),
        this.plugins = []
    }
    ,
    e.force = function(t) {
        window.location.assign(t)
    }
    ,
    e.go = function(t, i, r) {
        var s;
        if (i === void 0 && (i = "barba"),
        this.F = null,
        this.transitions.isRunning)
            this.force(t);
        else if (!(s = i === "popstate" ? this.history.current && this.url.getPath(this.history.current.url) === this.url.getPath(t) && this.url.getQuery(this.history.current.url, !0) === this.url.getQuery(t, !0) : this.prevent.run("sameUrl", null, null, t)) || this.transitions.hasSelf)
            return i = this.history.change(this.cache.has(t) ? this.cache.get(t).target : t, i, r),
            r && (r.stopPropagation(),
            r.preventDefault()),
            this.page(t, i, r ?? void 0, s)
    }
    ,
    e.once = function(t) {
        try {
            var i = this;
            return Promise.resolve(i.hooks.do("beforeEnter", t)).then(function() {
                function r() {
                    return Promise.resolve(i.hooks.do("afterEnter", t)).then(function() {})
                }
                var s = function() {
                    if (i.transitions.hasOnce) {
                        var o = i.transitions.get(t, {
                            once: !0
                        });
                        return Promise.resolve(i.transitions.doOnce({
                            transition: o,
                            data: t
                        })).then(function() {})
                    }
                }();
                return s && s.then ? s.then(r) : r()
            })
        } catch (r) {
            return Promise.reject(r)
        }
    }
    ,
    e.page = function(t, i, r, s) {
        try {
            var o, a = function() {
                var p = l.data;
                return Promise.resolve(l.hooks.do("page", p)).then(function() {
                    var d = function(h, m) {
                        try {
                            var f = (w = l.transitions.get(p, {
                                once: !1,
                                self: s
                            }),
                            Promise.resolve(l.transitions.doPage({
                                data: p,
                                page: o,
                                transition: w,
                                wrapper: l.q
                            })).then(function() {
                                l.I()
                            }))
                        } catch {
                            return m()
                        }
                        var w;
                        return f && f.then ? f.then(void 0, m) : f
                    }(0, function() {
                        Sn.getLevel() === 0 && l.force(p.next.url.href)
                    });
                    if (d && d.then)
                        return d.then(function() {})
                })
            }, l = this;
            if (l.data.next.url = vi({
                href: t
            }, l.url.parse(t)),
            l.data.trigger = i,
            l.data.event = r,
            l.cache.has(t))
                o = l.cache.update(t, {
                    action: "click"
                }).request;
            else {
                var c = l.request(t, l.timeout, l.onRequestError.bind(l, i), l.cache, l.headers);
                c.then(function(p) {
                    p.url.href !== t && l.history.add(p.url.href, i, "replace")
                }),
                o = l.cache.set(t, c, "click", "pending").request
            }
            var u = function() {
                if (l.transitions.shouldWait)
                    return Promise.resolve(lo(o, l.data)).then(function() {})
            }();
            return Promise.resolve(u && u.then ? u.then(a) : a())
        } catch (p) {
            return Promise.reject(p)
        }
    }
    ,
    e.onRequestError = function(t) {
        this.transitions.isRunning = !1;
        var i = [].slice.call(arguments, 1)
          , r = i[0]
          , s = i[1]
          , o = this.cache.getAction(r);
        return this.cache.delete(r),
        this.B && this.B(t, o, r, s) === !1 || o === "click" && this.force(r),
        !1
    }
    ,
    e.prefetch = function(t) {
        var i = this;
        t = this.url.getAbsoluteHref(t),
        this.cache.has(t) || this.cache.set(t, this.request(t, this.timeout, this.onRequestError.bind(this, "barba"), this.cache, this.headers).catch(function(r) {
            i.logger.error(r)
        }), "prefetch", "pending")
    }
    ,
    e.G = function() {
        this.prefetchIgnore !== !0 && (document.addEventListener("mouseover", this.U),
        document.addEventListener("touchstart", this.U)),
        document.addEventListener("click", this.$),
        window.addEventListener("popstate", this.X)
    }
    ,
    e.J = function() {
        this.prefetchIgnore !== !0 && (document.removeEventListener("mouseover", this.U),
        document.removeEventListener("touchstart", this.U)),
        document.removeEventListener("click", this.$),
        window.removeEventListener("popstate", this.X)
    }
    ,
    e.U = function(t) {
        var i = this
          , r = this.W(t);
        if (r) {
            var s = this.url.getAbsoluteHref(this.dom.getHref(r));
            this.prevent.checkHref(s) || this.cache.has(s) || this.cache.set(s, this.request(s, this.timeout, this.onRequestError.bind(this, r), this.cache, this.headers).catch(function(o) {
                i.logger.error(o)
            }), "enter", "pending")
        }
    }
    ,
    e.$ = function(t) {
        var i = this.W(t);
        if (i) {
            if (this.transitions.isRunning && this.preventRunning)
                return t.preventDefault(),
                void t.stopPropagation();
            this.F = t,
            this.go(this.dom.getHref(i), i, t)
        }
    }
    ,
    e.X = function(t) {
        this.go(this.url.getHref(), "popstate", t)
    }
    ,
    e.W = function(t) {
        for (var i = t.target; i && !this.dom.getHref(i); )
            i = i.parentNode;
        if (i && !this.prevent.checkLink(i, t, this.dom.getHref(i)))
            return i
    }
    ,
    e.I = function() {
        var t = this.url.getHref()
          , i = {
            container: this.dom.getContainer(),
            html: this.dom.getHtml(),
            namespace: this.dom.getNamespace(),
            url: vi({
                href: t
            }, this.url.parse(t))
        };
        this.D = {
            current: i,
            event: void 0,
            next: vi({}, this.schemaPage),
            trigger: void 0
        },
        this.hooks.do("reset", this.data)
    }
    ,
    dl(n, [{
        key: "data",
        get: function() {
            return this.D
        }
    }, {
        key: "wrapper",
        get: function() {
            return this.q
        }
    }]),
    n
}());
F.registerPlugin(Y);
F.config({
    force3D: !0
});
function Wm(n, e) {
    const t = ".hero__column--left .split-inner"
      , i = ".hero__column--right .split-inner";
    F.timeline().call( () => Ym()).set(Ni, {
        y: e == !0 ? "-100%" : 0
    }).set(Ca, {
        y: "20%"
    }).set([t, i], {
        y: "100%"
    }).to([Mh, Oh, Ca], {
        opacity: 1,
        scale: 1,
        y: 0,
        ease: Ze,
        delay: n,
        duration: pe
    }, "<").to(Lh, {
        opacity: 1,
        scale: 1.03,
        ease: Ze,
        duration: pe
    }, "<").to(t, {
        y: 0,
        ease: Ze,
        stagger: nh() ? .01 : -.01,
        duration: pe
    }, n + .2).to(i, {
        y: 0,
        ease: Ze,
        stagger: .01,
        duration: pe
    }, "<").to(Ni, {
        y: 0,
        ease: Ze,
        duration: pe
    }, "<").set(".hero__column-infos", {
        overflow: "visible"
    })
}
function Ym() {
    Nh.initGradient(".pp__circle-bg"),
    F.to("#home .about__description .split-inner", {
        duration: .8,
        opacity: 1,
        stagger: .1,
        scrollTrigger: {
            trigger: "#home .about__description",
            start: "top 80%",
            end: "center center",
            scrub: 1
        }
    });
    function n(e, t) {
        F.to(e, {
            ...t,
            scrollTrigger: {
                trigger: "#home .hero",
                scrub: 1,
                start: "top top"
            }
        })
    }
    nh() || (n(".pp__circle-image", {
        yPercent: -4
    }),
    n(".hero__column--left", {
        xPercent: -4
    }),
    n(".hero__column--right", {
        xPercent: 4
    }))
}
F.registerPlugin(Y);
F.config({
    force3D: !0
});
function Xm(n, e) {
    const t = ".hero__title-left .split-inner"
      , i = ".hero__title-right .split-inner"
      , r = ".hero__title video";
    F.timeline().call( () => Gm()).set(Ni, {
        y: e == !0 ? "-100%" : 0
    }).set(r, {
        y: "50%",
        scale: .8
    }).to(r, {
        y: 0,
        scale: 1,
        ease: Ze,
        delay: n - .1,
        duration: pe
    }).to(t, {
        y: 0,
        ease: Ze,
        stagger: -.01,
        duration: pe
    }, "<+0.1").to(i, {
        y: 0,
        ease: Ze,
        stagger: .01,
        duration: pe
    }, "<").to(Ni, {
        y: 0,
        ease: Ze,
        duration: pe
    }, "<")
}
function Gm() {
    function n(t, i) {
        F.to(t, {
            ...i,
            scrollTrigger: {
                trigger: ".hero",
                scrub: 1,
                start: "top top"
            }
        })
    }
    const e = document.querySelector(".hero video");
    setTimeout( () => {
        e.play().catch(t => {
            console.log("Autoplay was prevented for a video:", t)
        }
        )
    }
    , 100),
    Nh.initGradient(".pp__circle-bg"),
    F.timeline().set([Mh, Oh, Ca], {
        opacity: 1,
        scale: 1,
        y: 0
    }).set(Lh, {
        opacity: 1,
        scale: 1.03
    }),
    n(".hero__title-left", {
        xPercent: -4
    }),
    n(".hero__title-right", {
        xPercent: 4
    })
}
F.registerPlugin(Y);
F.config({
    force3D: !0
});
function Km(n, e) {
    F.timeline().call( () => Qm()).set(".hero > *", {
        y: "200px"
    }).set([".hero .work", ".hero .hero__capabilities"], {
        opacity: 0
    }).set(Ni, {
        y: e == !0 ? "-100%" : 0
    }).to(".hero > *", {
        delay: n - .1,
        y: 0,
        stagger: .05,
        opacity: 1,
        ease: Ze,
        duration: pe
    }).to(Ni, {
        y: 0,
        ease: Ze,
        duration: pe
    }, "<")
}
function Qm() {
    document.querySelectorAll(".plyr").forEach(l => {
        new as(l,{
            controls: ["play-large", "play", "progress", "current-time", "mute", "volume"]
        })
    }
    ),
    document.querySelectorAll("video[autoplay]").forEach(l => {
        setTimeout( () => {
            l.play().catch(c => {
                console.log("Autoplay was prevented for a video:", c)
            }
            )
        }
        , 100)
    }
    );
    let t = -1;
    const i = r(".work:is(.is-title) .work__categories-inner", {
        duration: 15
    });
    Y.create({
        onUpdate(l) {
            l.direction !== t && (t *= -1,
            F.to(i, {
                timeScale: t,
                overwrite: !0
            }))
        }
    });
    function r(l, c, u) {
        c = c || {},
        c.ease || (c.ease = "none");
        const p = F.timeline({
            repeat: -1,
            onReverseComplete() {
                this.totalTime(this.rawTime() + this.duration() * 10)
            }
        })
          , d = F.utils.toArray(l)
          , h = d.map(f => {
            let w = f.cloneNode(!0);
            return f.parentNode.appendChild(w),
            w
        }
        )
          , m = () => d.forEach( (f, w) => F.set(h[w], {
            position: "absolute",
            overwrite: !1,
            top: f.offsetTop,
            left: f.offsetLeft + f.offsetWidth
        }));
        return m(),
        d.forEach( (f, w) => p.to([f, h[w]], {
            xPercent: -100,
            ...c
        }, 0)),
        window.addEventListener("resize", () => {
            let f = p.totalTime();
            p.totalTime(0),
            m(),
            p.totalTime(f)
        }
        ),
        p
    }
    function s(l) {
        const c = l.target;
        if (c.tagName === "A" && c.getAttribute("href").startsWith("#")) {
            l.preventDefault();
            const u = c.getAttribute("href")
              , d = document.querySelector("header").offsetHeight
              , h = document.querySelector(u);
            if (h) {
                const m = h.getBoundingClientRect().top + window.scrollY;
                qn.scrollTo(m - d)
            }
        }
    }
    function o() {
        const l = window.scrollY;
        document.querySelector("header").offsetHeight;
        const u = document.querySelectorAll(".projects__item")
          , p = document.querySelectorAll(".projects__menu-link");
        u.forEach( (d, h) => {
            const m = d.offsetTop - window.innerHeight / 2
              , f = m + d.offsetHeight;
            l >= m && l < f && (p.forEach(w => {
                w.classList.remove("active")
            }
            ),
            p[h].classList.add("active"))
        }
        )
    }
    function a() {
        const l = document.querySelectorAll(".projects__img-row-item");
        l.length && l.forEach(c => {
            const u = c.querySelector(".projects__img-overlay");
            F.to(u, {
                yPercent: -100,
                display: "none",
                duration: 1,
                ease: "Expo.easeOut",
                scrollTrigger: {
                    trigger: c,
                    start: "top 90%"
                }
            })
        }
        )
    }
    document.addEventListener("click", s),
    window.addEventListener("scroll", o),
    a(),
    F.to(".is-title .work__categories-row", {
        xPercent: -10,
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            scrub: !0
        }
    })
}
F.registerPlugin(Y);
F.config({
    force3D: !0
});
function Jm(n) {
    const e = window.innerWidth > 540 ? "40vh" : "10vh"
      , {onComplete: t=null} = n;
    qn.stop(),
    F.timeline({
        onComplete: t
    }).set(Ea, {
        display: "block"
    }).set(Xr, {
        display: "flex",
        y: "100%"
    }).call(Zm).set(cc, {
        height: 0
    }).to(Xr, {
        duration: pe,
        y: 0,
        ease: "Expo.easeInOut"
    }).to(cc, {
        duration: pe,
        height: e,
        ease: "Expo.easeInOut"
    }, "<")
}
function pc(n) {
    const e = window.innerWidth > 540 ? "40vh" : "10vh"
      , {nextPageAnim: t=null, nextPageAnimDelay: i=null, onComplete: r=null, once: s=null} = n;
    F.timeline({
        onComplete: r
    }).set(uc, {
        height: e
    }).set(Ea, {
        display: "block"
    }).set(Xr, {
        display: "flex",
        y: 0
    }).call(eg, null, s == !0 ? .2 : 0).to(Xr, {
        duration: pe,
        y: "-100%",
        ease: "Expo.easeInOut",
        onStart: t,
        onStartParams: [i, s]
    }).to(uc, {
        duration: pe,
        height: "0vh",
        ease: "Expo.easeInOut"
    }, "<").set(um, {
        height: 0
    }).set(Xr, {
        display: "none",
        y: "100%"
    }).set(Ea, {
        display: "none"
    }).call( () => qn.start())
}
function Zm() {
    F.timeline().set(Dh, {
        display: "block"
    }).set(ao, {
        y: "100%"
    }).to(ao, {
        duration: pe,
        delay: .1,
        y: "0%",
        ease: "Expo.easeInOut",
        stagger: .02
    })
}
function eg() {
    F.timeline().to(ao, {
        duration: pe,
        delay: -.2,
        y: "-100%",
        ease: "Expo.easeInOut",
        stagger: -.02
    }).set(ao, {
        y: "100%"
    }).set(Dh, {
        display: "none"
    })
}
function tg(n) {
    const e = document.querySelector(".overlay-transition__next-page-inner")
      , t = document.querySelector(".overlay-transition__progress-bar")
      , i = document.querySelector(".overlay-transition__progress");
    qn.stop(),
    F.set([e, i], {
        visibility: "visible"
    });
    let r = 0;
    function s() {
        if (r === 100) {
            Bs("100"),
            F.to(".overlay-transition__progress-container", {
                opacity: 0,
                display: "none",
                duration: .3
            }),
            n();
            return
        }
        r += Math.floor(Math.random() * 10) + 1,
        r > 100 && (r = 100),
        e.textContent = r,
        t.style.width = r + "%";
        var o = Math.floor(Math.random() * 1) + 30;
        setTimeout(s, o)
    }
    s()
}
F.registerPlugin(Y);
F.config({
    force3D: !0
});
function ig(n, e) {
    let t = -1;
    const i = r(".work:is(.is-title) .work__categories-inner", {
        duration: 15
    });
    Y.create({
        onUpdate(s) {
            s.direction !== t && (t *= -1,
            F.to(i, {
                timeScale: t,
                overwrite: !0
            }))
        }
    });
    function r(s, o, a) {
        o = o || {},
        o.ease || (o.ease = "none");
        const l = F.timeline({
            repeat: -1,
            onReverseComplete() {
                this.totalTime(this.rawTime() + this.duration() * 10)
            }
        })
          , c = F.utils.toArray(s)
          , u = c.map(d => {
            let h = d.cloneNode(!0);
            return d.parentNode.appendChild(h),
            h
        }
        )
          , p = () => c.forEach( (d, h) => F.set(u[h], {
            position: "absolute",
            overwrite: !1,
            top: d.offsetTop,
            left: d.offsetLeft + d.offsetWidth
        }));
        return p(),
        c.forEach( (d, h) => l.to([d, u[h]], {
            xPercent: -100,
            ...o
        }, 0)),
        window.addEventListener("resize", () => {
            let d = l.totalTime();
            l.totalTime(0),
            p(),
            l.totalTime(d)
        }
        ),
        l
    }
}
F.config({
    force3D: !0
});
function ng(n, e) {
    const t = ".hero h1 .split-inner"
      , i = ".hero h2 .split-inner"
      , r = ".hero p .split-inner"
      , s = document.querySelectorAll(".hero .divider__line")
      , o = document.querySelector(".work__categories-row:first-of-type");
    F.timeline().set(Ni, {
        y: e == !0 ? "-100%" : 0
    }).set(o, {
        y: "100%"
    }).to(t, {
        delay: n,
        ease: Ze,
        duration: pe,
        stagger: .01,
        y: 0
    }, "<").to(Ni, {
        y: 0,
        ease: Ze,
        duration: pe
    }, "<").to(i, {
        ease: Ze,
        duration: pe,
        stagger: .005,
        y: 0
    }, "<0.2").to(o, {
        ease: Ze,
        duration: pe,
        y: 0
    }, "<").to(r, {
        ease: Ze,
        duration: pe,
        stagger: .005,
        y: 0
    }, "<0.2").to(s, {
        ease: Ze,
        duration: pe / 2,
        scaleX: 1
    }, "<")
}
lr.hooks.beforeOnce( () => {
    history.scrollRestoration = "manual",
    window.scrollTo(0, 0),
    Rh()
}
);
lr.hooks.before(n => {
    const e = document.querySelectorAll("nav a")
      , t = n.trigger;
    t == "back" || t == "forward" ? Bs(lr.history.current.ns) : Bs(n.next.namespace),
    t !== "back" && !t.classList.contains("active") && (e.forEach(i => i.classList.remove("active")),
    t.classList.add("active"))
}
);
lr.hooks.after( () => {
    history.scrollRestoration = "manual",
    window.scrollTo(0, 0),
    Rh()
}
);
const La = {
    home: Wm,
    about: Xm,
    projects: Km,
    404: ig,
    work: ng
}
  , rg = Object.keys(La);
lr.init({
    timeout: 5e3,
    preventRunning: !0,
    debug: !1,
    sync: !0,
    transitions: [{
        name: "page-transition",
        to: {
            namespace: rg
        },
        async beforeOnce() {
            const n = this.async();
            tg(n)
        },
        async once(n) {
            const e = this.async()
              , t = La[n.next.namespace] || null;
            pc({
                nextPageAnim: t,
                nextPageAnimDelay: pe / 2,
                onComplete: e,
                once: !0
            })
        },
        async leave() {
            const n = this.async();
            Jm({
                onComplete: n
            })
        },
        after(n) {
            const e = La[n.next.namespace] || null;
            pc({
                nextPageAnim: e,
                nextPageAnimDelay: pe / 2,
                once: !1
            })
        }
    }]
});
