export interface Asset {
    id: number
    asset_code: string
    asset_name: string
    brand?: string        // ? means optional/nullable
    serial_number?: string
    asset_category: string
    status: string
    location: string
    user?: string
    purchase_date?: string  // dates are strings in TS, formatted on display
    description?: string
    create_dt: string
    update_dt: string
}