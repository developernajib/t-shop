'use client'

import { createContext, ReactNode, SetStateAction, useContext, useState } from 'react'

interface IContextType {
  categoryFilters: string[]
  setCategoryFilters: React.Dispatch<SetStateAction<string[]>>
  sort: string
  setSort: React.Dispatch<SetStateAction<string>>
  priceRange: { min?: number; max?: number }
  setPriceRange: React.Dispatch<SetStateAction<{ min?: number; max?: number }>>
}

export const INITIAL_FILTER_DATA: IContextType = {
  categoryFilters: [],
  setCategoryFilters: () => [],
  sort: '',
  setSort: () => '',
  priceRange: {},
  setPriceRange: () => ({}),
}

const FilterContext = createContext<IContextType>(INITIAL_FILTER_DATA)

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [categoryFilters, setCategoryFilters] = useState<string[]>([])
  const [sort, setSort] = useState<string>('-createdAt')
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({})

  return (
    <FilterContext.Provider
      value={{
        categoryFilters,
        setCategoryFilters,
        sort,
        setSort,
        priceRange,
        setPriceRange,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const useFilter = () => useContext(FilterContext)
