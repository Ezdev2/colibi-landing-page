export type SearchMode = "classic" | "ai" | "offmarket";
export type ProposalKey = "one" | "two" | "three";

export type Market = {
  id: string;
  country: string;
  city: string;
  title: string;
  subtitle: string;
  strapline: string;
  note: string;
  image: string;
  defaultType: string;
  defaultLocation: string;
  stats?: {
    size: string;
    beds: string;
    pool: string;
  };
};

export type SearchFormState = {
  propertyType: string;
  location: string;
  budget: string;
  surface: string;
  availability: string;
  aiPrompt: string;
  offmarketType: string;
  offmarketArea: string;
  offmarketBudget: string;
  offmarketTiming: string;
};

export type Listing = {
  id: string;
  country: string;
  title: string;
  district: string;
  type: string;
  price: string;
  surface: string;
  suites: string;
  summary: string;
  tags: string[];
  offmarket: boolean;
  focus: string;
};
