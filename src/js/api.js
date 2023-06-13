const FETCH_URL = "https://l9817xtkq3.execute-api.ap-northeast-2.amazonaws.com/dev";
const IMG_PATH = "https://fe-dev-matching-2021-03-serverlessdeploymentbuck-1ooef0cg8h3vq.s3.ap-northeast-2.amazonaws.com/public";

/**
 * fetch api dirs or files by id
 * @param {*} nodeId 
 * @returns data
 */
async function fetchDirOrFilesById(nodeId) {
  try {
    let response;
    if(nodeId) {
      response = await fetch(`${FETCH_URL}/${nodeId}`);
    } else {
      response = await fetch(FETCH_URL);
    }
    const data = response.json();
    return data;
  } catch(error) {
    console.log(error, 'API Error가 발생했다냥');
    handleError();
    return;
  }
}

/**
 * fetch image file
 * @param {*} filePath 
 * @returns imgUrl
 */
function fetchImageFile(filePath) {
  return `${IMG_PATH}${filePath}`;
}
