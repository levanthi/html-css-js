var items = [...document.querySelectorAll('.price-item')]

items.forEach(item=>{
    item.addEventListener('click',()=>
    {
        if(!item.classList.contains('active'))
        {
            items.forEach(function(value)
            {
                if(value.classList.contains('active'))
                {
                    value.classList.remove('active')
                }
            })
            item.classList.add('active');
        }
    })
})
