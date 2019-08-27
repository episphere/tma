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
    tma.ctx.drawImage(tma.img,0,0)
    let dd = tma.ctx.getImageData(0,0,tma.cv.width,tma.cv.height)
    let n = tma.cv.height
    let m = tma.cv.width
    let ii=[...Array(n)]
    let jj=[...Array(m)]
    tma.data = ii.map(i=>{
        return jj.map(j=>{
            let ij=(i*m+j)*4;
            return [dd[ij],dd[ij+1],dd[ij+2],dd[ij+3]]
        })
    })
    //debugger
}



window.onload=(_=>{tma()})