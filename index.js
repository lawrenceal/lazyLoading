const addClass = (ele, cln) => {
    let hasArr = ele.className.split(/\s+/).filter(c => c === cln);
    if(!hasArr.length){
        ele.className += ` ${cln}`;
    }
};

const removeClass = (ele, cln) => {
    ele.className = ele.className.split(/\s+/).filter(c => c !== cln).join(' ');
};

const getOffsetTop = (ele) => {
    let top = ele.offsetTop;
    while (ele = ele.offsetParent){
        top += ele.offsetTop;
    }
    return top;
};

const imgLoad = (img) => {
    return new Promise((resolve, reject) => {
        if(img.complete){
            resolve();
        }else {
            img.onload = (event) => {
                resolve(event);
            };

            img.onerror = (event) => {
                reject(event);
            }
        }
    });
};

const imgCenter = (img) => {
    let imageBox = img.parentNode,
        boxR = imageBox.offsetHeight / imageBox.offsetWidth;

    imgLoad(img).then(() => {
        let imageR = img.offsetHeight / img.offsetWidth,
            result = boxR > imageR ? 'fill-y' : 'fill-x';

        addClass(img, result);
    });
};

const isShow = (img, offset) => {
    let winHeight = window.innerHeight || document.documentElement.clientHeight,
        scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

    return getOffsetTop(img) <= scrollTop + offset + winHeight;
    //return img.getBoundingClientRect().top <= winHeight + offset;
};

const throttle = (fn, delay, mustRun) => {
    let timeId, startDate = new Date();

    return (context = this, ...args) => {
        let currDate = new Date();

        clearTimeout(timeId);

        if(currDate - startDate >= mustRun){
            fn.apply(context, args);
            startDate = currDate;
        }else{
            timeId = setTimeout(() => {
                fn.apply(context, args);
            }, delay);
        }
    }
};

let defaults = {
    selector: 'l-lazyload',
    time: 100,
    offset: 100,
    mustRun: 300
};

class ImageLazyLoad{

    constructor(selector, options){
        Object.assign(this, defaults, {'selector': selector}, options);
        this.init();
    }

    init(){
        this.imageList = [...document.querySelectorAll(this.selector)];

        window.addEventListener('load', () => {
            this.loadLazyImage();
        }, false);

        window.addEventListener('scroll', () => {
            throttle(this.loadLazyImage, this.time, this.mustRun)(this);
        }, false);
    }

    loadLazyImage (){

        for(let i = this.imageList.length - 1; i >= 0; i--){
            let img = this.imageList[i];

            if(isShow(img, this.offset)) {

                //html5 img.dataset.src
                img.src = img.getAttribute('data-src');

                //TODO 强制selector className
                //removeClass(img, this.selector);
                img.removeAttribute('data-src');
                imgCenter(img);

                this.imageList.splice(i, 1);
            }
        }
    }
}

//export default ImageLazyLoad;