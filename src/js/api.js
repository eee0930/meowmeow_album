const FETCH_URL = "https://l9817xtkq3.execute-api.ap-northeast-2.amazonaws.com/dev";
const IMG_PATH = "https://fe-dev-matching-2021-03-serverlessdeploymentbuck-1ooef0cg8h3vq.s3.ap-northeast-2.amazonaws.com/public";

// get dirs or files by id api
async function fetchDirOrFilesById(nodeId) {
    try {
        let response = '';
        if(nodeId) {
            response = await fetch(`${FETCH_URL}/${nodeId}`);
        } else {
            response = await fetch(FETCH_URL);
        }
        const data = response.json();
        const status = response.status;
        console.log(status);
        if (status !== 200) {
            setTimeout(() => {
                isLoading(false);
                console.log(status, 'API Error가 발생했다냥');
            }, 2000);
            return;
        } else {
            return data;
        }
    } catch(error) {
        isLoading(false);
        console.log(error, 'API Error가 발생했다냥');
    }
}

// fetch image file
function fetchImageFile(filePath) {
    return `${IMG_PATH}${filePath}`;
}