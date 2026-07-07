export interface ICreatePropertyPayload {
    title: string;
    description: string;
    location: string;
    price: number;
    amenities: string[];
    images: string[];
    categoryId: string;
}
