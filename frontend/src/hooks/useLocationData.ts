/**
 * Custom hook for managing location cascading dropdowns
 * Handles the logic for Country -> State -> City dependencies
 */

import { useEffect, useMemo } from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import {
  getAllCountries,
  getStatesByCountry,
  getCitiesByStateAndCountry,
} from '@/utils/locationUtils';
import type { SelectOption } from '@components/ui';

interface UseLocationDataProps<T extends Record<string, any>> {
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  countryField: keyof T;
  stateField: keyof T;
  cityField: keyof T;
}

interface UseLocationDataReturn {
  countryOptions: SelectOption[];
  stateOptions: SelectOption[];
  cityOptions: SelectOption[];
}

/**
 * Hook to manage cascading location dropdowns
 * Automatically resets dependent fields when parent field changes
 */
export function useLocationData<T extends Record<string, any>>({
  watch,
  setValue,
  countryField,
  stateField,
  cityField,
}: UseLocationDataProps<T>): UseLocationDataReturn {
  const selectedCountry = watch(countryField as any);
  const selectedState = watch(stateField as any);

  // Generate country options (memoized for performance)
  const countryOptions = useMemo<SelectOption[]>(() => {
    const countries = getAllCountries();
    return countries.map((country) => ({
      value: country.isoCode,
      label: country.name,
    }));
  }, []);

  // Generate state options based on selected country
  const stateOptions = useMemo<SelectOption[]>(() => {
    if (!selectedCountry) return [];
    const states = getStatesByCountry(selectedCountry);
    return states.map((state) => ({
      value: state.isoCode,
      label: state.name,
    }));
  }, [selectedCountry]);

  // Generate city options based on selected country and state
  const cityOptions = useMemo<SelectOption[]>(() => {
    if (!selectedCountry || !selectedState) return [];
    const cities = getCitiesByStateAndCountry(selectedCountry, selectedState);
    return cities.map((city) => ({
      value: city.name,
      label: city.name,
    }));
  }, [selectedCountry, selectedState]);

  // Reset state when country changes
  useEffect(() => {
    // Only reset if there's a selected state and the state is not valid for new country
    if (selectedState && selectedCountry) {
      const validStates = getStatesByCountry(selectedCountry);
      const isStateValid = validStates.some((s) => s.isoCode === selectedState);
      if (!isStateValid) {
        setValue(stateField as any, '' as any);
        setValue(cityField as any, '' as any);
      }
    }
  }, [selectedCountry, selectedState, setValue, stateField, cityField]);

  // Reset city when state changes
  useEffect(() => {
    // Only reset if there's a selected city and the city is not valid for new state
    if (selectedState && selectedCountry) {
      const validCities = getCitiesByStateAndCountry(selectedCountry, selectedState);
      const selectedCity = watch(cityField as any);
      if (selectedCity) {
        const isCityValid = validCities.some((c) => c.name === selectedCity);
        if (!isCityValid) {
          setValue(cityField as any, '' as any);
        }
      }
    }
  }, [selectedState, selectedCountry, setValue, cityField, watch]);

  return {
    countryOptions,
    stateOptions,
    cityOptions,
  };
}
