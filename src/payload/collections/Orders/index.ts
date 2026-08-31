import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
import { adminsOrLoggedIn } from '../../access/adminsOrLoggedIn'
import { adminsOrOrderedBy } from './access/adminsOrOrderedBy'
import { clearUserCart } from './hooks/clearUserCart'
import { populateOrderedBy } from './hooks/populateOrderedBy'
import { updateProductStock } from './hooks/updateProductStock'
import { updateUserPurchases } from './hooks/updateUserPurchases'
import { LinkToPaymentIntent } from './ui/LinkToPaymentIntent'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'createdAt',
    defaultColumns: ['createdAt', 'orderedBy', 'total', 'items'],
    preview: doc => `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/orders/${doc.id}`,
  },
  hooks: {
    afterChange: [updateUserPurchases, clearUserCart, updateProductStock],
  },
  access: {
    read: adminsOrOrderedBy,
    update: admins,
    create: adminsOrLoggedIn,
    delete: admins,
  },
  fields: [
    {
      name: 'orderedBy',
      type: 'relationship',
      relationTo: 'users',
      hooks: {
        beforeChange: [populateOrderedBy],
      },
    },
    {
      name: 'stripePaymentIntentID',
      label: 'Stripe Payment Intent ID',
      type: 'text',
      admin: {
        position: 'sidebar',
        components: {
          Field: LinkToPaymentIntent,
        },
      },
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'sku',
          label: 'Variant SKU',
          type: 'text',
        },
        {
          name: 'variantTitle',
          label: 'Variant Name',
          type: 'text',
        },
        {
          name: 'price',
          type: 'number',
          min: 0,
        },
        {
          name: 'quantity',
          type: 'number',
          min: 0,
        },
      ],
    },
  ],
}
