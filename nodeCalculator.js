// coords = list of elements in [x,y] notation
function test(master,every,coord){
    // how many boosts each node recieves
    // if every node recieves 2 or more boosts then you have optimal boost nodes 
    let counts = []
    for(let i = 0;i<every.length;i++){
        counts.push(0)
    }
    // tests our list of coordinates
    for (let i = 0; i<coord.length;i++){
        // use the coordinates to find what it is refering to in master aka sorted
        temp = master[coord[i][0]][coord[i][1]]
        for (let j = 0; j<every.length;j++){
            for (let k = 0; k<temp.length;k++){
                // compare and count
                if (every[j].trim() === temp[k].trim())
                    counts[j]+=1
            }
        }    
    }
    // check the validity 
    for (let i = 0; i<counts.length;i++){
        if (counts[i] < 2)
            return false
    }
    // optimal boost node
    return true
}
// given our coord array of structure [[x,y],...]
// we itterate the x portion by 1 and test to see if that next combination is valid
// sorted a list of "buckets" of nodes more detail in the main function
// every a list of all useful nodes parts
// outerCheck = test1 in the python code
function outterCheck(coords,sorted,every){
    // max is the list of maxes for the y aka the length of the buckets in position sorted[x]
    // max1 is the list of maxes for the x's should me sorted.length,sorted.length-1,... reversed
    let max = []
    let max1 = []
    // initializing max and max1
    for(let i = 0; i<coords.length;i++){
        max.push((sorted[coords[i][0]]).length)
        max1.push(sorted.length)
    }
    for (let i = 0; i<max.length;i++){
        max1[max1.length-i-1] -= i
    }
    if (innerCheck(sorted,max,coords,every))
        return true
    // you can think of this while as a bunch of nested for loops
    while(itterate(coords,max1,0)!=false){
        // max needs to change every time because the "buckets" do not have equal lengths
        max = []
        for(let i = 0; i<coords.length;i++){
            max.push(sorted[coords[i][0]].length)
        }
        // iterates the y coordinates instead of the x coordinates
        if (innerCheck(sorted,max,coords,every))
            return true
        // resets coords when it is done
        for(let i = 0; i<coords.length;i++){
            coords[i][1] = 0
        }
    }
    return false
}
// what caused me 2 hours of pain
// coord is coordinate array of structure [[x,y],...]
// max is the max that x or y can go to depending on i
// i tells us whether to look at x or y
function itterate(coord,max,i){
    // base case of the recursion
    if(coord.length ===0){
        return false
    }
    // the itteration
    coord[coord.length-1][i]+=1
    // carrying over the 1 like when you add 1 to 9999999999 and you have to recursively carry over
    if (coord[coord.length-1][i]>=max[max.length-1]){
        coord[coord.length-1][i] = 0
        // the recursive (inductive) step
        let boolz = true && itterate(coord.slice(0,coord.length-1),max.slice(0,max.length-1),i)
        if (i == 0 && coord.length >1 && coord[coord.length-1][i]<= coord[coord.length-2][i]){
            coord[coord.length-1][i] = coord[coord.length-2][i]+1
        }
        return boolz
    }
    return true
}
// given our coord array of structure [[x,y],...]
// we itterate the y portion by 1 and test to see if that next combination is valid
// sorted a list of "buckets" of nodes more detail in the main function
// every a list of all useful nodes parts
// max is a list of the lengths of the "buckets" in sorted
function innerCheck(sorted,max,coord,every){
    // it isnt useful for when we change y but it is very helpful when we itterate x
    // for y we always return to 0
    if (test(sorted,every,coord))
        return true
    // the itterate function was my solution to using 3-9 nested for loops
    while(itterate(coord,max,1)){
        if (test(sorted,every,coord))
            return true
    }
    return false
}
// if you ever used python this is just a modified in opperator 
function inside(variable,array){
    for(let i = 0; i<array.length;i++){
        if (variable.trim() == array[i].trim()){
            return true
        }
    }
    return false
}
var nodes = document.getElementById('optimal');
var trios = document.getElementById('trio');
var out = document.getElementById('output');
var calc = document.getElementById('calc');
function main(trio,node){
    // parse input into an array of strings
    let lines = trio.value.split('\n')
    let op = node.value.split(",")
    for(let i = 0; i<lines.length;i++){
        lines[i] = lines[i].toLowerCase()
        lines[i] = lines[i].trim()
        lines[i] = lines[i].split(",")
    }
    // you can think of sorted as an array of buckets
    let sorted = []
    for (let i = 0; i<op.length;i++){
        let empty = []
        for (let j = 0; j<lines.length;j++){
            // nodes are sorted into buckets based off their starting value
            // similar to how radix sort works but we only focus on the first value
            if (lines[j][0] === op[i]){
                // remove nodes that do not have 3 optimal parts
                if(inside(lines[j][1],op) && inside(lines[j][2].trim(),op)){
                    empty.push(lines[j])
                }
            }
        }
        sorted.push(empty)
    }
    
    // lowest number
    let optimal = Math.ceil((op.length/3)*2)
    for(let i = 0; i<sorted.length;i++){
        if(sorted[i].length === 0){
            sorted.splice(i,1)
        }
    }    
    // leng holds the length of each "bucket" in sorted 
    let leng = []
    for(let i = 0; i< sorted.length;i++){
        leng.push(sorted[i].length)
    }
    // curr is a list of coordinates [x,y] of nodes in sorted
    // this is what we test
    let curr = []
    for(let i = 0; i< optimal;i++){
        curr.push([i,0])
    }
    // clear the output area
    out.innerHTML = ""

    // impossible case
    if(sorted.length < optimal){
        out.appendChild(document.createTextNode("impossible"))
        return 
    }
    // start of the brute force
    if (outterCheck(curr,sorted,op)){
        //print out the results
        for(let i = 0; i< curr.length;i++){        
            out.appendChild(document.createTextNode(sorted[curr[i][0]][curr[i][1]]))
            out.appendChild(document.createElement("br"))
        }
        return
    }
    out.appendChild(document.createTextNode("impossible"))
    return 
}
calc.addEventListener('click', function(evt) {
    main(trios,nodes)
})