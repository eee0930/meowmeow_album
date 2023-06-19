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
 * error 화면 표시
 */
function markupError() {
  const $errorImg = document.createElement("img");
  $errorImg.src = "assets/error_image.jpg";
  $errorImg.className = `error ${ACTION}`;
  $errorImg.addEventListener("click", setRoot);
  $nodes.appendChild($errorImg);
}

/**
 * error 화면 setting
 */
function setError() {
  isLoading(false);
  removeChildrenByEle($nodes);
  markupError();
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
    setRootDirs();
  } else {
    setDirOrFiles();
  }
  setCategories(nodeId);
};

/**
 * 카테고리 표시
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
    setRootDirs();
  } else {
    setDirOrFiles();
  }
  setCategories(nodeId);
}

/**
 * prev btn 화면에 표시
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
 * 초기 data 세팅
 */
function setRoot() {
  const nodeId = -1;
  setNowNode(nodeId, ROOT);
  setRootDirs();
  setCategories(nodeId);
}

/**
 * nodeId, nodeName에 해당하는 dir 열기
 * @param {*} nodeId 
 * @param {*} nodeName 
 */
function handleClickDir(nodeId, nodeName) {
  setNowNode(nodeId, nodeName);
  setDirOrFiles();
  setCategories(nodeId);
}

/**
 * file or dir 화면에 표시
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
 * api fetch로 가져온 data들 가져오기
 * @param {*} nodeId 
 * @param {*} localData 
 * @returns fetchDatas
 */
async function getFetchItems(nodeId, localData) {
  let datas;
  if(nodeId) {
    datas = await fetchDirOrFilesById(nodeId);
    if(datas) {
      localData[nodeId] = datas;
      localStorage.setItem(LOCALDIR, JSON.stringify(localData));
    }
  } else {
    datas = await fetchDirOrFilesById();
    if(datas) {
      localStorage.setItem(LOCALROOT, JSON.stringify(datas));
    } 
  }
  return datas;
}

/**
 * root dir 세팅
 */
async function setRootDirs() {
  removeChildrenByEle($nodes);
  isLoading(true);
  const localRoot = localStorage.getItem(LOCALROOT);
  let rootDatas = [];
  if(localRoot) {
    rootDatas = JSON.parse(localRoot);
    if(rootDatas === null || rootDatas === undefined) {
      rootDatas = await getFetchItems();
    }
  } else {
    rootDatas = await getFetchItems();
  }
  if(rootDatas !== null && rootDatas !== undefined) {
    rootDatas.map((rootData) => {
      markupFileOrDir(rootData);
    });
  }
  isLoading(false);
}

/**
 * dir or files 세팅
 */
async function setDirOrFiles() {
  removeChildrenByEle($nodes);
  isLoading(true);
  const localDir = localStorage.getItem(LOCALDIR);
  let dirDatas = [];
  let parcedLocalDir = {};
  if(localDir) {
    parcedLocalDir = JSON.parse(localDir);
    if(parcedLocalDir[nowNode.id] === undefined 
      || parcedLocalDir[nowNode.id] === null) {
      dirDatas = await getFetchItems(nowNode.id, parcedLocalDir);
    } else {
      dirDatas = parcedLocalDir[nowNode.id];
    }
  } else {
    dirDatas = await getFetchItems(nowNode.id, parcedLocalDir);
  }
  if(dirDatas !== null && dirDatas !== undefined) {
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