import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AssetsPaging from './components/assetPaging'
import { navConstants } from './constants'
import AddAssetPage from './components/addAssetForm'
import AddCategoryPage from './components/addCategoryForm'
import AddCategoryGroupPage from './components/addCatGroupForm'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AssetsPaging />} />
                <Route path={navConstants.addAssetForm} element={<AddAssetPage />} />
                <Route path={`${navConstants.addAssetForm}/:assetCode/edit`} element={<AddAssetPage />} />
                <Route path={navConstants.addCategoryForm} element={<AddCategoryPage />}/>
                <Route path={navConstants.addCatGroupForm} element={<AddCategoryGroupPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App