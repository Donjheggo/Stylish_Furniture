import { supabase } from "../supabase";
import { Alert } from "react-native";

export async function GetTotalShippingAndTotalPrice(user_id: string) {
  // Step 1: Fetch Cart Items
  const { data: cartItems, error: cartError } = await supabase
    .from("carts")
    .select("product_id, quantity")
    .eq("user_id", user_id);

  if (cartError) {
    Alert.alert("Error fetching cart items:", cartError.message);
    return;
  }

  const productIds = cartItems.map((item) => item.product_id);

  // Step 2: Fetch Products
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price, shipping, quantity")
    .in("id", productIds);

  if (productsError) {
    Alert.alert("Error fetching products:", productsError.message);
    return;
  }

  // Calculate total price and shipping fee
  let totalPrice = 0;
  let totalShippingFee = 0;

  cartItems.forEach((cartItem) => {
    const product = products.find((p) => p.id === cartItem.product_id);
    if (product) {
      totalPrice += product.price * cartItem.quantity;
      totalShippingFee += product.shipping * cartItem.quantity;
    }
  });

  return {
    totalPrice: totalPrice,
    totalShippingFee: totalShippingFee,
    totalOrderPrice: totalPrice + totalShippingFee,
  };
}

export async function Checkout(user_id: string, name: string, address: string) {
  // Step 1: Fetch Cart Items
  const { data: cartItems, error: cartError } = await supabase
    .from("carts")
    .select("product_id, quantity")
    .eq("user_id", user_id);

  if (cartError) {
    Alert.alert("Error fetching cart items:", cartError.message);
    return;
  }

  const productIds = cartItems.map((item) => item.product_id);

  // Step 2: Fetch Products
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price, shipping, quantity")
    .in("id", productIds);

  if (productsError) {
    Alert.alert("Error fetching products:", productsError.message);
    return;
  }

  // Calculate total price and shipping fee
  let totalPrice = 0;
  let totalShippingFee = 0;

  cartItems.forEach((cartItem) => {
    const product = products.find((p) => p.id === cartItem.product_id);
    if (product) {
      totalPrice += product.price * cartItem.quantity;
      totalShippingFee += product.shipping * cartItem.quantity;
    }
  });

  const totalOrderPrice = totalPrice + totalShippingFee;

  // Step 3: Insert Order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([
      {
        user_id: user_id,
        name: name,
        address: address,
        price: totalPrice,
        shipping_fee: totalShippingFee,
        total_price: totalOrderPrice,
        delivery_status: "PENDING",
        payment_method: "COD",
      },
    ])
    .select();

  if (orderError) {
    Alert.alert("Error inserting order:", orderError.message);
    return;
  }

  const orderId = order[0].id;

  // Step 4: Insert Order Items
  const orderItems = cartItems.map((cartItem) => {
    const product = products.find((p) => p.id === cartItem.product_id);
    return {
      order_id: orderId,
      product_id: cartItem.product_id,
      quantity: cartItem.quantity,
      price: product?.price,
      shipping_fee: product?.shipping,
    };
  });

  const { error: orderItemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (orderItemsError) {
    Alert.alert("Error inserting order items:", orderItemsError.message);
    return;
  }

  // Step 5: Update Product Quantities
  for (const cartItem of cartItems) {
    const product = products.find((p) => p.id === cartItem.product_id);
    const newQuantity = product?.quantity - cartItem.quantity;

    const { error: updateProductError } = await supabase
      .from("product")
      .update({ quantity: newQuantity })
      .eq("id", cartItem.product_id);

    if (updateProductError) {
      Alert.alert(
        "Error updating product quantity:",
        updateProductError.message
      );
    }
  }

  // Step 6: Clear Cart
  const { error: clearCartError } = await supabase
    .from("cart")
    .delete()
    .eq("user_id", user_id);

  if (clearCartError) {
    Alert.alert("Error clearing cart:", clearCartError.message);
  } else {
    console.log("Order placed successfully and cart cleared!");
  }
}
