"use strict"

function Gallery(args) {
    this.init(args);
}

Gallery.prototype = {
    options: {
        node: null,
        selector: '.gallery-container',
        nextSelector: '.btn-next',
        prevSelector: '.btn-prev',
        startSelector: '.btn-start',
        stopSelector: '.btn-stop',
        photoContainerSelector: '.photo-container',
        buttonContainerSelector: '.button-container',
        pagerContainerSelector: '.pager-container',
        firstactive: 0,
        timeout: 5000,
        showPager: false,
        initRun: false,
    },
    init: function(args) {
        const _self = this;
        this.options = Object.assign(this.options, args);
        this.options = Object.assign(this.options, this.options.node.dataset)
        console.log("options", this.options);
        this.currentActive = Number(this.options.firstactive);
        this.isStopped = !this.options.initRun;

        this.holder = this.options.node;

        this.images = this.holder.querySelectorAll(`${this.options.photoContainerSelector} > *`);
        this.imagesAmount = this.images.length;

        this.nextButton = this.holder.querySelector(this.options.nextSelector);
        this.nextButton.addEventListener("click", () => _self.changeSlide("next"));
        this.prevButton = this.holder.querySelector(this.options.prevSelector);
        this.prevButton.addEventListener("click", () => _self.changeSlide("prev"));

        this.startButton = this.holder.querySelector(this.options.startSelector);
        this.startButton.addEventListener("click", () => _self.startSlide());
        this.stopButton = this.holder.querySelector(this.options.stopSelector);
        this.stopButton.addEventListener("click", () => _self.stopSlide());

        this.setInv();
        if (this.options.showPager) {
            this.addPager();
            this.pagers = this.holder.querySelectorAll(`${this.options.pagerContainerSelector} > *`);
            this.setPagerListener();
        }

        if (this.options.initRun) {
            this.run();
        }
    },
    setInv: function ()  {
        for (let i = 0; i < this.images.length; i++) {
            if (i !== Number(this.options.firstactive)) {
                this.images[i].classList.add("invisible")
            }
        }
    },
    addPager: function () {
        for (let i = 0; i < this.imagesAmount; i++) {
            const parent = this.holder.querySelector(".pager-container");
            const child = document.createElement("div");
            child.classList.add("pager-unit");
            child.dataset.number = `${i}`;
            parent.appendChild(child);
            if (i === this.currentActive) {
                child.classList.add("pager-active");
            }
        }
    },
    setPagerListener: function () {
        const _self = this;
        for (let i = 0; i < this.imagesAmount; i++) {
            let currentPagerUnit = this.pagers[i];
            currentPagerUnit.onclick = function() {
                _self.changeSlide(Number(currentPagerUnit.dataset.number))
            };
        }
    },
    changeSlide: function (pointer) {
        this.clearInterval();

        let currImg = this.images[this.currentActive];
        let currPager = this.pagers[this.currentActive];

        this.clearFadeOut();
        currPager.classList.remove("pager-active");
        currImg.classList.add("invisible");
        currImg.classList.remove("fade-in");
        currImg.classList.add("fade-out");
        if (pointer === "next") {
            this.currentActive === this.imagesAmount - 1 ?
                this.currentActive = 0 : this.currentActive++;
        }
        else if (pointer === "prev") {
            this.currentActive === 0 ?
                this.currentActive = this.imagesAmount - 1 : this.currentActive--;
        } else if (!isNaN(pointer)) {
            this.currentActive = pointer;
        }
        currImg = this.images[this.currentActive];
        currPager = this.pagers[this.currentActive];

        currPager.classList.add("pager-active");
        currImg.classList.remove("invisible");
        currImg.classList.remove("fade-out");
        currImg.classList.add("fade-in");

        if (!this.isStopped) {
            this.interval = setInterval(() => this.run(), this.options.timeout);
        }
    },
    clearFadeOut: function () {
        for (let img of this.images) {
            img.classList.remove("fade-out");
        }
    },
    startSlide: function() {
        this.run();
        this.isStopped = false;
    },
    stopSlide: function() {
        this.clearInterval();
        this.isStopped = true;
    },
    run: function() {
        this.clearInterval();
        this.interval = setInterval(() => {
            this.changeSlide("next");
        }, this.options.timeout);
    },

    clearInterval: function() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
};

function createGalleries() {
    let nodes = document.querySelectorAll('.gallery-container');
    let galleries = [];

    nodes.forEach(node => {
        let tempGal = new Gallery({
            node: node,
            showPager: true,
            initRun: true,
        })

        galleries.push(tempGal);
    })
}

window.addEventListener('DOMContentLoaded', () => {
    createGalleries();
});
