export interface IReview {
    id: string;
    productId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: Date;
}
