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

export type TItemOrderProductBuy = {
  name: string
  amount: number,
  image: string,
  price: number,
  discount: number,
  product: string,
}

export type TParamsCreateOrderProduct = {
  orderItems: TItemOrderProductBuy[]
  fullName: string
  address?: string
  city: string
  phone: string
  paymentMethod: string
  itemsPrice: number
  shippingPrice: number
  totalPrice: number
  user: string
  deliveryMethod: string
}
