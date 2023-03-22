const app = document.querySelector(".App");
const breadcrumb = document.querySelector(".Breadcrumb"); 
const nodes = document.querySelector(".Nodes");
const prevBtn = document.querySelector(".prevBtn");
const dirEle = document.querySelector(".dirEle");
const fileEle = document.querySelector(".fileEle");
const imageModal = document.querySelector("#imageModal");
const loadingModal = document.querySelector("#loadingModal"); 

const LOCALROOT = "localRootItems";
const LOCALDIR = "localDirItems";
const ROOT = "root";
const BLOCK = "block";
const NONE = "none";
const ACTION = "jsAction";

let nowNode = {};
let categories = [];

/**
 * ele의 child 요소들 비우기
 * @param {*} ele 
 */
function removeAllEle(ele) {
    while (ele.firstChild) {
        ele.removeChild(ele.firstChild);
    }
};

/**
 * error 화면 띄우기
 */
function handleError() {
    removeAllEle(nodes);
    const errorImg = document.createElement("img");
    errorImg.src="assets/error_image.jpg";
    errorImg.className = `error ${ACTION}`;
    errorImg.addEventListener("click", resetRoot);
    nodes.appendChild(errorImg);
}

// [handle Breadcrumb] ---------------------------------------------------------
/**
 * index번째에 있는 카테고리 dir로 이동
 * @param {*} index 
 */
function handleClickCategory(index) {
    categories = categories.slice(0, index + 1);
    const nodeId = categories[index].id;
    const nodeName = categories[index].name;
    nowNode = {
        id: nodeId,
        name: nodeName,
    }
    if(nodeId === -1) {
        getRootDirs();
    } else {
        getDirOrFilesById();
    }
    setCategories(nodeId);
};

/**
 * 카테고리 markup
 * @param {*} category 
 * @param {*} index 
 */
function markupCategories(category, index) {
    const div = document.createElement("div");
    div.innerHTML = category.name;
    div.classList.add(ACTION);
    div.addEventListener("click", () => handleClickCategory(index));
    breadcrumb.appendChild(div);
}
 
/**
 * 선택한 nodeId로 카테고리 세팅 
 * @param {*} nodeId 
 */  
function setCategories(nodeId) {
    removeAllEle(breadcrumb);
    if(categories.length < 1) {
        categories.push(nowNode);
    } else {
        const index = categories.findIndex((category) => category.id === nodeId);
        if(index > -1) {
            categories = categories.slice(0, index + 1);
        } else {
            categories.push(nowNode);
        }
    }
    categories.map((category, i) => {
        markupCategories(category, i);
    });
}

// [handle Modal] --------------------------------------------------------------
/**
 * 로딩 모달 띄우기
 * @param {*} isLoading 
 */
function isLoading(isLoading) {
    if(isLoading) {
        loadingModal.style.display = BLOCK;
    } else {
        loadingModal.style.display = NONE;
    }
}

/**
 * 이미지 모달 띄우기
 * @param {*} filePath 
 */
function openImageViewer(filePath) {
    const loadingImg = imageModal.querySelector("#loadingImg");
    const dataImg = imageModal.querySelector("#dataImg");
    dataImg.src = fetchImageFile(filePath);
    imageModal.style.display = BLOCK;
    setTimeout(function() {
        imageModal.classList.remove("Loading");
        imageModal.classList.add("ImageViewer");
        loadingImg.style.display = NONE;
        dataImg.style.display = BLOCK;
    }, 500);
}

/**
 * 모달창 닫기
 */
function closeModal() {
    const loadingImg = imageModal.querySelector("#loadingImg");
    const dataImg = imageModal.querySelector("#dataImg");
    loadingImg.style.display = BLOCK;
    dataImg.style.display = NONE;
    imageModal.style.display = NONE;
    imageModal.classList.remove("ImageViewer");
    imageModal.classList.add("Loading");
}

// [handle Nodes] --------------------------------------------------------------
/**
 * 이전 dir로 돌아가기
 */
