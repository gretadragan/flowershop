import { useCallback, useState } from 'react';
import './App.css';
import inventory from './data/inventory.json';
import { OrderProcessingResult, processOrder } from './orderBundler';
import { parseOrder } from './orderParser';

function App() {
  const [orderProcessingResult, setOrderProcessingResult] = useState<OrderProcessingResult | null>(null)

  const onCompute = useCallback(() => {
    const textArea = document.querySelector('.input') as HTMLTextAreaElement
    if (textArea) {
      const order = parseOrder(textArea.value)
      if (order) {
        const orderResult = processOrder(order)
        setOrderProcessingResult(orderResult)
      } else {
        setOrderProcessingResult(null)
      }
    }
  }, [])

  return (
    <div className="App">
      <h1>Flower Shop</h1>

      <section className='container'>
        <p>Available codes: {inventory.map((item) => item.code).join(', ')}</p>
        
        <textarea rows={5} className='input' placeholder={'10 R12\n15 L09\n13 T58'}></textarea>
        <button onClick={onCompute}>Compute bundles</button>

        <div className='result'>
          {orderProcessingResult && orderProcessingResult.items && orderProcessingResult.items.map((item) => (
            <div key={item.code}>
              <p>{item.quantity} {item.code} {item.error ?? `$${item.totalPrice?.toFixed(2)}`}</p>
              <ul>
                {item.bundles?.map((bundle) => (
                  <li key={bundle.bundleOption}>{bundle.bundleQuantity} x {bundle.bundleOption} ${bundle.bundlePrice?.toFixed(2)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
