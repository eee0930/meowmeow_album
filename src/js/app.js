const app = document.querySelector(".App");
const breadcrumb = document.querySelector(".Breadcrumb"); 
const nodes = document.querySelector(".Nodes");
const prevBtn = document.querySelector(".prevBtn");
const dirEle = document.querySelector(".dirEle");
const fileEle = document.querySelector(".fileEle");
const imageModal = document.querySelector("#imageModal");
const loadingModal = document.querySelector("#loadingModal"); 
const LOCALROOT = "localRootItem";
const LOCALCHILD = "localChildItem";
const ROOT = "root";

let categories = [];

// div child 요소들 비우기
function removeAllEle(ele) {
    while (ele.firstChild) {
        ele.removeChild(ele.firstChild);
    }
};

function movePrevDir(ele) {
    setCategories(false, ele);
    const nodeId = ele.id;
    const name = ele.name;
    if(name === ROOT) {
        getRootDirs();
    } else {
        getDirOrFilesById(nodeId, name);
    }
};

// 카테고리 세팅
function setCategories(isAdd, ele) {
    removeAllEle(breadcrumb);
    const eleId = ele.id;
    if(isAdd) {
        const cate = {
            id: eleId,
            name: ele.name,
        };
        categories.push(cate);
    } else {
        let cateIndex = 0;
        for(let i = 0; i < categories.length; i++) {
            if(categories[i].id === eleId) {
                cateIndex = i;
                break;
            }
        }
        categories = categories.slice(0, cateIndex + 1);
    }
    categories.map((cate, i) => {
        const cateDiv = document.createElement("div");
        const name = cate.name;
        cateDiv.innerText = name;
        cateDiv.addEventListener("click", () => movePrevDir(ele));
        breadcrumb.appendChild(cateDiv);
    })
}

// 로딩 모달 띄우기
function isLoading(isLoading) {
    if(isLoading) {
        loadingModal.style.display = "block";
    } else {
        loadingModal.style.display = "none";
    }
}

// 이미지 모달 띄우기
function openImageViewer(filePath) {
    const loadingImg = imageModal.querySelector("#loadingImg");
    const dataImg = imageModal.querySelector("#dataImg");
    dataImg.src = fetchImageFile(filePath);
    imageModal.style.display = "block";
    setTimeout(function() {
        imageModal.classList.remove("Loading");
        imageModal.classList.add("ImageViewer");
        loadingImg.style.display = "none";
        dataImg.style.display = "block";
    }, 500);
}
// 모달 닫기
function closeModal() {
    const loadingImg = imageModal.querySelector("#loadingImg");
    const dataImg = imageModal.querySelector("#dataImg");
    loadingImg.style.display = "block";
    dataImg.style.display = "none";
    imageModal.style.display = "none";
    imageModal.classList.remove("ImageViewer");
    imageModal.classList.add("Loading");
}

// markup prev btn
function markupPrevBtn(parentId, parentName) {
    const prev = prevBtn.cloneNode(true);
    prev.classList.remove("prevBtn");
    prev.style.display = "block";
    const ele = {
        id: parentId,
        name: parentName,
    };
    prev.addEventListener("click", () => movePrevDir(ele));
    nodes.appendChild(prev);
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
        markupDiv.addEventListener("click", () => getDirOrFilesById(id, name));
    }
    markupDiv.style.display = "block";
    const dataName = markupDiv.querySelector(".name");
    dataName.innerText = name;
    nodes.appendChild(markupDiv);
}

// root dir 가져오기
async function getRootDirs() {
    removeAllEle(nodes);
    isLoading(true);
    app.dataset.id = ROOT;
    const ele = {
        id: null,
        name: ROOT,
    };
    setCategories(true, ele);
    let localRoot = localStorage.getItem(LOCALROOT);
    let rootDatas = [];
    if(localRoot) {
        rootDatas = localRoot;
    } else {
        rootDatas = await fetchRootDirs();
        localStorage.setItem(LOCALROOT, JSON.stringify(rootDatas));
    }
    
    rootDatas.map((rootData) => {
        markupFileOrDir(rootData);
    });
    isLoading(false);
}

// children dir or files 가져오기
async function getDirOrFilesById(nodeId, nodeName) {
    removeAllEle(nodes);
    isLoading(true);
    app.dataset.id = `${nodeId}`;
    const ele = {
        id: nodeId,
        name: nodeName,
    };
    setCategories(true, ele);
    let localChild = localStorage.getItem(LOCALCHILD);
    let dirDatas = [];
    let parcedLocalChild = {};
    if(localChild) {
        parcedLocalChild = JSON.parse(localChild);
        if(parcedLocalChild[nodeId] !== undefined) {
            dirDatas = parcedLocalChild[nodeId];
        } else {
            dirDatas = await fetchDirOrFilesById(nodeId);
            parcedLocalChild[nodeId] = dirDatas;
            localStorage.setItem(LOCALCHILD, JSON.stringify(parcedLocalChild));
        }
    } else {
        dirDatas = await fetchDirOrFilesById(nodeId);
        parcedLocalChild[nodeId] = dirDatas;
        localStorage.setItem(LOCALCHILD, JSON.stringify(parcedLocalChild));
    }
    const parentId = categories[categories.length - 2].id;
    const parentName = categories[categories.length - 2].name; 
    markupPrevBtn(parentId, parentName);
    dirDatas.map((dirData) => {
        markupFileOrDir(dirData);
    });
    isLoading(false);
}


if(app.dataset.id === ROOT) {
    getRootDirs();
}