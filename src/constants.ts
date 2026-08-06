const baseUrl = 'http://localhost:5173/'
const apiBaseUrl = 'http://localhost:8080/api'

export const navConstants = {
    baseUrl,

    //pages
    addAssetForm: `/asset/addAssetForm`,
    addCategoryForm: `/asset/addCategoryForm`,
    addCatGroupForm: `/asset/addCatGroupForm`,
    login: `/login`,
    register: `/register`,
}

export const apiConstants = {
    baseUrl,

    //get
    getAssetList: `${apiBaseUrl}/getAssetList`,
    getAssetCategoryList: `${apiBaseUrl}/getAssetCategoryList`,
    getAssetByAssetCode: `${apiBaseUrl}/getAssetByAssetCode`,
    getCurrentUser: `${apiBaseUrl}/me`,
    getCategoryGroup: `${apiBaseUrl}/getCategoryGroup`,

    //post
    addAsset: `${apiBaseUrl}/addAsset`,
    addAssetCategory: `${apiBaseUrl}/addAssetCategory`,
    addCategoryGroup: `${apiBaseUrl}/addCategoryGroup`,
    login: `${apiBaseUrl}/auth/login`,
    register: `${apiBaseUrl}/auth/register`,

    //del
    deleteAssetByAssetCode: `${apiBaseUrl}/deleteAssetByAssetCode`,
    deleteAssetCategoryById: `${apiBaseUrl}/deleteAssetCategoryById`,

    //put
    updateAsset: `${apiBaseUrl}/updateAsset`
}
