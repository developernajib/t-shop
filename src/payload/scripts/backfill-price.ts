import path from 'path'

import dotenv from 'dotenv'
import payload from 'payload'

dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
})

/**
 * One-off migration: populate the numeric `price` field (in cents) from the
 * existing stringified `priceJSON` for products created before the
 * `populatePrice` field hook existed.
 *
 * Server-side price filtering (CollectionArchive) queries the `price` field,
 * so any product with `price == null` silently disappears when a shopper
 * applies a price filter. This backfill closes that gap offline: it reads the
 * `unit_amount` already stored in `priceJSON` and never calls Stripe.
 *
 * `skipSync: true` is passed on every update so the collection `beforeChange`
 * hook short-circuits (no Stripe lookup, `priceJSON` left untouched).
 *
 * Idempotent: products that already have a numeric `price` are skipped.
 */
const backfillPrice = async (): Promise<void> => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || '',
    local: true,
  })

  payload.logger.info('Starting price backfill from priceJSON...')

  let page = 1
  let hasNextPage = true
  let scanned = 0
  let updated = 0
  let skippedHasPrice = 0
  let skippedNoAmount = 0

  while (hasNextPage) {
    const res = await payload.find({
      collection: 'products',
      depth: 0,
      limit: 100,
      page,
      overrideAccess: true,
    })

    for (const doc of res.docs) {
      scanned += 1

      const current = (doc as { price?: unknown }).price
      if (typeof current === 'number') {
        skippedHasPrice += 1
        continue
      }

      const priceJSON = (doc as { priceJSON?: string | null }).priceJSON
      if (!priceJSON) {
        continue
      }

      let unitAmount: unknown
      try {
        unitAmount = JSON.parse(priceJSON)?.data?.[0]?.unit_amount
      } catch {
        unitAmount = undefined
      }

      if (typeof unitAmount !== 'number') {
        skippedNoAmount += 1
        payload.logger.warn(
          `Product ${doc.id} has priceJSON but no numeric unit_amount; left as-is.`,
        )
        continue
      }

      const data: Record<string, unknown> = { price: unitAmount, skipSync: true }
      await payload.update({
        collection: 'products',
        id: doc.id,
        data,
        depth: 0,
        overrideAccess: true,
      })
      updated += 1
      payload.logger.info(`Updated product ${doc.id} -> price ${unitAmount}`)
    }

    hasNextPage = res.hasNextPage
    page += 1
  }

  payload.logger.info(
    `Backfill complete. scanned=${scanned} updated=${updated} ` +
      `skippedHasPrice=${skippedHasPrice} skippedNoAmount=${skippedNoAmount}`,
  )

  process.exit(0)
}

backfillPrice().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
