const FETCH_ROOT = "https://l9817xtkq3.execute-api.ap-northeast-2.amazonaws.com/dev";
const IMG_PATH = "https://fe-dev-matching-2021-03-serverlessdeploymentbuck-1ooef0cg8h3vq.s3.ap-northeast-2.amazonaws.com/public";

/**
 * fetch api dirs for files by id
 * @param {string} nodeId 
 * @returns 
 */
export const fetchDirOrFilesById = async (nodeId) => {
  try {
    let response;
    if(nodeId) {
      response = await fetch(`${FETCH_ROOT}/${nodeId}`);
    } else { 
      response = await fetch(`${FETCH_ROOT}`);
    }
    const data = await response.json();
    return data;
  } catch(e) {
    console.log("❌", e);
    return false;
  }
}

/**
 * fetch image file
 * @param {string} filePath 
 * @returns {string}
 */
export const fetchImageFileByPath = (filePath) => {
  return `${IMG_PATH}${filePath}`;
}