export interface Country {
  code: string;
  name: string;
  capital: string;
  continent: {
    name: string;
  };
  emoji: string;
  currency: string;
  languages: Array<{
    name: string;
  }>;
}

export interface CountryQueryResult {
  countries: Country[];
}

export interface CountryQueryVariables {
  filter?: {
    continent?: {
      eq: string;
    };
  };
}
