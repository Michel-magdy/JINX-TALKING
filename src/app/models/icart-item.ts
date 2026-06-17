import { IProduct } from "./iproduct";

export interface ICartItem {
    id: string;
    productId: string;
    product: IProduct;
    quantity: number;
    size?: string;
    color?: string;
    price: number;
}
