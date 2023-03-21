const FETCH_URL = "https://l9817xtkq3.execute-api.ap-northeast-2.amazonaws.com/dev";
const IMG_PATH = "https://fe-dev-matching-2021-03-serverlessdeploymentbuck-1ooef0cg8h3vq.s3.ap-northeast-2.amazonaws.com/public";

// get root dirs api
async function fetchRootDirs() {
    const response = await fetch(FETCH_URL);
    try {
        const data = await response.json();
        return data;
    } catch(error) {
        console.log(response.status, 'Unable to get the currency rate');
    }
}

// get dirs or files by id api
async function fetchDirOrFilesById(nodeId) {
    const response = await fetch(`${FETCH_URL}/${nodeId}`);
    try {
        const data = await response.json();
        return data;
    } catch(error) {
        console.log(response.status, 'Unable to get the currency rate');
    }
}

// fetch image file
function fetchImageFile(filePath) {
    return `${IMG_PATH}${filePath}`;
}