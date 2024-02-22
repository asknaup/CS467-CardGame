let collection = null;

fetch('/cards')
.then(response => { 
    collection = response.json();
    console.log(collection);
});

