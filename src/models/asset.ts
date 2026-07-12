export interface Asset {
    id: number
    assetCode: string
    assetName: string
    brand?: string        // ? means optional/nullable
    serialNumber?: string
    assetCategory: string
    status: string
    location: string
    user?: string
    purchaseDate?: string  // dates are strings in TS, formatted on display
    description?: string
    createDt: string
    updateDt: string
}