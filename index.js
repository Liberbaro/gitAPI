const search = document.querySelector(".repository__search");
const autocomplete = document.querySelector('.repository__autocomplete');
const repositoryList = document.querySelector('.repository__list');
const gitAPI = 'https://api.github.com/search/repositories?q=';




function createChild (parent, child){
    parent.append(child)
}

function  delRepoBtnClickHandler (){
    const elem = this.parentNode
    repositoryList.removeChild(elem)
}
function  createRepositoryLi( repo){
    return `<li class="repository__li">
        <p class="repository__item">Name: ${repo.name}</p>
        <p class="repository__item"> Owner: ${repo.owner['login']} </p>
        <p class="repository__item "> Stars: ${repo['stargazers_count']}</p>
        <button class="repository__button button-close"></button>
         </li> `
}

function repoItemClickHandler(repo){
    const repoLi = createRepositoryLi(repo)
    const newRepItem = createNewElement(repoLi)
    createChild(repositoryList, newRepItem)
    const delRepoBtn = newRepItem.querySelector('.button-close')
    delRepoBtn.addEventListener('click', delRepoBtnClickHandler)
    search.value = "";
}

function createNewElement(item){
    const newElem = document.createElement('li');
    newElem.innerHTML = item;
    return newElem.firstChild;
}

function autocompleteSearch(arr){
    if (autocomplete.firstChild) autocomplete.innerHTML = "";
    return arr.forEach( elem => {
        const newItem = `<li class="autocomplete__li">${elem.name}</li>`
        const newElement =  createNewElement(newItem)
        createChild(autocomplete, newElement)
        newElement.addEventListener('click', ()=> repoItemClickHandler(elem))
    })
}

function  getRepoDate(repoName){
  return  fetch(`${gitAPI}${repoName}`)
      .then( resp => resp.json())
      .then( res => res.items.splice(0,5))
      .then( res => autocompleteSearch(res))
      .catch( e => console.log('Sorry, but we have a next problem: ', e))
}

const debounce = (cb, debounceTime) => {
    let debounceActive;
    return function () {
        clearTimeout(debounceActive)
        debounceActive = setTimeout(()=>  cb.apply(this, arguments), debounceTime)
    }
}

const debGetRepoDate = debounce(getRepoDate, 100);

function windowEscHandler(evt){
    if(evt.keyCode == 27) autocomplete.innerHTML = "";
    search.addEventListener('click', searchClickHandler);
}

function windowClickHandler(evt){
    if( evt.target!== search ) autocomplete.innerHTML = "";
    search.addEventListener('click', searchClickHandler);
}

function searchClickHandler(evt){
    search.removeEventListener('click', searchClickHandler);
    const newRequest = evt.target.value;
    newRequest? debGetRepoDate(newRequest) : autocomplete.innerHTML = "";
}

function searchInputHandler (evt) {
    const newRequest = evt.target.value;
    newRequest? debGetRepoDate(newRequest) : autocomplete.innerHTML = "";
    window.addEventListener('keydown', windowEscHandler);
    window.addEventListener('click', windowClickHandler);
}




search.addEventListener('input', searchInputHandler);

