'use client'

import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import qs from 'qs'

import { Category, Product } from '../../../payload/payload-types'
import type { ArchiveBlockProps } from '../../_blocks/ArchiveBlock/types'
import { useFilter } from '../../_providers/Filter'
import { useDebounce } from '../../_utilities/useDebounce'
import { Card } from '../Card'
import { PageRange } from '../PageRange'
import { Pagination } from '../Pagination'

import classes from './index.module.scss'

type Result = {
  totalDocs: number
  docs: Product[]
  page: number
  totalPages: number
  hasPrevPage: boolean
  hasNextPage: boolean
  nextPage: number
  prevPage: number
}

export type Props = {
  className?: string
  relationTo?: 'products'
  populateBy?: 'collection' | 'selection'
  showPageRange?: boolean
  onResultChange?: (result: Result) => void // eslint-disable-line no-unused-vars
  limit?: number
  populatedDocs?: ArchiveBlockProps['populatedDocs']
  populatedDocsTotal?: ArchiveBlockProps['populatedDocsTotal']
  categories?: ArchiveBlockProps['categories']
}

export const CollectionArchive: React.FC<Props> = props => {
  const {
    categoryFilters,
    sort,
    priceRange,
    search,
    setCategoryFilters,
    setPriceRange,
    setSearch,
  } = useFilter()
  const debouncedSearch = useDebounce(search, 300)

  const {
    className,
    relationTo,
    showPageRange,
    onResultChange,
    limit = 10,
    populatedDocs,
    populatedDocsTotal,
  } = props

  const [results, setResults] = useState<Result>({
    totalDocs: typeof populatedDocsTotal === 'number' ? populatedDocsTotal : 0,
    docs: (populatedDocs?.map(doc => doc.value) || []) as [],
    page: 1,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 1,
    nextPage: 1,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasHydrated = useRef(false)
  const [page, setPage] = useState(1)

  const scrollToRef = useCallback(() => {
    const { current } = scrollRef
    if (current) {
      // current.scrollIntoView({
      //   behavior: 'smooth',
      // })
    }
  }, [])

  useEffect(() => {
    if (!isLoading && typeof results.page !== 'undefined') {
      // scrollToRef()
    }
  }, [isLoading, scrollToRef, results])

  useEffect(() => {
    // hydrate the block with fresh content after first render
    // don't show loader unless the request takes longer than x ms
    // and don't show it during initial hydration
    const timer: NodeJS.Timeout = setTimeout(() => {
      if (hasHydrated) {
        setIsLoading(true)
      }
    }, 500)

    const searchQuery = qs.stringify(
      {
        sort,
        where: {
          ...(categoryFilters && categoryFilters?.length > 0
            ? {
                categories: {
                  in:
                    typeof categoryFilters === 'string'
                      ? [categoryFilters]
                      : categoryFilters.map((cat: string) => cat).join(','),
                },
              }
            : {}),
          ...(debouncedSearch && debouncedSearch.trim().length > 0
            ? {
                title: {
                  like: debouncedSearch.trim(),
                },
              }
            : {}),
        },
        limit,
        page,
        depth: 1,
      },
      { encode: false },
    )

    const makeRequest = async () => {
      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/${relationTo}?${searchQuery}`,
        )
        const json = await req.json()
        clearTimeout(timer)
        hasHydrated.current = true

        let { docs } = json as { docs: Product[] }

        if (docs && Array.isArray(docs)) {
          if (priceRange.min !== undefined || priceRange.max !== undefined) {
            docs = docs.filter(doc => {
              try {
                let amount = (doc as any)?.price
                if (typeof amount !== 'number') {
                  const parsed = JSON.parse(doc.priceJSON || '{}')?.data?.[0]
                  amount = parsed?.unit_amount
                }
                if (typeof amount !== 'number') return true
                if (priceRange.min !== undefined && amount < priceRange.min) return false
                if (priceRange.max !== undefined && amount > priceRange.max) return false
                return true
              } catch {
                return true
              }
            })
          }

          setResults({
            ...json,
            docs,
            totalDocs: docs.length,
          })
          setIsLoading(false)
          if (typeof onResultChange === 'function') {
            onResultChange({
              ...json,
              docs,
              totalDocs: docs.length,
            })
          }
        }
      } catch (err) {
        console.warn(err) // eslint-disable-line no-console
        setIsLoading(false)
        setError(`Unable to load "${relationTo} archive" data at this time.`)
      }
    }

    makeRequest()

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [page, categoryFilters, relationTo, onResultChange, sort, limit, priceRange, debouncedSearch])

  const hasActiveFilters =
    categoryFilters.length > 0 ||
    priceRange.min !== undefined ||
    priceRange.max !== undefined ||
    (search && search.trim().length > 0)

  const getPriceLabel = () => {
    if (priceRange.min === 5000 && !priceRange.max) return 'Over $50'
    if (priceRange.max === 3000 && !priceRange.min) return 'Under $30'
    if (priceRange.min === 3000 && priceRange.max === 5000) return '$30 - $50'
    return 'Price filter'
  }

  return (
    <div className={[classes.collectionArchive, className].filter(Boolean).join(' ')}>
      <div ref={scrollRef} className={classes.scrollRef} />
      {!isLoading && error && <div>{error}</div>}
      <Fragment>
        {hasActiveFilters && (
          <div className={classes.activeFilters}>
            <span className={classes.activeFiltersLabel}>Active:</span>
            {search && search.trim().length > 0 && (
              <span className={classes.badge}>
                "{search}"
                <button type="button" onClick={() => setSearch('')}>
                  &times;
                </button>
              </span>
            )}
            {(priceRange.min !== undefined || priceRange.max !== undefined) && (
              <span className={classes.badge}>
                {getPriceLabel()}
                <button type="button" onClick={() => setPriceRange({})}>
                  &times;
                </button>
              </span>
            )}
            {categoryFilters.map(catId => {
              const matchedCat = categories?.find(c => (typeof c === 'object' ? c.id === catId : c === catId))
              const catTitle = typeof matchedCat === 'object' ? matchedCat.title : catId
              return (
                <span key={catId} className={classes.badge}>
                  {catTitle}
                  <button
                    type="button"
                    onClick={() => setCategoryFilters(categoryFilters.filter(id => id !== catId))}
                  >
                    &times;
                  </button>
                </span>
              )
            })}
            <button
              type="button"
              className={classes.clearAllTextBtn}
              onClick={() => {
                setCategoryFilters([])
                setPriceRange({})
                setSearch('')
              }}
            >
              Clear all
            </button>
          </div>
        )}

        {showPageRange !== false && (
          <div className={classes.pageRange}>
            <PageRange
              totalDocs={results.totalDocs}
              currentPage={results.page}
              collection={relationTo}
              limit={limit}
            />
          </div>
        )}

        <div className={classes.grid}>
          {results.docs?.map((result, index) => {
            return <Card key={index} relationTo="products" doc={result} showCategories />
          })}
        </div>

        {!isLoading && (!results.docs || results.docs.length === 0) && (
          <div className={classes.emptyState}>
            <p>No products found matching your current filters.</p>
            <button
              type="button"
              onClick={() => {
                setCategoryFilters([])
                setPriceRange({})
                setSearch('')
              }}
            >
              Clear all filters
            </button>
          </div>
        )}

        {results.totalPages > 1 && (
          <Pagination
            className={classes.pagination}
            page={results.page}
            totalPages={results.totalPages}
            onClick={setPage}
          />
        )}
      </Fragment>
    </div>
  )
}
