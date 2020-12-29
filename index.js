const search = document.querySelector(".repository__search");
const autocomplete = document.querySelector('.repository__autocomplete');
const repositoryList = document.querySelector('.repository__list');
const gitAPI = 'https://api.github.com/search/repositories?q=';



function clearElem (parent){
    parent.innerHTML = "";
}
function clearValue (elem){
    elem.value = "";
}

function createChild (parent, child){
    parent.append(child)
}

function  delRepoBtnClickHandler (){
    const elem = this.parentNode;
    repositoryList.removeChild(elem);
}

function  createRepositoryLi( { name, owner, stargazers_count }){
    return `<li class="repository__li">
        <p class = "repository__item"> Name: ${name}</p>
        <p class = "repository__item"> Owner: ${owner.login} </p>
        <p class = "repository__item"> Stars: ${stargazers_count}</p>
        <button class = "repository__button button-close"></button>
         </li> `;
}

function repoItemClickHandler(repo){
    const repoLi = createRepositoryLi(repo);
    const newRepItem = createNewElement(repoLi);
    createChild(repositoryList, newRepItem);
    const delRepoBtn = newRepItem.querySelector('.button-close');
    delRepoBtn.addEventListener('click', delRepoBtnClickHandler);
    clearValue(search);
}

function createNewElement(item){
    const newElem = document.createElement('li');
    newElem.innerHTML = item;
    return newElem.firstChild;
}

function autocompleteSearch(RepoDate){
    if (autocomplete.firstChild)  clearElem(autocomplete);
    return RepoDate.forEach( elem => {
        const newItem = `<li class = "autocomplete__li">${elem.name}</li>`;
        const newElement =  createNewElement(newItem);
        createChild(autocomplete, newElement);
        newElement.addEventListener('click', ()=> repoItemClickHandler(elem));
    })
}

async function  getRepoDate(repoName){
  return  await fetch(`${gitAPI}${repoName}`)
      .then( resp => resp.json())
      .then( res => res.items.slice(0,5))
      .then( res => autocompleteSearch(res))
      .catch( e => console.log('Sorry, but we have a next problem: ', e));
}

const debounce = (cb, debounceTime) => {
    let debounceActive;
    return function () {
        clearTimeout(debounceActive);
        debounceActive = setTimeout(() =>  cb.apply( this, arguments), debounceTime);
    }
}

const debounceGetRepoDate = debounce(getRepoDate, 200);

function windowEscHandler(evt){
    if(evt.keyCode == 27) {
        clearElem(autocomplete);
        window.removeEventListener('keydown', windowEscHandler);
        window.removeEventListener('click', windowClickHandler);
        search.addEventListener('click', searchInputClickHandler);
    }
}

function windowClickHandler(evt){
    if( evt.target!== search ) {
        clearElem(autocomplete);
        window.removeEventListener('keydown', windowEscHandler);
        window.removeEventListener('click', windowClickHandler);
        search.addEventListener('click', searchInputClickHandler);
    }
}

function searchInputClickHandler (evt) {
    const newRequest = evt.target.value;
    newRequest? debounceGetRepoDate(newRequest) : clearElem(autocomplete);
    window.addEventListener('keydown', windowEscHandler);
    window.addEventListener('click', windowClickHandler);
    search.removeEventListener('click', searchInputClickHandler);
}




search.addEventListener('input', searchInputClickHandler);

