"use strict";

(function() {
    var overlay, highlight;
    var highlight_overlay = [];
    var last_move = +(new Date()),
        current_move;
    var el, el_position;
    var i, l;

    var onload = function(e) {
        overlay = document.createElement("DIV");
        overlay.setAttribute("id", "fst-feedback-overlay");
        document.body.appendChild(overlay);

        highlight = document.createElement("DIV");
        highlight.setAttribute("id", "fst-feedback-highlight");
        highlight.style.display = "none";
        document.body.appendChild(highlight);

        for (var i = 0, l = 8; i < l; i++) {
            var block = document.createElement("DIV");
            block.setAttribute("id", "fst-feedback-highlight-overlay-"+i);
            block.setAttribute("class", "fst-feedback-highlight-overlay");
            highlight_overlay.push(block);
            document.body.appendChild(block);
        }

        set_highlight_overlay(100, 100, 0, 0);
        set_highlight_overlay(146, 417, 379, 148);

        overlay.addEventListener("mousemove", onmousemove);
    };

    var onmousemove = function(e) {
        current_move = +(new Date());
        if (current_move - last_move < 50) { return; }
        last_move = current_move;

        overlay.style.display = "none";
        // highlight.style.display = "none";
        el = document.elementFromPoint(e.clientX, e.clientY);
        if (el.getAttribute("class") == "fst-feedback-highlight-overlay") {
            var _el = el;
            _el.style.display = "none";
            el = document.elementFromPoint(e.clientX, e.clientY);
            console.log(el);
            _el.style.display = "block";
        }
        overlay.style.display = "block";

        // highlight.style.display = "block";
        // highlight.style.height = (el.offsetHeight + 4) + "px";
        // highlight.style.width = (el.offsetWidth + 5) + "px";

        el_position = position(el);
        set_highlight_overlay(el_position["left"]-4, el_position["top"]-3, el.offsetWidth+5, el.offsetHeight+4);
        // highlight.style.left = (el_position["left"] - 4) + "px";
        // highlight.style.top = (el_position["top"] - 3) + "px";
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

    var set_highlight_overlay = function(x, y, w, h) {
        var cw = document.body.clientWidth, ch = document.body.clientHeight;
        set_element_metrics(highlight_overlay[0], 0, 0, x, y);
        set_element_metrics(highlight_overlay[1], x, 0, w, y);
        set_element_metrics(highlight_overlay[2], x+w, 0, cw-(x+w), y);
        set_element_metrics(highlight_overlay[3], 0, y, x, h);
        set_element_metrics(highlight_overlay[4], x+w, y, cw-(x+w), h);
        set_element_metrics(highlight_overlay[5], 0, y+h, x, ch-(y+h));
        set_element_metrics(highlight_overlay[6], x, y+h, w, ch-(y+h));
        set_element_metrics(highlight_overlay[7], x+w, y+h, cw-(x+w), ch-(y+h));
    };

    var set_element_metrics = function(element, x, y, w, h) {
        element.style.left     = x+"px";
        element.style.top      = y+"px";
        element.style.width    = w+"px";
        element.style.height   = h+"px";
    };

    document.addEventListener("DOMContentLoaded", onload);
})();