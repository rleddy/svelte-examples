
/**
 * @param {Float} n angle
 * @return {Float} cotangeante
 */
const cot = (n) => 1 / Math.tan(n);

/**
 * @param {Float} n angle
 * @returns {Float} sec
 */
const sec = (n) => 1 / Math.cos(n);

const circle_bounding_rect = (centerX, centerY, radius) => {
    let left = centerX  - radius
    let top = centerY - radius
    let width = 2*radius
    let height = 2*radius
    return [left,top,width,height]
}

const ellipse_bounding_rect = (centerX, centerY, rad1, rad2) => {
    let left = centerX  - rad1
    let top = centerY - rad2
    let width = 2*rad1
    let height = 2*rad2
    return [left,top,width,height]
}


const text_box = (ctxt,txt) => {
    const textMetrics = ctxt.measureText(txt);
    let w = Math.abs(textMetrics.actualBoundingBoxLeft) +
            Math.abs(textMetrics.actualBoundingBoxRight)
    let top = textMetrics.actualBoundingBoxAscent
    let h = top + Math.abs(textMetrics.actualBoundingBoxDescent)
    return [w,h,top]
}

const update_bounds = (descriptor,x_up,y_up) => {
    if ( descriptor ) {
        let [x,y,w,h] = descriptor.bounds
        if ( x_up < x ) {
            w += x - x_up
            x = x_up
        } else if ( x_up > (x + w) ) {
            w = x_up - x
        }
        if ( y_up < y ) {
            h += y - y_up
            y = y_up
        } else if ( y_up > (y + h) ) {
            h = y_up - y
        }
        descriptor.bounds = [x,y,w,h]
    }
}

class ZList {

    // 
    constructor() {
        this.z_list = []
        this.redrawing = false
        this.selected = 0
        this._selected_object = false
        this._redraw_descriptor = false
    }

    select(ith) {
        if ( (ith >= 0) && (ith < this.z_list.length) ) {
            this.selected = ith
        }
    }

    selected_object() {
        if ( (this.selected >= 0) && (this.selected < this.z_list.length) ) {
            this._selected_object = this.z_list[this.selected]
            return this._selected_object
        }
        return false
    }

    selected_to_bottom() {
        if ( (this.selected >= 0) && (this.selected < this.z_list.length )) {
            let el = this.z_list[this.selected]
            this.z_list.splice(this.selected,1)
            this.z_list.unshift(el)
            this.selected = 0
        }
    }


    selected_to_top() {
        if ( (this.selected >= 0) && (this.selected < this.z_list.length )) {
            let el = this.z_list[this.selected]
            this.z_list.splice(this.selected,1)
            this.z_list.push(el)
            this.selected = this.z_list.length - 1
        }
    }


    push(pars) {
        if ( !(this.redrawing) ) {
            this.z_list.push(pars)
            this.selected = (this.z_list.length - 1)
        }
    }

    pop() {
        this.z_list.pop()
    }

    reverse() {
        let old_z = this.z_list
        this.z_list = old_z.reverse()
    }

    clear_z() {
        this.z_list = []
    }

    z_top() {
        return (this.z_list.length - 1)
    }
}

export class DrawTools extends ZList {

    //
    constructor(ctxt,width,height) {
        super()
        this.ctxt = ctxt
        this.width = width
        this.height = height
    }

    setContext(ctxt) {
        this.ctxt = ctxt
    }

    clear() {
        if ( this.ctxt ) {
            this.ctxt.clearRect(0,0,this.width,this.height)
        }
    }

    clear_all() {
        this.clear_z()
        this.clear()
    }

    //
    _lines_and_fill(ctxt,pars,path) {
        if ( pars.fill !== "none" ) {
            ctxt.fillStyle = pars.fill;
            if ( path ) ctxt.fill(path,"evenodd");
            else ctxt.fill();
        }
        if ( pars.line !== "none" ) {
            ctxt.lineWidth = pars.thick;
            ctxt.strokeStyle = pars.line;
            if ( path ) ctxt.stroke(path);
            else ctxt.stroke();
        }
    }
    
    
    _descriptor(shape,pars) {
        if ( this._redraw_descriptor ) return this._redraw_descriptor
        else {
            let descriptor = { "cmd" : shape, "pars" : pars, "bounds" : [] }
            this.push(descriptor)
            return descriptor    
        }
    }


