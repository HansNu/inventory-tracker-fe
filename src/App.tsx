import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AssetsPaging from './components/assetPaging'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AssetsPaging />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App