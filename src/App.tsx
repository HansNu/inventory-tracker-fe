import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AssetsPaging from './components/assetPaging'
import { navConstants } from './constants'
import AddAssetPage from './components/addAssetForm'
import AddCategoryPage from './components/addCategoryForm'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AssetsPaging />} />
                <Route path={navConstants.addAssetForm} element={<AddAssetPage />} />
                <Route path={`${navConstants.addAssetForm}/:assetCode/edit`} element={<AddAssetPage />} />
                <Route path={navConstants.addCategoryForm} element={<AddCategoryPage />}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App