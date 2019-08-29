tma = function(img){
    tma.img=img||document.getElementById('tmaImg')
    console.log('tma.js loaded')
    if(tma.img){
        // ini 
        tma.getImgData()
    }
}

tma.getImgData=function(){
    tma.cv=document.createElement('canvas')
    tma.cv.width=tma.img.width
    tma.cv.height=tma.img.height
    tma.ctx=tma.cv.getContext('2d')
    tma.ctx.drawImage(tma.img,0,0) // write image data to canvas
    let dd = tma.ctx.getImageData(0,0,tma.cv.width,tma.cv.height).data
    let n = tma.cv.height
    let m = tma.cv.width
    let ii=[...Array(n)].map((_,x)=>x)
    let jj=[...Array(m)].map((_,x)=>x)
    tma.data = ii.map(i=>{
        return jj.map(j=>{
            let ij=(i*m+j)*4;
            return [dd[ij],dd[ij+1],dd[ij+2],dd[ij+3]]
        })
    })
    // place canvas on top of image
    tma.img.parentElement.appendChild(tma.cv)
    //tma.img.hidden=true // hide original img element
    /*
    
    */
}

tma.align=function(){
    tma.cv.style.position='absolute'
    tma.cv.style.top=tma.img.getBoundingClientRect().top
    tma.cv.style.left=tma.img.getBoundingClientRect().left
    //tma.cv.style.width=tma.img.style.width="100%"
}



// window.onload=(_=>{tma()})