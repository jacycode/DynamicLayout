/*
**  Dynamic Layout
**
**  1、First rendering via IIFE (data in cookie)
**
**  2、Call function to render manually (data in respone, And it's different from cookie)
**
**  3、Automatically render When resize() is called (data in cookie)
 */


(function () {
    var constantKey = 'DYNAMICLAYOUT';
    /** 1 **/
    dl_render(document, JSON.parse(getCookie(constantKey)));

    /** 2 **/
    window.manualRender = function (layoutData) {
        if (JSON.stringify(layoutData) == getCookie(constantKey)) return;
        dl_render(document, layoutData);
        setCookie(constantKey, JSON.stringify(layoutData));
    };

    /** 3 **/
    window.addEventListener('resize', function () {
        dl_render(document, JSON.parse(getCookie(constantKey)));
    });

    /*
    **  Layout Rendering
    **
    **  para    layout data
    **  format  tree
    **          {
    **              value: [
    **                          { width: Number, height: Number },
    **                          { width: Number, height: Number }
    **                          ...
    **                     ]
    **              children: []
    **          }
    **
    **  NOTE    Number <= 100, Layout Area = 100 * 100
    **/
    function dl_render(element, layoutData) {
        if (!(layoutData instanceof Object) || !(layoutData.value instanceof Array)) return;
        var container = element.querySelector('.dl_container');
        if (!container) return;
        var WIDTH = container.offsetWidth;
        var allCells = Array.prototype.slice.call( container.querySelectorAll('.dl_cell') ).filter(ele=>ele.parentNode===container);
        console.log(layoutData);
        for (var i = 0; i < allCells.length && i < layoutData.value.length; i ++){
            allCells[i].style.width = Math.floor(parseInt(layoutData.value[i].width) / 100 * WIDTH) + 'px';
            allCells[i].style.height = Math.floor(parseInt(layoutData.value[i].height) / 100 * WIDTH) + 'px';
            //recursive call
            if (layoutData.children instanceof Array) arguments.callee(allCells[i], layoutData.children[i]);
        }
    }

    /*
    **  Cookie setter/getter
    **/
    function setCookie(cname,cvalue,exdays) {
        var d = new Date();
        d.setTime(d.getTime()+((exdays?exdays:365)*24*60*60*1000));
        var expires = "expires="+d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++)
        {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
        return "[]";
    }
})();
