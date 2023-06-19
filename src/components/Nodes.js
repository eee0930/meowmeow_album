import { fetchDirOrFilesById } from "../api.js";
import ImageModal from "./ImageModal.js";
import Loading from "./Loading.js";
import Error from "./Error.js";

const LOCALROOT = "localRootItems";
const LOCALDIR = "localDirItems";

class Nodes {
  constructor({ $target, nowNode, handlePrevBtn, handleDir }) {
    this.$target = $target;
    this.nowNode = nowNode;
    this.handleClickPrevBtn = handlePrevBtn;
    this.handleClickDir = handleDir;
    this.imageModal = new ImageModal({ $target: document.body});
    this.loading = new Loading();
    this.error = new Error({ $target: this.$target });
  }

  /**
   * 변경된 nowNode 업데이트
   * @param {node} nowNode 
   */
  setNowNode = (nowNode) => {
    this.nowNode = nowNode;
  }

  /**
   * 뒤로가기 버튼을 화면에 표시
   */
  renderPrevBtn = () => {
    const $prev = document.createElement("div");
    const $img = document.createElement("img");
    $prev.className = "jsAction Node prev";
    $prev.addEventListener("click", this.handleClickPrevBtn);
    $img.src = "./assets/img/prev.png";
    $prev.appendChild($img);
    this.$target.appendChild($prev);
  }

  /**
   * 파일 또는 디렉토리를 화면에 표시
   * @param {node} data 
   */
  renderFileOrDir = (data) => {
    const { id, name, type, filePath } = data;
    const $markupDiv = document.createElement("div");
    $markupDiv.className = "Node jsAction";
    const $img = document.createElement("img");
    if(type === 'FILE') {
      $markupDiv.addEventListener("click", () => 
        this.imageModal.openImageModal(filePath));
      $img.src = "./assets/img/file.png";
    } else {
      $markupDiv.addEventListener("click", () => 
        this.handleClickDir(id, name));
      $img.src = "./assets/img/directory.png";
    }
    const $dataName = document.createElement("div");
    $dataName.classList.add("name");
    $dataName.innerText = name;
    $markupDiv.append($img, $dataName);
    this.$target.appendChild($markupDiv);
  }

  /**
   * api 패치한 data들 가져오기
   * @param {number} nodeId 
   * @param {node} localData 
   */
  getFetchItems = async (nodeId, localData) => {
    let datas;
    if(nodeId) {
      datas = await fetchDirOrFilesById(nodeId);
      if(datas === false) {
        this.loading.isLoading(false);
        this.error.setError();
      } else {
        localData[nodeId] = datas;
        localStorage.setItem(LOCALDIR, JSON.stringify(localData));
      }
    } else {
      datas = await fetchDirOrFilesById();
      if(datas === false) {
        this.loading.isLoading(false);
        this.error.setError();
      } else {
        localStorage.setItem(LOCALROOT, JSON.stringify(datas));
      }
    }
    return datas;
  }

  /**
   * root 디렉토리 세팅
   */
  settingRootDirs = async () => {
    removeChildren(this.$target);
    this.loading.isLoading(true);
    const localRoot = localStorage.getItem(LOCALROOT);
    let rootDatas = [];
    if(localRoot) {
      rootDatas = JSON.parse(localRoot);
      if(rootDatas === false) {
        rootDatas = await this.getFetchItems();
      }
    } else {
      rootDatas = await this.getFetchItems();
    }
    if(rootDatas !== false) {
      rootDatas.map((rootData) => {
        this.renderFileOrDir(rootData);
      });
    }
    this.loading.isLoading(false);
  }

  /**
   * 디렉토리 또는 파일들 세팅
   */
  settingDirOrFiles = async () => {
    removeChildren(this.$target);
    this.loading.isLoading(true);
    const localDir = localStorage.getItem(LOCALDIR);
    let dirDatas = [];
    let parcedLocalDir = {};
    if(localDir) {
      parcedLocalDir = JSON.parse(localDir);
      if(parcedLocalDir[this.nowNode.id] === undefined 
        || parcedLocalDir[this.nowNode.id] === false) {
        dirDatas = await this.getFetchItems(this.nowNode.id, parcedLocalDir);
      } else {
        dirDatas = parcedLocalDir[this.nowNode.id];
      }
    } else {
      dirDatas = await this.getFetchItems(this.nowNode.id, parcedLocalDir);
    }
    if(dirDatas !== false) {
      this.renderPrevBtn();
      dirDatas.map((dirData) => {
        this.renderFileOrDir(dirData);
      });
    }
    this.loading.isLoading(false);
  }
}

/**
 * ele의 children 요소들 지우기
 * @param {HTMLDivElement} ele 
 */
const removeChildren = (ele) => {
  while (ele.firstChild) {
    ele.removeChild(ele.firstChild);
  }
}

export default Nodes;