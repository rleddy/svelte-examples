
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


class ZList {
    constructor() {
        this.z_list = []
        this.redrawing = false
    }

    push(pars) {
        if ( !(this.redrawing) ) this.z_list.push(pars)
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
}

export class DrawTools extends ZList {

    //
    constructor(ctxt) {
        super()
        this.ctxt = ctxt
    }

    setContext(ctxt) {
        this.ctxt = ctxt
    }

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

    rect(pars) {
        if ( !pars ) return
        if ( this.ctxt ) {
            this.push({ "cmd" : "rect", "pars" :pars })
            let ctxt = this.ctxt
            let [x1,y1,w,h] = pars.points
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
        }
    }

    circle(pars) {
        if ( !pars ) return
        this.push({ "cmd" : "circle", "pars" :pars })
        if ( this.ctxt ) {
            let ctxt = this.ctxt
            let [centerX, centerY, radius] = pars.points
            ctxt.beginPath();
            ctxt.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            this._lines_and_fill(ctxt,pars)
        }
    }


    ellipse(pars) {
        if ( !pars ) return
        this.push({ "cmd" : "ellipse", "pars" :pars })
        if ( this.ctxt ) {
            let ctxt = this.ctxt
            let [centerX, centerY, rad1, rad2] = pars.points
            ctxt.beginPath();
            ctxt.ellipse(centerX, centerY, rad1, rad2, Math.PI / 4, 0, 2 * Math.PI);
            this._lines_and_fill(ctxt,pars)
        }
    }

    line(pars) {
        if ( !pars ) return
        this.push({ "cmd" : "line", "pars" :pars })
        if ( this.ctxt ) {
            let ctxt = this.ctxt
            let [x1,y1,x2,y2] = pars.points
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


    text(pars) {

        if ( !pars ) return
        this.push({ "cmd" : "text", "pars" :pars })
        if ( this.ctxt ) {
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
        }

    }


    polygon(pars) {
        if ( !pars ) return
        this.push({ "cmd" : "polygon", "pars" :pars })
        if ( this.ctxt ) {
            let ctxt = this.ctxt
            let [cx,cy,rad] = pars.points
            let sides = pars.sides

            ctxt.beginPath();
            let region = new Path2D();
            //
            const edg = (rad / 1.5);
            const inradius = (edg / 2) * cot(Math.PI / sides);
            const circumradius = inradius * sec(Math.PI / sides);
            let prev_x = 0, prev_y = 0 
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
            }
            region.closePath()
            this._lines_and_fill(ctxt,pars,region)
        }

    }

    star(pars) {
        if ( !pars ) return
        this.push({ "cmd" : "star", "pars" :pars })
        if ( this.ctxt ) {
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
                }
            }
            region.closePath()
            this._lines_and_fill(ctxt,pars,region)
        }
    }

    redraw() {
        this.redrawing = true
        for ( let op of this.z_list ) {
            let cmd = op.cmd
            let self = this
            self[cmd](op.pars)
        }
        this.redrawing = false
    }


    reverse_redraw() {
        this.reverse()
        this.redraw()
    }
    //

}
