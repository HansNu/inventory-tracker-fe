import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AssetsPaging from './components/assetPaging'
import { navConstants } from './constants'
import AddAssetPage from './components/addAssetForm'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AssetsPaging />} />
                <Route path={navConstants.addAssetForm} element={<AddAssetPage />} />
                <Route path={`${navConstants.addAssetForm}/:assetCode/edit`} element={<AddAssetPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App