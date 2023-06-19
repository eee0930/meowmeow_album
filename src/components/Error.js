class Error {
  constructor({ $target }) {
    this.$target = $target;
  }
  /**
   * error 화면 표시
   */
  renderError = () => {
    const $errorImg = document.createElement("img");
    $errorImg.src = "./assets/img/error_image.jpg";
    $errorImg.className = "error jsAction";
    this.$target.appendChild($errorImg);
  }

  /**
   * error 화면 setting
   */
  setError = () => {
    this.removeChildren(this.$target);
    this.renderError();
  }

  /**
   * ele의 children 요소들 지우기
   * @param {HTMLDivElement} ele 
   */
  removeChildren = (ele) => {
    while (ele.firstChild) {
      ele.removeChild(ele.firstChild);
    }
  }
}

export default Error;