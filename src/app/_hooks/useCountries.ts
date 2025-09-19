import { useQuery } from "@tanstack/react-query";
import { CountryQueryVariables } from "@/app/_entities/country";

const COUNTRY_QUERY = `
  query GetCountries($filter: CountryFilterInput) {
    countries(filter: $filter) {
      code
      name
      capital
      continent {
        name
      }
      emoji
      currency
      languages {
        name
      }
    }
  }
`;

export function useCountries(filter?: CountryQueryVariables["filter"]) {
  return useQuery({
    queryKey: ["countries", filter],
    queryFn: async () => {
      const response = await fetch(
        "https://countries.trevorblades.com/graphql",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: COUNTRY_QUERY,
            variables: { filter },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch countries");
      }

      const data = await response.json();
      return data.data?.countries || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
