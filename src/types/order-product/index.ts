export type TItemOrderProduct = {
  name: string
  amount: number,
  image: string,
  price: number,
  discount: number,
  product: string,
  slug: string
  averageRating: number
  createdAt: Date | null
  totalLike: number
  countInStock: number
  discountStartDate: Date | null
  discountEndDate: Date | null
  totalReviews: number
  sold: number
}