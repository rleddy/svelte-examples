<script>
    import SubComponent from 'subber.svelte'
    let my_var = "this is a test"

    let subber = "You wish!"
    
</script>
<div>
    <span style="color:limegreen;font-weight:bold;font-size:x-large">{my_var}</span>
    <SubComponent {subber} />
</div>
<style>
    div {
        border : solid 2x red;
        background-color: deepskyblue;
        width: 300px;
        height: 200px;
    }
</style>