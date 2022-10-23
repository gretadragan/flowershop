import inventory from './data/inventory.json';
import { Order, OrderItem } from "./orderParser";

interface ProcessedOrderItemBundle {
  /** How many items this bundle is composed of */
  bundleOption: number
  /** How many "pieces" of this bundle the order requires */
  bundleQuantity: number
  /** The price of a single bundle */
  bundlePrice: number
}

interface ProcessedOrderItem extends OrderItem {
  error?: string
  totalPrice?: number
  bundles?: ProcessedOrderItemBundle[]
}

export interface OrderProcessingResult {
  items: ProcessedOrderItem[]
}

/**
 * Rearrange inventory into a map to easily find elements.
 * @returns a Map<itemCode, Map<bundleSize, bundlePrice>>
 */
const buildInventoryOptionsMap = () => {
  console.debug('Building inventory map...')
  const result = new Map<string, Map<number, number>>()
  inventory.forEach((item) => {
    const bundleSizePriceMap = new Map<number, number>()
    item.bundles.forEach((bundle) => bundleSizePriceMap.set(bundle.quantity, bundle.price))
    result.set(item.code, bundleSizePriceMap)
  })
  return result
}

const inventoryOptionsMap: Map<string, Map<number, number>> = buildInventoryOptionsMap()

/**
 * Given an order, compute the bundles needed to fullfill the order and the price.
 * @param order the order to process
 * @returns the list of items, and for each of them the bundles and their quantities
 */
export const processOrder = (order: Order): OrderProcessingResult => {
  const processedOrderItems = new Array<ProcessedOrderItem>(order.items.length)
  
  order.items.forEach((orderItem, index) => {
    // Initialize result
    const processedItemResult: ProcessedOrderItem = {
      code: orderItem.code,
      quantity: orderItem.quantity
    }
    processedOrderItems[index] = processedItemResult

    // Check if we have this code in inventory
    const inventoryItem = inventoryOptionsMap.get(orderItem.code)
    if (!inventoryItem) {
      processedItemResult.error = 'Unknown item code'
      return
    }

    // Get all bundle options (e.g. [9, 5, 3]) for this code, and sort them in descending order.
    const bundleOptions = Array.from(inventoryItem.keys()).sort((a, b) => b - a)
    const result = computeBundles(orderItem.quantity, bundleOptions)
    if (!result) {
      processedItemResult.error = 'No bundle options available for this quantity'
      return
    }

    // Build the result for this item: add the quantity for each bundle option and compute prices.
    const processedBundles = new Array<ProcessedOrderItemBundle>()
    result.forEach((bundleQuantity, bundleOption) => {
      const bundlePrice = inventoryItem.get(bundleOption)
      if (bundleQuantity && bundlePrice) {
        processedBundles.push({
          bundleOption,
          bundleQuantity,
          bundlePrice
        })
      }
    })

    processedItemResult.bundles = processedBundles
    processedItemResult.totalPrice = processedBundles.reduce((prev, cur) => Math.round((prev + cur.bundlePrice * cur.bundleQuantity) * 100) / 100, 0)
  })

  return {
    items: processedOrderItems
  }
}

/**
 * A recursive function to compute bundles needed to fullfill the order.
 * Example: totalQuantity: 13, bundles: [ 9, 5, 3 ] => returns Map(3) { 9 => 0, 5 => 2, 3 => 1 }
 * @param totalQuantity the total number of items requested
 * @param bundles bundles options
 * @param result a map used to build the result
 * @returns a map containing, for each bundle size, its relative quantity. Null if there is no solution for the requested quantity.
 */
export const computeBundles = (totalQuantity: number, bundles: number[], result= new Map<number, number>()): Map<number, number> | null => {
  console.debug('totalQty:', totalQuantity, 'bundles:', bundles, 'result: ', result)
  // No bundles options -> no result
  if (!bundles.length)
    return null

  const bundleSize = bundles[0]
  if (bundleSize > totalQuantity) 
    return null

  const remainder = totalQuantity % bundleSize
  let currentBundleTotal = Math.floor(totalQuantity / bundleSize)
  if (remainder === 0) {
    result.set(bundleSize, currentBundleTotal)
    return result
  }

  let nextBundleOptions = bundles.slice(1)
  // If the current bundle size, for example, fits 2 times in totalQuantity, 
  // try to find a solution with 2, 1, 0 as a quantity for current bundle size.
  while (currentBundleTotal >= 0 && nextBundleOptions.length > 0) {
    const copyResult = new Map(result)
    copyResult.set(bundleSize, currentBundleTotal)
    const curResult = computeBundles(totalQuantity - (currentBundleTotal * bundleSize), nextBundleOptions, copyResult)
    if (curResult) {
      return curResult
    }
    currentBundleTotal--
  }
  return null
}