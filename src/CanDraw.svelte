<script>
    import {g_commander} from "./draw_model"
    import {DrawTools} from "./do_draw"


    export let height = 460
    export let width = 680
    export let selected = false
    export let mouse_to_shape = false

    let the_canvas
    let ctxt = false
    let drawit = false
    $: if ( the_canvas ) {
        ctxt = the_canvas.getContext("2d");
        drawit = new DrawTools(ctxt,width,height)
    }

    g_commander.subscribe((command) => {
        if ( !drawit ) return
        if ( !ctxt && the_canvas )  {
            ctxt = the_canvas.getContext("2d");
            drawit.setContext(ctxt)
        }
        //
        let pars = command.pars
        if ( command.cmd !== undefined ) {
            let cmd = command.cmd
            drawit[cmd](pars)
        } else if ( command.command !== undefined  ) {
            let cmd = command.command
            drawit[cmd](pars)
        } else if ( command.update !== undefined ) {
            drawit.update(pars)
        } else if ( command.searching !== undefined ) {
            mouse_to_shape = drawit.mouse_in_shape(pars)
        }

        selected = drawit.selected_object()
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