const baseUrl = 'http://localhost:5173/'
const apiBaseUrl = 'http://localhost:8080/api'

export const navConstants = {
    baseUrl,

    //pages
    addAssetForm: `/asset/addAssetForm`,
}

export const apiConstants = {
    baseUrl,

    //get
    getAssetList : `${apiBaseUrl}/getAssetList`,
    getAssetCategoryList: `${apiBaseUrl}/getAssetCategoryList`,
    addAsset : `${apiBaseUrl}/addAsset`
}
