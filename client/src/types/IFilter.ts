export interface PriceRange {
  min: number;
  max: number;
}

export interface SelectedFilters {
  subjects: string[];
  languages: string[];
  skills: string[];
  experienceLevels: string[];
  availableDays: string[];
  priceRange: PriceRange;
  sortBy: "price_low_high" | "price_high_low" | "name_asc" | "name_desc";
}
