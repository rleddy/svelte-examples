const svelte = require('svelte/compiler');
const fs = require('fs')

let src_file = process.argv[2]
//
console.log(src_file)

let source = fs.readFileSync(src_file).toString()

const result = svelte.compile(source, {
    "name" : "MyTester"
});


console.log(result.js.code)