function createBox()
{

    const boxcontainer = document.getElementById('boxContainer');
    const boxcount = document.getElementById('boxcount').value;
    const floorcount = document.getElementById('nooffloors').value;
    boxcontainer.innerHTML ='';
    const floorcontainer = document.getElementById('floorContainer');
   floorcount.innerHTML =''
   
    
    
    for(let i =0;i<floorcount;i++){
        const floor = document.createElement('div');
        floor.className = 'floor';
        floorcontainer.appendChild(floor);
    }
    for(let i=0;i<boxcount;i++){
        const box = document.createElement('div');
        box.className = 'box';
       
        
      
        boxcontainer.appendChild(box);
       

    }
}
