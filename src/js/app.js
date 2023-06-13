const $breadcrumb = document.querySelector(".Breadcrumb"); 
const $nodes = document.querySelector(".Nodes");
const $prevBtn = document.querySelector(".prevBtn");
const $dirEle = document.querySelector(".dirEle");
const $fileEle = document.querySelector(".fileEle");
const $imageModal = document.querySelector("#imageModal");
const $loadingModal = document.querySelector("#loadingModal"); 

const LOCALROOT = "localRootItems";
const LOCALDIR = "localDirItems";
const ROOT = "root";
const BLOCK = "block";
const NONE = "none";
const ACTION = "jsAction";

let nowNode = {};
let categories = [];

/**
 * 현재 dir의 node setting 
 * @param {*} id 
 * @param {*} name 
 */
function setNowNode(id, name) {
  nowNode = {
    id,
    name,
  };
}

/**
 * ele의 children 요소들 비우기
 * @param {*} ele 
 */
function removeChildrenByEle(ele) {
  while (ele.firstChild) {
    ele.removeChild(ele.firstChild);
  }
};

/**
 * error 화면 setting
 */
function handleError() {
  isLoading(false);
  removeChildrenByEle($nodes);
  const $errorImg = document.createElement("img");
  $errorImg.src = "assets/error_image.jpg";
  $errorImg.className = `error ${ACTION}`;
  $errorImg.addEventListener("click", setRoot);
  $nodes.appendChild($errorImg);
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
  setNowNode(nodeId, nodeName);
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
  const $div = document.createElement("div");
  $div.innerHTML = category.name;
  $div.classList.add(ACTION);
  $div.addEventListener("click", () => handleClickCategory(index));
  $breadcrumb.appendChild($div);
}
 
/**
 * 선택한 nodeId로 카테고리 세팅 
 * @param {*} nodeId 
 */  
function setCategories(nodeId) {
  removeChildrenByEle($breadcrumb);
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
const $dataImg = $imageModal.querySelector("img");

/**
 * 로딩 모달 띄우기
 * @param {*} isLoading 
 */
function isLoading(isLoading) {
  if(isLoading) {
    $loadingModal.style.display = BLOCK;
  } else {
    $loadingModal.style.display = NONE;
  }
}

/**
 * 이미지 모달 띄우기
 * @param {*} filePath 
 */
function openImageViewer(filePath) {
  $dataImg.src = fetchImageFile(filePath);
  $imageModal.style.display = BLOCK;
}

/**
 * 모달창 닫기
 */
function closeModal() {
  $imageModal.style.display = NONE;
}

// [handle Nodes] --------------------------------------------------------------
/**
 * 이전 dir로 돌아가기
 */
function handleClickPrevBtn() {
  categories.pop();
  const nodeCategory = categories[categories.length - 1];
  const nodeId = nodeCategory.id;
  const nodeName = nodeCategory.name;
  setNowNode(nodeId, nodeName);
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
  const prev = $prevBtn.cloneNode(true);
  prev.classList.remove("prevBtn");
  prev.classList.add(ACTION);
  prev.style.display = BLOCK;
  prev.addEventListener("click", () => handleClickPrevBtn());
  $nodes.appendChild(prev);
}

/**
 * root dir setting
 */
function setRoot() {
  const nodeId = -1;
  setNowNode(nodeId, ROOT);
  getRootDirs();
  setCategories(nodeId);
}

/**
 * nodeId, nodeName에 해당하는 dir 열기
 * @param {*} nodeId 
 * @param {*} nodeName 
 */
function handleClickDir(nodeId, nodeName) {
  setNowNode(nodeId, nodeName);
  getDirOrFilesById();
  setCategories(nodeId);
}

/**
 * markup file or dir
 * @param {*} data 
 */
function markupFileOrDir(data) {
  const {id, name, type, filePath} = data;
  let markupDiv = '';
  if(type === 'FILE') {
    markupDiv = $fileEle.cloneNode(true);
    markupDiv.classList.remove("fileEle");
    markupDiv.addEventListener("click", () => openImageViewer(filePath));
  } else {
    markupDiv = $dirEle.cloneNode(true);
    markupDiv.classList.remove("dirEle");
    markupDiv.addEventListener("click", () => handleClickDir(id, name));
  }
  markupDiv.classList.add(ACTION);
  markupDiv.style.display = BLOCK;
  const $dataName = markupDiv.querySelector(".name");
  $dataName.innerText = name;
  $nodes.appendChild(markupDiv);
}

/**
 * api fetch로 가져온 data들 setting하기
 * @param {*} nodeId 
 * @param {*} localData 
 * @returns fetchDatas
 */
async function setFetchItems(nodeId, localData) {
  let datas;
  if(nodeId) {
    datas = await fetchDirOrFilesById(nodeId);
    if(datas === false) {
      handleError();
    } else {
      localData[nodeId] = datas;
      localStorage.setItem(LOCALDIR, JSON.stringify(localData));
    }
  } else {
    datas = await fetchDirOrFilesById();
    if(datas === false) {
      handleError();
    } else {
      localStorage.setItem(LOCALROOT, JSON.stringify(datas));
    } 
  }
  return datas;
}

/**
 * root dir 가져오기
 */
async function getRootDirs() {
  removeChildrenByEle($nodes);
  isLoading(true);
  const localRoot = localStorage.getItem(LOCALROOT);
  let rootDatas = [];
  if(localRoot) {
    rootDatas = JSON.parse(localRoot);
    if(rootDatas === false) {
      rootDatas = await setFetchItems();
    }
  } else {
    rootDatas = await setFetchItems();
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
  removeChildrenByEle($nodes);
  isLoading(true);
  const localDir = localStorage.getItem(LOCALDIR);
  let dirDatas = [];
  let parcedLocalDir = {};
  if(localDir) {
    parcedLocalDir = JSON.parse(localDir);
    if(parcedLocalDir[nowNode.id] === undefined 
      || parcedLocalDir[nowNode.id] === false) {
      dirDatas = await setFetchItems(nowNode.id, parcedLocalDir);
    } else {
      dirDatas = parcedLocalDir[nowNode.id];
    }
  } else {
    dirDatas = await setFetchItems(nowNode.id, parcedLocalDir);
  }
  if(dirDatas !== false) {
    markupPrevBtn();
    dirDatas.map((dirData) => {
      markupFileOrDir(dirData);
    });
  }
  isLoading(false);
}

window.onload = () => {
  setRoot();
};