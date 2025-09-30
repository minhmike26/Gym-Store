import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/api'

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    api.get(`/products/${slug}`).then((res) => setProduct(res.data))
  }, [slug])

  if (!product) return <div>Loading...</div>
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <div>
        {product.imageUrl && (
          <img src={product.imageUrl} alt={product.name} style={{ width: '100%', maxWidth: 500 }} />
        )}
      </div>
      <div>
        <h2>{product.name}</h2>
        <div>{product.brand}</div>
        <div style={{ margin: '8px 0' }}>{product.description}</div>
        <div>Flavor: {product.flavor || '-'}</div>
        <div>Protein/serving: {product.proteinPerServing || '-'} g</div>
        <strong style={{ fontSize: 24 }}>${product.price?.toFixed(2)}</strong>
      </div>
    </div>
  )
}


