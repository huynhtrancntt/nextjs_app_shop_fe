// addToCart.ts
import toast from "react-hot-toast";
import { cloneDeep, convertUpdateProductToCart } from ".";
import { getLocalProductToCart, setLocalProductToCart } from "src/helpers/storage";
import { updateProductToCart } from "src/stores/order-product";
import { TItemOrderProduct } from "src/types/order-product";

type CartItem = {
    name: string;
    amount: number;
    image: string;
    price: number;
    discount: number;
    product: string;
    slug: string;
};

export const addProductToCart = (
    userId: string | undefined,
    item: TItemOrderProduct,
    orderItems: any[],
    quantity: number = 1,
    dispatch: (action: any) => void,

) => {

    const productCart = getLocalProductToCart();
    const parseProductCart = productCart ? JSON.parse(productCart) : {};
    const newCartItem: CartItem = {
        name: item.name,
        amount: quantity,
        image: item.image,
        price: item.price,
        discount: item.discount,
        product: item.product,
        slug: item.slug,
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

