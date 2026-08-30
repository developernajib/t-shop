'use client'

import React from 'react'

import { Category } from '../../../../payload/payload-types'
import { Checkbox } from '../../../_components/Checkbox'
import { HR } from '../../../_components/HR'
import { RadioButton } from '../../../_components/Radio'
import { useFilter } from '../../../_providers/Filter'

import classes from './index.module.scss'

const Filters = ({ categories }: { categories: Category[] }) => {
  const { categoryFilters, sort, priceRange, setCategoryFilters, setSort, setPriceRange } =
    useFilter()

  const handleCategories = (categoryId: string) => {
    if (categoryFilters.includes(categoryId)) {
      const updatedCategories = categoryFilters.filter(id => id !== categoryId)

      setCategoryFilters(updatedCategories)
    } else {
      setCategoryFilters([...categoryFilters, categoryId])
    }
  }

  const handleSort = (value: string) => setSort(value)

  const handlePriceRange = (min?: number, max?: number) => {
    if (priceRange.min === min && priceRange.max === max) {
      setPriceRange({})
    } else {
      setPriceRange({ min, max })
    }
  }

  return (
    <div className={classes.filters}>
      <div>
        <h6 className={classes.title}>Product Categories</h6>
        <div className={classes.categories}>
          {categories.map(category => {
            const isSelected = categoryFilters.includes(category.id)

            return (
              <Checkbox
                key={category.id}
                label={category.title}
                value={category.id}
                isSelected={isSelected}
                onClickHandler={handleCategories}
              />
            )
          })}
        </div>
        <HR className={classes.hr} />
        <h6 className={classes.title}>Filter by Price</h6>
        <div className={classes.categories}>
          <RadioButton
            label="All Prices"
            value="all"
            isSelected={!priceRange.min && !priceRange.max}
            onRadioChange={() => setPriceRange({})}
            groupName="price"
          />
          <RadioButton
            label="Under $30"
            value="under-30"
            isSelected={priceRange.max === 3000 && !priceRange.min}
            onRadioChange={() => handlePriceRange(undefined, 3000)}
            groupName="price"
          />
          <RadioButton
            label="$30 - $50"
            value="30-50"
            isSelected={priceRange.min === 3000 && priceRange.max === 5000}
            onRadioChange={() => handlePriceRange(3000, 5000)}
            groupName="price"
          />
          <RadioButton
            label="Over $50"
            value="over-50"
            isSelected={priceRange.min === 5000 && !priceRange.max}
            onRadioChange={() => handlePriceRange(5000, undefined)}
            groupName="price"
          />
        </div>
        <HR className={classes.hr} />
        <h6 className={classes.title}>Sort By</h6>
        <div className={classes.categories}>
          <RadioButton
            label="Latest"
            value="-createdAt"
            isSelected={sort === '-createdAt'}
            onRadioChange={handleSort}
            groupName="sort"
          />
          <RadioButton
            label="Oldest"
            value="createdAt"
            isSelected={sort === 'createdAt'}
            onRadioChange={handleSort}
            groupName="sort"
          />
          <RadioButton
            label="Title A - Z"
            value="title"
            isSelected={sort === 'title'}
            onRadioChange={handleSort}
            groupName="sort"
          />
        </div>
      </div>
    </div>
  )
}

export default Filters

