import client from './client'
import type { Asset } from '../models/asset'

export const getAssetList = async (): Promise<Asset[]> => {
    const res = await client.get('/getAssetList')
    return res.data 
}

export const addAsset = async (asset: Asset): Promise<Asset[]> => {
    const res = await client.post('/addAsset', asset)
    return res.data 
}

export const updateAsset = async (asset: Asset): Promise<Asset[]> => {
    const res = await client.put('/updateAsset', asset)
    return res.data 
}

export const deleteAsset = async (assetCode: string): Promise<Asset[]> => {
    const res = await client.delete('/deleteAsset', {data: {asset_code: assetCode}})
    return res.data 
}