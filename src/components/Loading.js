class Loading {
  constructor() {
    this.$loadingModal = document.createElement("div");
    this.settingLoadingModal();
  }

  settingLoadingModal = () => {
    const $content = document.createElement("div");
    $content.classList.add("content");
    const $img = document.createElement("img");
    $img.src = "./assets/img/nyan-cat.gif";
    $content.appendChild($img);
    this.$loadingModal.appendChild($content);
    this.$loadingModal.className = "Modal Loading";
    this.$loadingModal.style.display = "none";
    document.body.appendChild(this.$loadingModal);
  }

  isLoading = (isLoading) => {
    if(isLoading) {
      this.$loadingModal.style.display = "block";
    } else {
      this.$loadingModal.style.display = "none";
    }
  }
}

export default Loading;