import { computeBundles, processOrder } from "./orderBundler"
import { Order } from "./orderParser"

test('10 Roses', () => {
  const totalQt = 10
  const bundles = [10, 5]
  const result = computeBundles(totalQt, bundles)
  console.info(`[${expect.getState().currentTestName}]`, 'Qt:', totalQt, 'Bundles:', bundles, 'Result:', result)
  expect(result).not.toBeNull()
  expect(result).toEqual(new Map([[10, 1]]))
})

test('15 Lilies', () => {
  const totalQt = 15
  const bundles = [9, 6, 3]
  const result = computeBundles(totalQt, bundles)
  console.info(`[${expect.getState().currentTestName}]`, 'Qt:', totalQt, 'Bundles:', bundles, 'Result:', result)
  expect(result).not.toBeNull()
  expect(result).toEqual(new Map([[9, 1], [6, 1]]))
})

test('13 Tulips', () => {
  const totalQt = 13
  const bundles = [9, 5, 3]
  const result = computeBundles(totalQt, bundles)
  console.info(`[${expect.getState().currentTestName}]`, 'Qt:', totalQt, 'Bundles:', bundles, 'Result:', result)
  expect(result).not.toBeNull()
  expect(result).toEqual(new Map([[9, 0], [5, 2], [3, 1]]))
})

test('Order 10 roses, 15 lilies, 13 tulips', () => {
  const order: Order = {
    items: [
      {
        code: 'R12',
        quantity: 10
      },
      {
        code: 'L09',
        quantity: 15
      },
      {
        code: 'T58',
        quantity: 13
      }
    ]
  }
  const result = processOrder(order)
  console.info(`[${expect.getState().currentTestName}]`, '\nOrder:', order, '\nResult:', JSON.stringify(result, null, '\t'))
  expect(result).not.toBeNull()
  expect(result?.items.length).toBe(3)
  
})