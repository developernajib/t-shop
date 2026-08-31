'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Media } from '../../../_components/Media'
import { Price } from '../../../_components/Price'
import { RemoveFromCartButton } from '../../../_components/RemoveFromCartButton'

import classes from './index.module.scss'

const CartItem = ({ product, title, metaImage, qty, addItemToCart, sku, variantTitle }) => {
  const [quantity, setQuantity] = useState(qty)

  const variantObj = (product as any)?.enableVariants
    ? (product as any)?.variants?.find((v: any) => v.sku === sku)
    : null
  const maxStock = variantObj ? variantObj.stock ?? 0 : (product as any)?.stock ?? 999

  const decrementQty = () => {
    const updatedQty = quantity > 1 ? quantity - 1 : 1

    setQuantity(updatedQty)
    addItemToCart({ product, quantity: Number(updatedQty), sku, variantTitle })
  }

  const incrementQty = () => {
    if (quantity >= maxStock) return
    const updatedQty = quantity + 1

    setQuantity(updatedQty)
    addItemToCart({ product, quantity: Number(updatedQty), sku, variantTitle })
  }

  const enterQty = (e: React.ChangeEvent<HTMLInputElement>) => {
    let updatedQty = Number(e.target.value)
    if (isNaN(updatedQty) || updatedQty < 1) updatedQty = 1
    if (updatedQty > maxStock) updatedQty = maxStock

    setQuantity(updatedQty)
    addItemToCart({ product, quantity: Number(updatedQty), sku, variantTitle })
  }

  return (
    <li className={classes.item} key={sku ? `${title}-${sku}` : title}>
      <Link href={`/products/${product.slug}`} className={classes.mediaWrapper}>
        {!metaImage && <span>No image</span>}
        {metaImage && typeof metaImage !== 'string' && (
          <Media className={classes.media} imgClassName={classes.image} resource={metaImage} fill />
        )}
      </Link>

      <div className={classes.itemDetails}>
        <div className={classes.titleWrapper}>
          <h6>{title}</h6>
          {variantTitle && (
            <p style={{ fontSize: '13px', color: 'var(--color-dark-500)', marginTop: '2px' }}>
              Option: {variantTitle}
            </p>
          )}
          {maxStock < 10 && (
            <p
              style={{
                fontSize: '12px',
                color:
                  maxStock > 0 ? 'var(--color-warning-500, #e67e22)' : 'var(--color-error-500)',
                marginTop: '2px',
              }}
            >
              {maxStock > 0 ? `Only ${maxStock} left in stock` : 'Out of stock'}
            </p>
          )}
          <Price product={product} button={false} />
        </div>

        <div className={classes.quantity}>
          <div className={classes.quantityBtn} onClick={decrementQty}>
            <Image
              src="/assets/icons/minus.svg"
              alt="minus"
              width={24}
              height={24}
              className={classes.qtnBt}
            />
          </div>

          <input
            type="text"
            className={classes.quantityInput}
            value={quantity}
            onChange={enterQty}
          />

          <div
            className={[classes.quantityBtn, quantity >= maxStock && classes.disabled]
              .filter(Boolean)
              .join(' ')}
            onClick={incrementQty}
            style={{
              opacity: quantity >= maxStock ? 0.3 : 1,
              cursor: quantity >= maxStock ? 'not-allowed' : 'pointer',
            }}
          >
            <Image
              src="/assets/icons/plus.svg"
              alt="plus"
              width={24}
              height={24}
              className={classes.qtnBt}
            />
          </div>
        </div>
      </div>

      <div className={classes.subtotalWrapper}>
        <Price product={product} button={false} quantity={quantity} />
        <RemoveFromCartButton product={product} sku={sku} />
      </div>
    </li>
  )
}

export default CartItem
