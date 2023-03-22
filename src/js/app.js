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

let nowNode = {};
let categories = [];

// div child 요소들 비우기
function removeAllEle(ele) {
    while (ele.firstChild) {
        ele.removeChild(ele.firstChild);
    }
};

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

function markupCategories(category, index) {
    const div = document.createElement("div");
    div.innerHTML = category.name;
    div.addEventListener("click", () => handleClickCategory(index));
    breadcrumb.appendChild(div);
}

// 카테고리 세팅   
function setCategories(nodeId) {
    removeAllEle(breadcrumb);
    if(categories.length < 1) {
        categories.push(nowNode);
    } else {
        let isIncluded = false;
        let index = 0;
        for(let i = 0; i < categories.length; i++) {
            const selected = categories[i];
            if(selected.id === nodeId) {
                isIncluded = true;
                index = i;
                break;
            }
        }
        if(isIncluded) {
            categories = categories.slice(0, index + 1);
        } else {
            categories.push(nowNode);
        }
    }
    categories.map((category, i) => {
        markupCategories(category, i);
    });
}

// 로딩 모달 띄우기
function isLoading(isLoading) {
    if(isLoading) {
        loadingModal.style.display = BLOCK;
    } else {
        loadingModal.style.display = NONE;
    }
}

// 이미지 모달 띄우기
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
// 모달 닫기
function closeModal() {
    const loadingImg = imageModal.querySelector("#loadingImg");
    const dataImg = imageModal.querySelector("#dataImg");
    loadingImg.style.display = BLOCK;
    dataImg.style.display = NONE;
    imageModal.style.display = NONE;
    imageModal.classList.remove("ImageViewer");
    imageModal.classList.add("Loading");
}

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

// markup prev btn
function markupPrevBtn() {
    const prev = prevBtn.cloneNode(true);
    prev.classList.remove("prevBtn");
    prev.style.display = BLOCK;
    prev.addEventListener("click", () => handleClickPrevBtn());
    nodes.appendChild(prev);
}

function handleClickDir(id, name) {
    nowNode = {
        id,
        name,
    };
    getDirOrFilesById();
    setCategories(id);
}
// markup file or dir
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
    markupDiv.style.display = BLOCK;
    const dataName = markupDiv.querySelector(".name");
    dataName.innerText = name;
    nodes.appendChild(markupDiv);
}

// get api fetch items
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

// root dir 가져오기
async function getRootDirs() {
    removeAllEle(nodes);
    isLoading(true);
    app.dataset.id = ROOT;
    let localRoot = localStorage.getItem(LOCALROOT);
    let rootDatas = [];
    if(localRoot) {
        rootDatas = JSON.parse(localRoot);
    } else {
        rootDatas = await getFetchItems();
    }
    rootDatas.map((rootData) => {
        markupFileOrDir(rootData);
    });
    isLoading(false);
}

// nodeId로 dir or files 가져오기
async function getDirOrFilesById() {
    removeAllEle(nodes);
    isLoading(true);
    app.dataset.id = `${nowNode.id}`;
    let localDir = localStorage.getItem(LOCALDIR);
    let dirDatas = [];
    let parcedLocalDir = {};
    if(localDir) {
        parcedLocalDir = JSON.parse(localDir);
        if(parcedLocalDir[nowNode.id] !== undefined) {
            dirDatas = parcedLocalDir[nowNode.id];
        } else {
            dirDatas = await getFetchItems(nowNode.id, parcedLocalDir);
        }
    } else {
        dirDatas = await getFetchItems(nowNode.id, parcedLocalDir);
    }
    markupPrevBtn();
    dirDatas.map((dirData) => {
        markupFileOrDir(dirData);
    });
    isLoading(false);
}

if(app.dataset.id === ROOT) {
    nowNode = {
        id: -1,
        name: ROOT,
    };
    getRootDirs();
    setCategories(nowNode.id);
}