function handleClickPrevBtn() {
    categories.pop();
    const nodeId = categories[categories.length - 1].id;
    const nodeName = categories[categories.length - 1].name;
    nowNode = {
        id : nodeId,
        name: nodeName,
    };
    if(nodeId === -1) {
        getRootDirs();
    } else {
        getDirOrFilesById();
    }
    setCategories(nodeId);
}

/**
 * markup prev btn
 */
function markupPrevBtn() {
    const prev = prevBtn.cloneNode(true);
    prev.classList.remove("prevBtn");
    prev.classList.add(ACTION);
    prev.style.display = BLOCK;
    prev.addEventListener("click", () => handleClickPrevBtn());
    nodes.appendChild(prev);
}

/**
 * id, name에 해당하는 dir 클릭 이벤트
 * @param {*} id 
 * @param {*} name 
 */
function handleClickDir(id, name) {
    nowNode = {
        id,
        name,
    };
    getDirOrFilesById();
    setCategories(id);
}

/**
 * markup file or dir
 * @param {*} data 
 */
function markupFileOrDir(data) {
    const {id, name, type, filePath} = data;
    let markupDiv = '';
    if(type === 'FILE') {
        markupDiv = fileEle.cloneNode(true);
        markupDiv.classList.remove("fileEle");
        markupDiv.addEventListener("click", () => openImageViewer(filePath));
    } else {
        markupDiv = dirEle.cloneNode(true);
        markupDiv.classList.remove("dirEle");
        markupDiv.addEventListener("click", () => handleClickDir(id, name));
    }
    markupDiv.classList.add(ACTION);
    markupDiv.style.display = BLOCK;
    const dataName = markupDiv.querySelector(".name");
    dataName.innerText = name;
    nodes.appendChild(markupDiv);
}

/**
 * get api fetch items by nodeId
 * @param {*} nodeId 
 * @param {*} localData 
 * @returns fetchDatas
 */
async function getFetchItems(nodeId, localData) {
    let datas = '';
    if(nodeId) {
        datas = await fetchDirOrFilesById(nodeId);
        localData[nodeId] = datas;
        localStorage.setItem(LOCALDIR, JSON.stringify(localData));
    } else {
        datas = await fetchDirOrFilesById();
        localStorage.setItem(LOCALROOT, JSON.stringify(datas));
    }
    return datas;
}

/**
 * root dir 가져오기
 */
async function getRootDirs() {
    removeAllEle(nodes);
    isLoading(true);
    const localRoot = localStorage.getItem(LOCALROOT);
    let rootDatas = [];
    if(localRoot) {
        rootDatas = JSON.parse(localRoot);
    } else {
        rootDatas = await getFetchItems();
    }
    if(rootDatas !== false) {
        rootDatas.map((rootData) => {
            markupFileOrDir(rootData);
        });
    }
    isLoading(false);
}

/**
 * dir or files 가져오기
 */
async function getDirOrFilesById() {
    removeAllEle(nodes);
    isLoading(true);
    const localDir = localStorage.getItem(LOCALDIR);
    let dirDatas = [];
    let parcedLocalDir = {};
    if(localDir) {
        parcedLocalDir = JSON.parse(localDir);
        if(parcedLocalDir[nowNode.id] === undefined 
            || parcedLocalDir[nowNode.id] === false) {
            dirDatas = await getFetchItems(nowNode.id, parcedLocalDir);
        } else {
            dirDatas = parcedLocalDir[nowNode.id];
        }
    } else {
        dirDatas = await getFetchItems(nowNode.id, parcedLocalDir);
    }
    if(dirDatas !== false) {
        markupPrevBtn();
        dirDatas.map((dirData) => {
            markupFileOrDir(dirData);
        });
    }
    isLoading(false);
}

/**
 * 화면 진입 시 setting
 */
function resetRoot() {
    nowNode = {
        id: -1,
        name: ROOT,
    };
    getRootDirs();
    setCategories(nowNode.id);
}

window.onload = () => {
    resetRoot();
};