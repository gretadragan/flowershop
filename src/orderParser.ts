export interface Order {
  items: OrderItem[]
}

export interface OrderItem {
  code: string
  quantity: number
}

const orderRegexp = /^\s*(?<quantity>\d+)\s+(?<code>[A-Z0-9]+)\s*$/

/**
 * Parse a string into an object representing the order.
 * @param order a string representing an order. Accepted format (on multiple lines): `${quantity} ${code}`
 * @returns an order
 */
export const parseOrder = (order: string): Order | null => {
  const orderLines = order.split(/\r?\n/);
  const items = new Array<OrderItem>()
  
  // Parse each line using the regex
  orderLines.forEach((line) => {
    const matches = line.match(orderRegexp)

    if (matches) {
      const quantity = matches.groups?.['quantity'] ? Number.parseInt(matches.groups?.['quantity']) : 0
      const code = matches.groups?.['code']
      
      if (quantity && code) {
        items.push({
          code, 
          quantity
        })
      }
    }
  })

  return items.length ? {
    items
  } : null
}