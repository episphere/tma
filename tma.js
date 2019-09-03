tma = function(img){
    tma.img=img||document.getElementById('tmaImg')
    console.log('tma.js loaded')
    if(tma.img){
        // ini 
        tma.getImgData()
        tma.doMask()
        tma.cvWriteMask()
        tma.maskEdge=tma.edge()
        tma.align()
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
    // tma.img.parentElement.appendChild(document.createElement('br')) // to make sure they are placed in different lines
    tma.img.parentElement.appendChild(tma.cv)
    tma.align()
}

tma.doMask=function(fun,dt){ // build binary mask for dt or for tma.data at tma.mask if dt is not provided
    fun=fun||(x=>x.map(x=>(255-x)).reduce((a,b)=>a+b)>100)  // default function thresholds sum of rgba at 100
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
    rgba1 = rgba1 || [0,255,0,100] // rgba assigned to segmented pixel
    mask=mask.map(xx=>xx.map (x=> x ? rgba1 : rgba0)) // create rgba mask
    const imData = tma.data2imdata(mask)
    tma.ctx.putImageData(imData,0,0)
    //return imData
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

tma.edge=function(mask){  // edges a boolean mask
    if((!mask)&&(!tma.mask)){tma.doMask()} // prepare default mask if it looks like it will be needed
    mask = mask || tma.mask // default
    const ii=jj=[-1,0,1]
    const n = mask.length
    const m = mask[0].length
    const edgeMask = mask.map((xx,i)=>xx.map((x,j)=>{
        let c=0
        ii.forEach(xi=>jj.forEach(xj=>{
            let ni=xi+i
            let nj=xj+j
            ni = ni>0 ? ni : 0
            ni = ni<n ? ni : n-1
            nj = nj>0 ? nj : 0 
            nj = nj<m ? nj : m-1
            c+=mask[ni][nj]
        }))
        return (c>3 && c<7)
    }))
    tma.cvWriteMask(edgeMask,[0,0,0,0],[255,0,0,100])
    return edgeMask
}

tma.align=function(){
    const pos = tma.img.getBoundingClientRect()
    tma.cv.style.position='absolute'
    tma.cv.style.top=pos.top
    tma.cv.style.left=pos.left

    //tma.img.getBoundingClientRect().top
    //tma.cv.style.left=0//tma.img.getBoundingClientRect().left   
}


// window.onload=(_=>{tma()})