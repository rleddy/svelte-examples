<script>
	import Tabs from "svelte-nested-tabs"
	import CanDraw from "./CanDraw.svelte"
	import { set_drawing } from "./draw_model"
	import {component_mapper} from "./button_utils"

	export let name;


	let draw_control = set_drawing("test")
	function draw_stuff() {
		draw_control.command("clear_z")
		draw_control.add("rect",{ "thick" : 2, "line" : "black", "fill" : "rgba(100,200,220,0.9)", "points" : [10,10,20,20] })
		draw_control.add("circle",{ "thick" : 3, "line" : "red", "fill" : "rgba(200,200,120,0.6)", "points" : [30,30,10] })
		draw_control.add("ellipse",{ "thick" : 2, "line" : "blue", "fill" : "rgba(100,200,120,0.8)", "points" : [100,80,40,70] })
		draw_control.add("line",{ "thick" : 4, "line" : "black", "fill" : "rgba(100,50,50,0.9)", "points" : [30,30,100,80] })
		draw_control.add("polygon",{ "thick" : 3, "line" : "black", "fill" : "rgba(5,100,20,0.9)", "points" : [220,90,90], "sides" : 7 })
		draw_control.add("star",{ "thick" : 4, "line" : "navy", "fill" : "yellow", "points" : [90,220,90], "star_points" : 5, 
												"orient" : "edge", "radial_shift" : 0, "radius_multiplier" : 4 })

		draw_control.add("text",{ "thick" : 2, "line" : "black", "fill" : "rgba(220,100,20,0.7)", "points" : [200,250], 
									"text" : "Testing one and all", "font":  "bold 32px Arial",
									"textAlign" : "center", "textBaseline" : "middle"
								})
	}

	function reverse_stuff() {
		draw_control.command("reverse_redraw")		
	}

	let app_component_map = {
		"Tabs" : Tabs,
		"CanDraw" : CanDraw
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
					"panel" : "background-color:yellow",
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
			"l1_1" : false,
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


</script>

<main>
	<h1>Hello {name}!</h1> 
	<button on:click={draw_stuff} >draw stuff</button>
	<button on:click={reverse_stuff} >reverse stuff</button>
	<CanDraw height="460"  width="680" />
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