import { writable } from 'svelte/store';



export let g_commander = writable(false)


class Layer {
    constructor() {
        this.z_list = []
    }
}

class Drawing {

    constructor() {
        this.layers = []
    }

    add(shape,parameters) {
        g_commander.update( cmd => {
            let command = {
                "cmd" : shape,
                "pars" : parameters
            }
            return command
        })
    }

    command(action,parameters) {
        g_commander.update( cmd => {
            let command = {
                "command" : action,
                "pars" : parameters
            }
            return command
        })
    }

    update(parameters) {
        g_commander.update( cmd => {
            let command = {
                "update" : true,
                "pars" : parameters
            }
            return command
        })
    }

    searching(parameters) {
        g_commander.update( cmd => {
            let command = {
                "searching" : true,
                "pars" : parameters
            }
            return command
        })
    }
}

let g_drawing_set = {
    "current_drawing" : null,
    "current_drawing_name" : "",
    "drawings" : {}
}


export function set_drawing(name) {
    if ( g_drawing_set.current_drawing !== null ) {
        g_drawing_set.drawings[g_drawing_set.current_drawing_name] = g_drawing_set.current_drawing
    }
    g_drawing_set.current_drawing_name = name
    g_drawing_set.current_drawing = new Drawing()
    return g_drawing_set.current_drawing
}