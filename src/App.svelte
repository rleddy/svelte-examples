<script>
	import Tabs from "svelte-nested-tabs"
	import WrapDraw from "./wrap_draw.svelte";
	import {component_mapper} from "./button_utils"
import { append } from "svelte/internal";

// https://github.com/nextapps-de/mikado
// https://github.com/nextapps-de
// http://microjs.com/#
// https://github.com/james2doyle/simplebinder/blob/master/simplebinder.js
//
/*

<form oninput="result.value=parseInt(x.value) + y.value">
		0<input type="range" id="x" value="75">100
  +<input type="text" id="y" value="alpha">
  =<output name="result" for="x y"></output>
</form>


*/

	export let name;


	let app_component_map = {
		"Tabs" : Tabs,
		"WrapDraw" : WrapDraw
	}


	let tab_def = {
		"style" : {
			"header" : "background-color:grey",
			"button" : {
				"active" : "color:red"
			}
		},
		"tab_list" : [
			{ 
				"id" : "l1_1",
				"name" : "tutorial",
				"content" : "too much",
				"style" : {
					"panel" : "background-color:white",
					"button" : {
						"active" : "color:purple"
					}
				}
			},
			{ 
				"id" : "l1_2",
				"name" : "example",
				"content" : "too much",
				"style" : {
					"panel" : "background-color:yellow"
				}
			},
			{ 
				"id" : "l1_3",
				"name" : "colors",
				"content" : "superfluous...",
				"style" : {
					"panel" : "background-color:snow"
				}
			}
		],
		"tab_panels" : {
			"l1_1" : {
				"component" : "WrapDraw",
				"parameters" : {
					"height" : "460",
					"width" : "680"
				}
			},
			"l1_2" : {
				"component" : "Tabs",
				"parameters" : {
					"style" : {
						"header" : "background-color:#FEFEFF",
						"panel" : "height:80%;background-color:#FEFEFF",
						"button" : {
							"inactive" : "background-color:#FFFFEA;color:blue"
						} 
					},
					"tab_list" : [
									{ 
										"id" : "l2_1",
										"name" : "jumping jack",
										"content" : "bouncy",
										"style" : {
											"button" : {
												"active" : "color:magenta"
											}
										}
									},
									{ 
										"id" : "l2_2",
										"name" : "nick nack",
										"content" : "chubby",
										"style" : {
											"button" : {
												"inactive" : "background-color:#FFEAFF"
											}
										}
									}
								],
					"tab_panels" : {
						"l2_1" : false,
						"l2_2" : false
					},
				}
			}
		}
	}


	component_mapper(tab_def,app_component_map)


	let tab_top = null

	async function decryptor(txt) {
		return txt
	}

	let svclass = eval('SvelteComponent')
	let app = append //eval('append')
	let det = eval('detach')
	let sne = eval('safe_not_equal')
	let init_f = eval('init')
	let elel_f = eval('element')
	let insert_f = eval('insert')
	let noop_f = eval('noop')
	let attr_f = eval('attr')
	async function load_new_componet(evt) {
		//
		try {
			let moduleJS = await fetch('http://localhost:8080/addable.js')
			moduleJS = await moduleJS.text()
			
			let MyComponent = false
			let ClassDefCode =  moduleJS

			ClassDefCode = await decryptor(ClassDefCode)

			let f = new Function('SvelteComponent','init','append','detach','safe_not_equal','element','insert','noop','attr',ClassDefCode)
			MyComponent = f(svclass,init_f,app,det,sne,elel_f,insert_f,noop_f,attr_f)
//
			app_component_map["simple"] = MyComponent
			tab_def.tab_panels.l1_3 =  {
					"component" : MyComponent,
					"parameters" : {
						"my_var" : "Well! Wha'd'ya know!!!"
					}
			}

		} catch(e) {
			console.log(e)
		}

	}

	async function load_new_component_2() {
		let p_module = await import('http://localhost:8080/pure.js')

		app_component_map["pur"] = p_module
		tab_def.tab_panels.l1_2.tab_panels.l2_1 =  {
					"component" : p_module,
					"parameters" : {
						"my_var" : "Well! This works, too!!!  But does not decrypt"
					}
		}

	}

</script>

<main>
	<h1>Hello {name}!</h1> 
	<!-- <CanDraw bind:selected={can_draw_selected} bind:mouse_to_shape={shape_index} height="460"  width="680" /> -->
	<button on:click={load_new_componet}>load component</button>
	<button on:click={load_new_component_2}>load_new_component_2</button>
	<div class="tab-container" >
		<Tabs {...tab_def} />
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}


	.tab-container {
		text-align: left;
	}


</style>