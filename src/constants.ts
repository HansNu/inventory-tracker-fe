const baseUrl = 'http://localhost:5173/'
const apiBaseUrl = 'http://localhost:8080/'

export const constants = {
    baseUrl,

    //pages
    addAssetForm: `${baseUrl}asset/addAssetForm`,

    // ────────────────────────────────── API ──────────────────────────────────────────── //

    //get
    getAssetList : `${apiBaseUrl}getAssetList`,
    getAssetCategoryList: `${apiBaseUrl}getAssetCategoryList`
}
