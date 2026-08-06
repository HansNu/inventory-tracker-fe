import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AssetsPaging from './components/assetPaging'
import { navConstants } from './constants'
import AddAssetPage from './components/addAssetForm'
import AddCategoryPage from './components/addCategoryForm'
import AddCategoryGroupPage from './components/addCatGroupForm'
import LoginPage from './components/loginPage'
import RegisterPage from './components/registerPage'
import ProtectedRoute from './components/protectedRoute'
import { AuthProvider } from './context/authContext'

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path={navConstants.login} element={<LoginPage />} />
                    <Route path={navConstants.register} element={<RegisterPage />} />

                    <Route path="/" element={<ProtectedRoute><AssetsPaging /></ProtectedRoute>} />
                    <Route path={navConstants.addAssetForm} element={<ProtectedRoute><AddAssetPage /></ProtectedRoute>} />
                    <Route path={`${navConstants.addAssetForm}/:assetCode/edit`} element={<ProtectedRoute><AddAssetPage /></ProtectedRoute>} />
                    <Route path={navConstants.addCategoryForm} element={<ProtectedRoute><AddCategoryPage /></ProtectedRoute>} />
                    <Route path={navConstants.addCatGroupForm} element={<ProtectedRoute><AddCategoryGroupPage /></ProtectedRoute>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App