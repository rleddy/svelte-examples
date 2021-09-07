export function component_mapper(tab_tree,component_map) {
    if ( tab_tree.tab_panels ) {
        let sub_tree = tab_tree.tab_panels
        for ( let pdef in sub_tree ) {
            let panel = sub_tree[pdef]
            if ( panel ) {
                if ( panel.component ) {
                    let comp = component_map[panel.component]
                    if ( comp ) {
                        panel.component = comp
                    }
                }
                // recurse here
                component_mapper(panel.parameters,component_map)
            }
        }
    }
}
