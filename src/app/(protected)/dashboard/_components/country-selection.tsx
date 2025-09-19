"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCountries } from "@/app/_hooks/useCountries";
import { Country } from "@/app/_entities/country";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Input } from "@/app/_components/ui/input";
import { Badge } from "@/app/_components/ui/badge";
import { X, Search, Globe } from "lucide-react";
import { hasFlag } from "country-flag-icons";
import * as Flags from "country-flag-icons/react/3x2";

interface CountrySelectionProps {
  selectedCountries: Country[];
  onSelectionChange: (countries: Country[]) => void;
  onGenerateThreats: (codes?: string[]) => void;
}

export function CountrySelection({
  selectedCountries,
  onSelectionChange,
  onGenerateThreats,
}: CountrySelectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { data: countries = [], isLoading: loading } = useCountries();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Helper function to get flag component
  const getFlagComponent = (countryCode: string) => {
    if (!hasFlag(countryCode)) {
      return null;
    }
    const FlagComponent = (
      Flags as Record<
        string,
        React.ComponentType<{ className?: string; title?: string }>
      >
    )[countryCode];
    return FlagComponent ? (
      <FlagComponent className="w-5 h-3" title={countryCode} />
    ) : null;
  };

  const filteredCountries = countries.filter(
    (country: Country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountrySelect = (country: Country) => {
    if (selectedCountries.length >= 5) {
      return; // Maximum 5 countries
    }

    if (!selectedCountries.find((c) => c.code === country.code)) {
      const updated = [...selectedCountries, country];
      onSelectionChange(updated);
      // Generate threats for the new selection immediately with explicit codes
      const updatedCodes = updated.map((c) => c.code);
      onGenerateThreats(updatedCodes);
    }
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleCountryRemove = (countryCode: string) => {
    const updated = selectedCountries.filter((c) => c.code !== countryCode);
    onSelectionChange(updated);
    // Generate threats for the updated selection immediately with explicit codes
    const updatedCodes = updated.map((c) => c.code);
    onGenerateThreats(updatedCodes);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="h-5 w-5" />
          <span>Country Selection</span>
        </CardTitle>
        <CardDescription>
          Select up to 5 countries to monitor for cybersecurity threats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative" ref={dropdownRef}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="pl-10"
          />

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Loading countries...
                </div>
              ) : (
                filteredCountries.slice(0, 20).map((country: Country) => (
                  <button
                    key={country.code}
                    onClick={() => handleCountrySelect(country)}
                    className="w-full text-left p-3 hover:bg-accent flex items-center space-x-3"
                    disabled={
                      selectedCountries.find((c) => c.code === country.code) !==
                      undefined
                    }
                  >
                    <div className="flex-shrink-0">
                      {getFlagComponent(country.code) || (
                        <span className="text-2xl">{country.emoji}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{country.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {country.capital} • {country.continent.name}
                      </div>
                    </div>
                    {selectedCountries.find((c) => c.code === country.code) && (
                      <Badge variant="secondary">Selected</Badge>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {selectedCountries.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              Selected Countries ({selectedCountries.length}/5)
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedCountries.map((country) => (
                <Badge
                  key={country.code}
                  variant="outline"
                  className="flex items-center space-x-2 py-1"
                >
                  {getFlagComponent(country.code) || (
                    <span>{country.emoji}</span>
                  )}
                  <span>{country.name}</span>
                  <button
                    onClick={() => handleCountryRemove(country.code)}
                    className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {selectedCountries.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select countries to start monitoring threats</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
