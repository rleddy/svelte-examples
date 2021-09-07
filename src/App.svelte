<script>
	import Tabs from "svelte-nested-tabs"
	import {component_mapper} from "./button_utils"

	export let name;


	let app_component_map = {
		"Tabs" : Tabs
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
				"content" : "not much",
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