    text_rect(text,x,y) {
        let ctxt = this.ctxt
        if ( ctxt ) {
            let [w,h,top] = text_box(ctxt,text)
            return [x,y-top,w,h]
        }
        return descriptor.bounds
    }


     //
     rect(pars) {
        if ( !pars ) return
        if ( this.ctxt ) {
            let descriptor = this._descriptor("rect",pars)
            let ctxt = this.ctxt
            let [x1,y1,w,h] = pars.points

            const rect_P = new Path2D();
            rect_P.rect(x1,y1,w,h)
            descriptor.path = rect_P
            //
            if ( pars.line && (pars.line !== "none") ) {
                ctxt.lineWidth = pars.thick;
                ctxt.strokeStyle = pars.line;
                ctxt.strokeRect(x1,y1,w,h)
            }
            if ( pars.fill && (pars.fill !== "none") ) {
                ctxt.fillStyle = pars.fill;
                ctxt.fillRect(x1,y1,w,h);
            }
            descriptor.bounds = [x1,y1,w,h]
        }
    }

    //
    circle(pars) {
        if ( !pars ) return
        if ( this.ctxt ) {
            let descriptor = this._descriptor("circle",pars)
            let ctxt = this.ctxt
            let [centerX, centerY, radius] = pars.points
            ctxt.beginPath();
            ctxt.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            this._lines_and_fill(ctxt,pars)
            descriptor.bounds = circle_bounding_rect(centerX, centerY, radius)
        }
    }


    //
    ellipse(pars) {
        if ( !pars ) return
        if ( this.ctxt ) {
            let descriptor = this._descriptor("ellipse",pars)
            let ctxt = this.ctxt
            let [centerX, centerY, rad1, rad2, rotate] = pars.points
            ctxt.beginPath();
            ctxt.ellipse(centerX, centerY, rad1, rad2, rotate, 0, 2 * Math.PI);
            this._lines_and_fill(ctxt,pars)
            descriptor.bounds = ellipse_bounding_rect(centerX, centerY, rad1, rad2)
        }
    }

    //
    line(pars) {
        if ( !pars ) return
        if ( this.ctxt ) {
            let descriptor = this._descriptor("line",pars)
            let ctxt = this.ctxt
            let [x1,y1,x2,y2] = pars.points
            descriptor.bounds = [x1,y1,(x2 - x1),(y2 - y1)]
            //
            if ( pars.line !== "none" ) {
                ctxt.beginPath();
                ctxt.lineWidth = pars.thick;
                ctxt.strokeStyle = pars.line;
                ctxt.moveTo(x1,y1)
                ctxt.lineTo(x2,y2)
                ctxt.stroke()
            }

        }
    }


    //
    text(pars) {
        if ( !pars ) return
        if ( this.ctxt ) {
            let descriptor = this._descriptor("text",pars)
            let ctxt = this.ctxt
            let [x,y] = pars.points
            let text = pars.text
            //
            ctxt.beginPath();
            ctxt.font = pars.font;
            ctxt.textAlign = pars.textAlign;
            ctxt.textBaseline = pars.textBaseline;
            //
            if ( pars.line && (pars.line !== "none") ) {
                ctxt.lineWidth = pars.thick;
                ctxt.strokeStyle = pars.line;
                ctxt.strokeText(text, x, y);
            }
            if ( pars.fill && (pars.fill !== "none") ) {
                ctxt.fillStyle = pars.fill;
                ctxt.fillText(text, x, y);
            }
            descriptor.bounds = this.text_rect(text,x,y)
        }

    }


