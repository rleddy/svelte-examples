<script>
    import {g_commander} from "./draw_model"
    import {DrawTools} from "./do_draw"


    export let height = 460
    export let width = 680

    let the_canvas
    let ctxt = false
    let drawit = false
    $: if ( the_canvas ) {
        ctxt = the_canvas.getContext("2d");
        drawit = new DrawTools(ctxt)
    }

    g_commander.subscribe((command) => {
        if ( !ctxt && the_canvas )  {
            ctxt = the_canvas.getContext("2d");
            drawit.setContext(ctxt)
        }
        //
        let pars = command.pars
        let draw_cmd = command.cmd
        if ( draw_cmd === undefined ) {
            let cmd = command.command
            if ( cmd ) {
                if ( !drawit ) return
                drawit[cmd](pars)
            }
        } else {
            if ( !drawit ) return
            drawit[draw_cmd](pars)
        }
    })

</script>
<div>
<canvas  bind:this={the_canvas} class="canvas-viz" height='{height}px'  width='{width}px' >
</canvas>
</div>
<style>


	.canvas-viz {
		border: solid 1px black;
	}

</style>