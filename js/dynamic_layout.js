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
    dl_render(JSON.parse(getCookie(constantKey)));

    /** 2 **/
    window.manualRender = function (layoutData) {
        if (JSON.stringify(layoutData) == getCookie(constantKey)) return;
        dl_render(layoutData);
        setCookie(constantKey, JSON.stringify(layoutData));
    };

    /** 3 **/
    window.addEventListener('resize', function () {
        dl_render(JSON.parse(getCookie(constantKey)));
    });

    /*
    **  Layout Rendering
    **
    **  para    layout data
    **  format  [
    **              {width: Number, height: Number},
    **              {width: Number, height: Number},
    **              ...
    **          ]
    **
    **  NOTE    Number <= 100, Layout Area = 100 * 100
    **/
    function dl_render(layoutData) {
        if (!(layoutData instanceof Array)) return;
        var container = document.querySelector('.dl_container');
        var WIDTH = container.offsetWidth;
        var allCells = document.querySelectorAll('.dl_container .dl_cell');
        for (var i = 0; i < allCells.length && i < layoutData.length; i ++){
            allCells[i].style.width = parseInt(layoutData[i].width) / 100 * WIDTH + 'px';
            allCells[i].style.height = parseInt(layoutData[i].height) / 100 * WIDTH + 'px';
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