    //
    polygon(pars) {
        if ( !pars ) return
        if ( this.ctxt ) {
            let descriptor = this._descriptor("polygon",pars)
            let ctxt = this.ctxt
            let [cx,cy,rad] = pars.points
            let sides = pars.sides

            ctxt.beginPath();
            let region = new Path2D();
            //
            const edg = (rad / 1.5);
            const inradius = (edg / 2) * cot(Math.PI / sides);
            const circumradius = inradius * sec(Math.PI / sides);
            //
            for (let s = 0; sides >= s; s++) {
                const angle = (2.0 * Math.PI * s) / sides;
                let x = circumradius * Math.cos(angle) + cx;
                let y = circumradius * Math.sin(angle) + cy;
                //
                if ( s == 0 ) {
                    region.moveTo(x,y)
                } else {
                    region.lineTo(x,y)
                }
                update_bounds(descriptor,x,y)
            }
            region.closePath()
            this._lines_and_fill(ctxt,pars,region)
        }

    }

     //
     star(pars) {
        if ( !pars ) return
        if ( this.ctxt ) {
            let descriptor = this._descriptor("star",pars)
            let ctxt = this.ctxt
            let [cx,cy,rad] = pars.points
            let point = pars.star_points
            const orient = pars.orient
            const radialshift = pars.radial_shift
            const radius_multiplier = pars.radius_multiplier
            //
            const circumradius = rad / 1.5;
            const inradius = circumradius / radius_multiplier;

            ctxt.beginPath();
            let region = new Path2D();

            for (let s = 0; point >= s; s++) {
                let angle = 2.0 * Math.PI * (s / point);
                if (orient === "point") {
                  angle -= Math.PI / 2;
                } else if (orient === "edge") {
                  angle = angle + Math.PI / point - Math.PI / 2;
                }
    
                let x = circumradius * Math.cos(angle) + cx;
                let y = circumradius * Math.sin(angle) + cy;

                if ( s == 0 ) {
                    region.moveTo(x,y)
                } else {
                    region.lineTo(x,y)
                }
                update_bounds(descriptor,x,y)

                if (!isNaN(inradius)) {
                  angle = 2.0 * Math.PI * (s / point) + Math.PI / point;
                  if (orient === "point") {
                    angle -= Math.PI / 2;
                  } else if (orient === "edge") {
                    angle = angle + Math.PI / point - Math.PI / 2;
                  }
                  angle += radialshift;
    
                  x = inradius * Math.cos(angle) + cx;
                  y = inradius * Math.sin(angle) + cy;
    
                  region.lineTo(x,y)
                  update_bounds(descriptor,x,y)
                }
            }
            region.closePath()
            this._lines_and_fill(ctxt,pars,region)
        }
    }

     //
     redraw() {
        this.redrawing = true
        let n = this.z_list.length
        for ( let i = 0; i < n; i++ ) {
            let op = this.z_list[i]
            this._redraw_descriptor = op
            let cmd = op.cmd
            let self = this
            self[cmd](op.pars)
            this._redraw_descriptor = false
        }
        this.redrawing = false
    }


    //
    reverse_redraw() {
        this.reverse()
        this.redraw()
    }

    select_top(pars) {
        let top = this.z_top()
        if ( top >= 0 ) super.select(top)
    }

    select_bottom(pars) {
        let top = this.z_top()
        if ( top >= 0 ) super.select(0)
    }

    select(pars) {
        if ( !pars ) return
        let i = pars.select
        super.select(i)
    }

    //
    send_bottom(pars) {
        if ( !pars ) return
        let i = pars.select
        if ( i === false ) {
            i = this.selected
        }
        super.select(i)
        this.selected_to_bottom()
        this.clear()
        this.redraw()
    }

    //
    send_top(pars) {
        if ( !pars ) return 
        let i = pars.select
        if ( i === false ) {
            i = this.selected
        }
        super.select(i)
        this.selected_to_top()
        this.clear()
        this.redraw()
    }

    update(pars) {
        let selected = this.selected_object()
        if ( selected ) {
            this.redrawing = true
            selected.pars = pars
            this.clear()
            this.redraw()
            this.redrawing = false
        }
    }

    mouse_in_shape(pars) {
        if ( !pars ) return
        if ( this.ctxt ) {
            let ctxt = this.ctxt
            let [x,y] = pars.mouse_loc
            this.redrawing = true
            let n = this.z_list.length
            for ( let i = 0; i < n; i++ ) {
                let path = this.z_list[i].path
                if ( path ) {
                    if ( ctxt.isPointInPath(path, x, y) ) {
                        return i
                    }
                }
            }
            this.redrawing = false
        }
        return false
    }

}
