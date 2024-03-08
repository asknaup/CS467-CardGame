async function collectionSelectHandler(collectionSelect){
    let collectionKey = parseInt(collectionSelect.value);
    userObj.currCollectId = collectionKey;
    var collectionLoadingTitle = document.getElementById("collectionLoadingTitle");
    collectionLoadingTitle.style.display = "block";
    await switchToGivenUserCollection(userObj);
    resetInitialStartAndEndIndex(userObj);
    displayCardCollection(userObj);
    collectionLoadingTitle.style.display = "none";
}


async function setupCollectionPage(){
    const response= await fetch('/getCollection');
    let collection = await response.json();
    if(collection.length > 0){ 
        userObj.currCollectId = collection[0].collectionId;
    };
    var collectionLoadingTitle = document.getElementById("collectionLoadingTitle");
    collectionLoadingTitle.style.display = "block";
    await getInitialUserCollection(collection, userObj);
    resetInitialStartAndEndIndex(userObj);
    displayCardCollection(userObj);
    addRightScroll(userObj, collectionScrollRightButton, displayCardCollection);
    addLeftScroll(userObj, collectionScrollLeftButton, displayCardCollection);
    collectionLoadingTitle.style.display = "none";
    collectionSelect.addEventListener("change", () => { collectionSelectHandler(collectionSelect) });
}


/*main code for collection */
let userObj = {fileName: "collectionHelper", isUser: true,  primaryKeys: {}, collections: {}, currPrimaryKeysArr: [], currCollection: {},
                currCollectId: null, cardListsFromDb: {}, numCardsInView: 24, startIndex: 0, endIndex: 20, cardSlots: "userCardSlots", 
                collectionContainer: "collectionContainer"};

var collectionScrollLeftButton = document.getElementById("collectionScrollLeft");
var collectionScrollRightButton = document.getElementById("collectionScrollRight");
var collectionSelect = document.getElementById("collectId");

setupCollectionPage();