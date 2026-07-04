const baseUrl = 'http://localhost:5173/'
const apiBaseUrl = 'http://localhost:8080/api'

export const navConstants = {
    baseUrl,

    //pages
    addAssetForm: `/asset/addAssetForm`,
    addCategoryForm: `/asset/addCategoryForm`
}

export const apiConstants = {
    baseUrl,

    //get
    getAssetList : `${apiBaseUrl}/getAssetList`,
    getAssetCategoryList: `${apiBaseUrl}/getAssetCategoryList`,
    getAssetByAssetCode: `${apiBaseUrl}/getAssetByAssetCode`,

    //post
    addAsset : `${apiBaseUrl}/addAsset`,
    addAssetCategory : `${apiBaseUrl}/addAssetCategory`,

    //del
    deleteAssetByAssetCode: `${apiBaseUrl}/deleteAssetByAssetCode`,
    deleteAssetCategoryById: `${apiBaseUrl}/deleteAssetCategoryById`,

    //put
    updateAsset: `${apiBaseUrl}/updateAsset`
}
