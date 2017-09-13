((document, window) => {

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

    const imgCenter = (image) => {
        let imageBox = image.parentNode,
            boxR = imageBox.offsetHeight / imageBox.offsetWidth;

        imgLoad(image).then(() => {
            let imageR = image.offsetHeight / image.offsetWidth,
                result = boxR > imageR ? 'fill-y' : 'fill-x';

            image.classList.add(result);
        });
    };

    window.onload = window.onscroll = () => {
        let images = document.images,
            winHeight = window.innerHeight,
            scrollTop = document.body.scrollTop || document.documentElement.scrollTop;


        //offset top
        console.log('winHeight: ' + winHeight);
        console.log("视口top: " + images[7].getBoundingClientRect().top);
        console.log("offset top: " + getOffsetTop(images[7]));

        Array.from(images).forEach((image) => {

            //getAttribute('data-src')
            let dataSrc = image.dataset.src;

            if(!dataSrc){
                return;
            }

            // +100提前加载 winHeight + 100>= image.getBoundingClientRect().top
            if(winHeight + 100 + scrollTop >= getOffsetTop(image)){ // winHeight + 100 + scrollTop <= getOffsetTop(image)
                image.src = dataSrc;
                image.removeAttribute('data-src');
            }

            imgCenter(image);
        });
    };

    let getOffsetTop = (ele) => {
        let top = ele.offsetTop;
        while (ele = ele.offsetParent){
            top += ele.offsetTop;
        }
        return top;
    };

})(document, window);