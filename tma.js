tma = function(img){
    tma.img=img||document.getElementById('tmaImg')
    console.log('tma.js loaded')
    if(tma.img){
        // ini 
        tma.getImgData()
        //tma.doMask()
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

tma.doMask=function(fun,dt){ // build binary mask for dt or for tma.data at tma.mask if dt is not provided
    fun=fun||(x=>x.reduce((a,b)=>(255-a)+(255-b))<100)  // default function thresholds sum of rgba at 100
    if(dt){
        return dt.map(xx=>xx.map(fun))
    } else {
        tma.mask=tma.data.map(xx=>{
            return xx.map(fun)
        })
        return 'boolean mask at tma.mask'
    }   
}

tma.cvWriteMask=function(mask,rgba0,rgba1){ // write boolean mask onto canvas 
    if((!mask)&&(!tma.mask)){tma.doMask()} // prepare default mask if it looks like it will be needed
    mask = mask || tma.mask // default mask
    rgba0 = rgba0 || [100,0,0,0] // rgba asigned to pixel not segmented
    rgba1 = rgba1 || [0,100,0,150] // rgba assigned to segmented pixel
    mask=mask.map(xx=>xx.map (x=> x ? rgba0 : rgba1)) // create rgba mask
    const imData = tma.data2imdata(mask)
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