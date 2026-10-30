// Seven situations from the workshop shop. Each one describes a problem, none of them names a pattern.
export const situations = {
  'stock-api': 'The warehouse API answers { sku, qty }, the shop speaks { productId, quantity }.',
  checkout: 'Every caller coordinates stock, prices and payment in the right order by itself.',
  'price-lookup': 'The price service is slow, and one order asks for the same price three times.',
  'order-route': 'POST /orders checks the API key, validates, then places. Each step may stop it.',
  'payment-retry': 'Payment calls fail now and then. The charge function should stay as it is.',
  shipping: 'Shipping costs depend on the country, and a new country means another else-if.',
  'order-total': 'The order total is the sum of quantity times priceCents, used in one place.',
} as const

export type Situation = keyof typeof situations
