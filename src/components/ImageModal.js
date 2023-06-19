import { fetchImageFileByPath } from "../api.js";

class ImageModal {
  constructor({ $target }) {
    this.$target = $target;
    this.$imageModal = document.createElement("div");
    this.$dataImage = document.createElement("img");
    this.settingImageModal();
  }

  displayImageModal = (isBlock) => {
    if(isBlock) {
      this.$imageModal.style.display = "block";
    } else {
      this.$imageModal.style.display = "none";
    }
  }

  settingImageModal = () => {
    const $content = document.createElement("div");
    $content.classList.add("content");
    this.$dataImage.src = "./assets/img/sample_image.png";
    $content.appendChild(this.$dataImage);
    this.$imageModal.appendChild($content);
    this.$imageModal.className = "Modal ImageViewer";
    this.$imageModal.addEventListener("click", this.closeModal);
    this.displayImageModal(false);
    this.$target.appendChild(this.$imageModal);
  }

  closeModal = () => {
    this.displayImageModal(false);
  }

  openImageModal = (filePath) => {
    this.$dataImage.src = fetchImageFileByPath(filePath);
    this.displayImageModal(true);
  }

}

export default ImageModal;