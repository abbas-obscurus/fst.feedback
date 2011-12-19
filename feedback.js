"use strict";

(function() {
    var overlay;
    var highlights = [], highlight_overlays = [];
    var current_highlight;
    var last_move = +(new Date()),
        current_move;
    var el, el_position;
    var i, l;

    var onload = function(e) {
        overlay = document.createElement("DIV");
        overlay.setAttribute("id", "fst-feedback-overlay");
        document.body.appendChild(overlay);

        highlights.push(document.createElement("DIV"));
        highlights[0].setAttribute("id", "fst-feedback-highlights-0");
        highlights[0].setAttribute("class", "fst-feedback-highlights");
        document.body.appendChild(highlights[0]);
        current_highlight = highlights[0];

        for (var i = 0, l = 4; i < l; i++) {
            create_highlight_overlay(i);
        }

        set_highlight_overlays(100, 100, 0, 0);

        overlay.addEventListener("mousemove", onmousemove);
        overlay.addEventListener("click", onmouseclick);
    };

    var create_highlight_overlay = function(index) {
        var block = document.createElement("DIV");
        block.setAttribute("id", "fst-feedback-highlight-overlays-"+index);
        block.setAttribute("class", "fst-feedback-highlight-overlays");
        highlight_overlays[index] = block;
        document.body.appendChild(block);
    };

    var onmousemove = function(e) {
        current_move = +(new Date());
        if (current_move - last_move < 50) { return; }
        last_move = current_move;

        overlay.style.display = "none";
        el = get_element_from_point(e.clientX, e.clientY);
        overlay.style.display = "block";

        if (check_element_in_highlighted(el)) { 
            hide_highlight();
            set_highlight_overlays();
            return; 
        }

        el_position = position(el);
        set_highlight(el_position["left"]-3, el_position["top"]-2, el.offsetWidth+3, el.offsetHeight+2);
        set_highlight_overlays();
    };

    var onmouseclick = function(e) {
        overlay.style.display = "none";
        el = get_element_from_point(e.clientX, e.clientY);
        overlay.style.display = "block";

        if (check_element_in_highlighted(el)) { 
            hide_highlight();
            return;
        }

        el_position = position(el);
        set_highlight(el_position["left"]-3, el_position["top"]-2, el.offsetWidth+3, el.offsetHeight+2, true);

        el.setAttribute("rel", "fst-feedback-highlighted");
    };

    var get_element_from_point = function(x, y) {
        var el = document.elementFromPoint(x, y);
        if (el.getAttribute("class") == "fst-feedback-highlights" || el.getAttribute("class") == "fst-feedback-highlight-overlays") {
            var _el = el;
            _el.style.display = "none";
            el = get_element_from_point(x, y);
            _el.style.display = "block";
        }
        return el;
    };

    var check_element_in_highlighted = function(el) {
        do {
            if (el.getAttribute && el.getAttribute("rel") == "fst-feedback-highlighted") {
                return true;
            }
        } while (el = el.parentNode);
        return false;
    };

    var position = function(element) {
        var left = 0, top = 0;
        if (element.offsetParent) {
            do {
                left += element.offsetLeft;
                top  += element.offsetTop;
            } while (element = element.offsetParent);
        }
        return {"left": left, "top": top};
    };

    var set_highlight = function(x, y, w, h, fixed) {
        fixed = fixed || false;
        set_element_metrics(current_highlight, x, y, w, h);
        show_highlight();
        if (fixed) {
            highlights.push(document.createElement("DIV"));
            var index = highlights.length - 1
            highlights[index].setAttribute("id", "fst-feedback-highlights-"+index);
            highlights[index].setAttribute("class", "fst-feedback-highlights");
            document.body.appendChild(highlights[index]);
            current_highlight = highlights[index];
        }
    };

    var hide_highlight = function(){
        current_highlight.style.display = "none";
    };

    var show_highlight = function(){
        current_highlight.style.display = "block";
    };

    var set_highlight_overlays = function() {
        var cw = document.body.clientWidth, ch = document.body.clientHeight;
        if (highlights.length > 0) {
            highlights.sort(function(a, b) {
                if (a.style.top == b.style.top) { return 0; }
                return (a.style.top < b.style.top) ? -1 : 1;
            });
        }
        for (var i = 0, l = highlights.length; i < l; i++) {

            set_north_highlight_overlay(i, cw, ch);
            set_south_highlight_overlay(i, cw, ch);
            // set_east_highlight_overlay(i, cw, ch);
        }
    };

    var set_north_highlight_overlay = function(index, cw, ch) {
        if (!highlight_overlays[index*4]) { create_highlight_overlay(index*4); }
        if (highlights[index].style.display == "none") {
            highlight_overlays[index*4].style.display = "none";
            return;
        }
        var y = highlights[index].offsetTop;
        for (var j = 0, k = highlights.length; j < k; j++) {
            if (highlights[j].style.display == "none") { continue; }
            if (highlights[index] == highlights[j]) { continue; }
            if (y > highlights[j].offsetTop) {
                highlight_overlays[index*4].style.display = "none";
                return;
            }
        }
        highlight_overlays[index*4].style.display = "block";
        set_element_metrics(highlight_overlays[index*4], 0, 0, cw, highlights[index].offsetTop);
    };

    var set_south_highlight_overlay = function(index, cw, ch) {
        if (!highlight_overlays[index*4+3]) { create_highlight_overlay(index*4+3); }
        if (highlights[index].style.display == "none") {
            highlight_overlays[index*4+3].style.display = "none";
            return;
        }
        var x = 0,
            y = highlights[index].offsetTop + highlights[index].clientHeight,
            w = cw,
            h = ch - y;
        for (var j = 0, k = highlights.length; j < k; j++) {
            if (highlights[j].style.display == "none") { continue; }
            if (highlights[index] == highlights[j]) { continue; }
            if (y > (highlights[j].offsetTop + highlights[j].clientHeight)) { continue; }
            if (y < highlights[j].offsetTop && h > (highlights[j].offsetTop - y)) {
                h = highlights[j].offsetTop - y;
            }
            if (y > highlights[j].offsetTop && y <= (highlights[j].offsetTop + highlights[j].clientHeight)) {
                if (highlights[index].offsetLeft > highlights[j].offsetLeft + highlights[j].clientWidth) {
                    if (highlights[j].offsetLeft + highlights[j].clientWidth > x) {
                        x = highlights[j].offsetLeft + highlights[j].clientWidth;
                    }
                } else if (highlights[index].offsetLeft > highlights[j].offsetLeft) {
                    if (highlights[j].offsetLeft > x) {
                        x = highlights[j].offsetLeft;
                    }
                }
                if (highlights[index].offsetLeft + highlights[index].clientWidth < highlights[j].offsetLeft) {
                    if (highlights[j].offsetLeft < w) {
                        w = highlights[j].offsetLeft;
                    }
                }
                h = highlights[j].offsetTop - (highlights[index].offsetTop + highlights[index].clientHeight);
            }
        }
        highlight_overlays[index*4+3].style.display = "block";
        set_element_metrics(highlight_overlays[index*4+3], x, y, w, h);
    };

    var set_east_highlight_overlay = function(index, cw, ch) {
        if (!highlight_overlays[index*4+2]) { create_highlight_overlay(index*4+2); }
        if (highlights[index].style.display == "none") {
            highlight_overlays[index*4+2].style.display = "none";
            return;
        }
        var x = highlights[index].offsetLeft + highlights[index].clientWidth,
            y = highlights[index].offsetTop,
            w = cw - x,
            h = highlights[index].clientHeight;
        for (var j = 0, k = highlights.length; j < k; j++) {
            if (highlights[j].style.display == "none") { continue; }
            if (highlights[index] == highlights[j]) { continue; }
            if (x > (highlights[j].offsetLeft + highlights[j].clientWidth)) { continue; }

        }
        highlight_overlays[index*4+2].style.display = "block";
        set_element_metrics(highlight_overlays[index*4+2], x, y, w, h);
    };

    var set_element_metrics = function(element, x, y, w, h) {
        element.style.left     = x+"px";
        element.style.top      = y+"px";
        element.style.width    = w+"px";
        element.style.height   = h+"px";
    };

    document.addEventListener("DOMContentLoaded", onload);
})();