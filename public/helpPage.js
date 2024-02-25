var FAQ = document.getElementById('FAQ')
var liElements = []
for(let index = 0; index < FAQ.children.length; index++){
    //console.log(FAQ.children[index])
    liElements.push(FAQ.children[index])
}
for(const liElement of liElements){
    liElement.children[0].addEventListener('click', () => {
        if(liElement.children[1].style.display == "none"){
            liElement.children[1].style.display = "block";
        }else{
            liElement.children[1].style.display = "none";
        }
    });
}

