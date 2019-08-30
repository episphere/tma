tma = function(img){
    tma.img=img||document.getElementById('tmaImg')
    console.log('tma.js loaded')
    if(tma.img){
        // ini 
        tma.getImgData()
        tma.doMask()
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
    //tma.align()
}

tma.doMask=function(fun){ // build binary mask for tma.data at tma.mask
    fun=fun||(x=>x.reduce((a,b)=>(255-a)+(255-b))<100)  // default function thresholds sum of rgba at 100
    tma.mask=tma.data.map(xx=>{
        return xx.map(fun)
    })
    return 'boolean mask at tma.mask'
}

tma.cvWriteMask=function(a){ // write mask onto canvas
    a=a||150 // transparency
    const msk=tma.mask.map(xx=>xx.map (x=> x ? [100,0,0,0] : [0,100,0,150])) // rgba mask
    //const imData = tma.ctx.createImageData(tma.cv.height,tma.cv.width)
    const imData = tma.data2imdata(msk)
    tma.ctx.putImageData(imData,0,0)
}

tma.data2imdata=function(dt){ // conversta matrix data to image vector
    dt=dt||tma.data
    const n = dt.length
    const m = dt[0].length
    const imData = tma.ctx.createImageData(m,n) // notice reverse index order from matlab
    dt.forEach((xx,i)=>{xx.forEach((x,j)=>{
        let ij = i*m*4+j*4
        imData.data[ij]=x[0]
        imData.data[ij+1]=x[1]
        imData.data[ij+2]=x[2]
        imData.data[ij+3]=x[3]
    })})
    return imData
}

tma.align=function(){
    tma.cv.style.position='absolute'
    tma.cv.style.top=tma.img.getBoundingClientRect().top
    tma.cv.style.left=tma.img.getBoundingClientRect().left
    //tma.cv.style.width=tma.img.style.width="100%"
}



// window.onload=(_=>{tma()})