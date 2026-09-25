export type SortOption =
  | "all"
  | "price_low_high"
  | "price_high_low"
  | "name_asc"
  | "name_desc";

export interface PriceRange {
  min: number;
  max: number;
}

export interface SelectedFilters {
  subjects: string[];
  languages: string[];
  experienceLevels: string[];
  availableDays: string[];
  priceRange: PriceRange;
  sortBy: SortOption;
}

export interface SubjectCount {
  subject: string;
  count: number;
}

export interface FilterOptions {
  subjects: string[];
  languages: string[];
  experienceLevels: string[];
}