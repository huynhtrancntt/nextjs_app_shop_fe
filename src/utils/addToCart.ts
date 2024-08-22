// addToCart.ts

import { cloneDeep, convertUpdateProductToCart, isExpiredProduct } from ".";
import { getLocalProductToCart, setLocalProductToCart } from "src/helpers/storage";
import { updateProductToCart } from "src/stores/order-product";
import { TItemOrderProduct } from "src/types/order-product";


export const addProductToCart = (
    userId: string | undefined,
    item: TItemOrderProduct,
    orderItems: any[],
    quantity: number = 1,
    dispatch: (action: any) => void,

) => {

    const productCart = getLocalProductToCart();
    const parseProductCart = productCart ? JSON.parse(productCart) : {};

    const discount = isExpiredProduct(item.discountStartDate, item.discountEndDate) ? item.discount : 0

    const newCartItem: TItemOrderProduct = {
        name: item.name,
        amount: quantity,
        image: item.image,
        price: item.price,
        discount: discount,
        product: item.product,
        slug: item.slug,
        averageRating: item.averageRating,
        createdAt: item.createdAt,
        totalLike: item.totalLike,
        countInStock: item.countInStock,
        discountStartDate: item.discountStartDate,
        discountEndDate: item.discountEndDate,
        totalReviews: item.totalReviews,
        sold: item.sold,

    };

    const updatedOrderItems = convertUpdateProductToCart(orderItems, newCartItem);

    if (userId) {
        dispatch(
            updateProductToCart({
                orderItems: updatedOrderItems,
            })
        );

        setLocalProductToCart({
            ...parseProductCart,
            [userId]: updatedOrderItems,
        });
    }
};

export const removeProductFromCart = (
    userId: string | undefined,
    itemsToRemove: string[], // Array of product IDs to remove
    orderItems: any[],
    dispatch: (action: any) => void,
) => {
    const productCart = getLocalProductToCart();
    const parseProductCart = productCart ? JSON.parse(productCart) : {};

    const cloneOrderItems = cloneDeep(orderItems);

    const filteredItems = cloneOrderItems.filter(
        (item: TItemOrderProduct) => !itemsToRemove.includes(item.product)
    );

    if (userId) {
        dispatch(
            updateProductToCart({
                orderItems: filteredItems,
            })
        );

        setLocalProductToCart({
            ...parseProductCart,
            [userId]: filteredItems,
        });

    }
};

