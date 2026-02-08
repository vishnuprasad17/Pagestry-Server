export interface CartItemResponseDto {
  id: string;
  title: string;
  sellingPrice: number;
  stock: number;
  coverImage: string;
  quantity: number;
}

export interface CartResponseDto {
  items: CartItemResponseDto[];
}