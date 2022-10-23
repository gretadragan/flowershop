import { parseOrder } from '../orderParser';

describe('Order parsing', () => {
  test('3 items order', () => {
    const result = parseOrder(`10 R12
    15 L09
    13 T58`
    )
    expect(result).not.toBeNull()
    expect(result?.items.length).toBe(3)
    expect(result).toEqual({
      items: [{
        code: 'R12',
        quantity: 10,
      }, {
        code: 'L09',
        quantity: 15,
      }, {
        code: 'T58',
        quantity: 13,
      }]
    })
  })

  test('1 item order', () => {
    const result = parseOrder(`22 R12`)
    expect(result).not.toBeNull()
    expect(result?.items.length).toBe(1)
    expect(result).toEqual({
      items: [{
        code: 'R12',
        quantity: 22,
      }]
    })
  })

  test('3 items order with bigger quantities, longer codes and excessive spaces', () => {
    const result = parseOrder(`10986  R12
    15454 L09T564
    1398 TT58`
    )
    expect(result).not.toBeNull()
    expect(result?.items.length).toBe(3)
    expect(result).toEqual({
      items: [{
        code: 'R12',
        quantity: 10986,
      }, {
        code: 'L09T564',
        quantity: 15454,
      }, {
        code: 'TT58',
        quantity: 1398,
      }]
    })
  })

  test('empty order', () => {
    const result = parseOrder(``)
    expect(result).toBeNull()
  })

  test('invalid order', () => {
    const result = parseOrder(`R12 24`)
    expect(result).toBeNull()
  })
})