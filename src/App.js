import BreadCrumb from "./components/BreadCrumb.js";
import Nodes from "./components/Nodes.js";

class App {
  constructor($root) {
    this.$root = document.getElementById($root);
    this.nowNode = {};
    this.breadCrumb;
    this.nodes;
    this.render();
  }

  setNowNode = (id, name) => {
    this.nowNode = { id, name };
    this.breadCrumb.setNowNode(this.nowNode);
    this.nodes.setNowNode(this.nowNode);
  }

  setInitial = ($breadCrumb, $nodes) => {
    const nodeId = -1;
    this.breadCrumb = new BreadCrumb({
      $target: $breadCrumb,
      nowNode: this.nowNode,
      handleClick: (idx) => this.handleClickBreadCrumb(idx),
    });
    this.nodes = new Nodes({
      $target: $nodes,
      nowNode: this.nowNode,
      handlePrevBtn: this.handleClickPrevBtn,
      handleDir: (nodeId, nodeName) => this.handleClickDir(nodeId, nodeName),
    });
    this.setNowNode(nodeId, "root");
    this.nodes.settingRootDirs();
    this.breadCrumb.settingBreadCrumbs(nodeId);
  }

  render = () => {
    const $breadCrumb = document.createElement("nav");
    const $nodes = document.createElement("div")
    $breadCrumb.classList.add("Breadcrumb");
    $nodes.classList.add("Nodes");
    this.setInitial($breadCrumb, $nodes);
    this.$root.classList.add("App");
    this.$root.append($breadCrumb, $nodes);
  }

  handleClickBreadCrumb = (idx) => {
    const breadCrumbArr = this.breadCrumb.getbreadCrumbArr().slice(0, idx + 1);
    this.breadCrumb.setbreadCrumbArr(breadCrumbArr);

    const { id, name } = breadCrumbArr[idx];
    this.setNowNode(id, name);
    if(id === -1) {
      this.nodes.settingRootDirs();
    } else {
      this.nodes.settingDirOrFiles();
    }
    this.breadCrumb.settingBreadCrumbs(id);
  }

  handleClickPrevBtn = () => {
    const breadCrumbArr = this.breadCrumb.getbreadCrumbArr();
    breadCrumbArr.pop();
    this.breadCrumb.setbreadCrumbArr(breadCrumbArr);
    
    const { id, name } = breadCrumbArr[breadCrumbArr.length - 1];
    this.setNowNode(id, name);
    if(id === -1) {
      this.nodes.settingRootDirs();
    } else {
      this.nodes.settingDirOrFiles();
    }
    this.breadCrumb.settingBreadCrumbs(id);
  }

  handleClickDir = (nodeId, nodeName) => {
    this.setNowNode(nodeId, nodeName);
    this.nodes.settingDirOrFiles();
    this.breadCrumb.settingBreadCrumbs(nodeId);
  }
}

export default App;