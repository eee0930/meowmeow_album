class BreadCrumb {
  constructor({ $target, nowNode, handleClick }) {
    this.$target = $target;
    this.nowNode = nowNode;
    this.breadCrumbArr = [];
    this.handleClickBreadCrumb = handleClick;
  }

  /**
   * 변경된 nowNode 업데이트
   * @param {node} nowNode 
   */
  setNowNode = (nowNode) => {
    this.nowNode = nowNode;
  }

  /**
   * breadCrumbs 화면에 표시
   * @param {breadCrumb} breadCrumb 
   * @param {number} idx 
   */
  renderBreadCrumbs = (breadCrumb, idx) => {
    const $div = document.createElement("div");
    $div.innerHTML = breadCrumb.name;
    $div.classList.add("jsAction");
    $div.addEventListener("click", () => this.handleClickBreadCrumb(idx));
    this.$target.appendChild($div);
  }

  /**
   * nodeId에 맞는 breadCrumbs 세팅
   * @param {number} nodeId 
   */
  settingBreadCrumbs = (nodeId) => {
    removeChildren(this.$target);
    if(this.breadCrumbArr.length < 1) {
      this.breadCrumbArr.push(this.nowNode);
    } else {
      const idx = this.breadCrumbArr.findIndex((bc) => bc.id === nodeId);
      if(idx > -1) {
        this.breadCrumbArr = this.breadCrumbArr.slice(0, idx + 1);
      } else {
        this.breadCrumbArr.push(this.nowNode);
      }
    }
    this.breadCrumbArr.map((bc, i) => {
      this.renderBreadCrumbs(bc, i);
    });
  }

  /**
   * 
   * @returns {breadCrumb}
   */
  getbreadCrumbArr = () => {
    return this.breadCrumbArr;
  }

  setbreadCrumbArr = (breadCrumbArr) => {
    this.breadCrumbArr = [...breadCrumbArr];
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

export default BreadCrumb;