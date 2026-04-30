/**
 * Location Utilities
 * Converts between ISO codes and display names using country-state-city package
 */

import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';

/**
 * Get country name from ISO2 code
 * @param countryCode - ISO2 country code (e.g., "US", "IN")
 * @returns Country name or empty string if not found
 */
export const getCountryName = (countryCode: string | null | undefined): string => {
  if (!countryCode) return '';
  const country = Country.getCountryByCode(countryCode);
  return country?.name || countryCode;
};

/**
 * Get state name from state code and country code
 * @param stateCode - State ISO code (e.g., "NY", "MH")
 * @param countryCode - ISO2 country code (e.g., "US", "IN")
 * @returns State name or empty string if not found
 */
export const getStateName = (
  stateCode: string | null | undefined,
  countryCode: string | null | undefined
): string => {
  if (!stateCode || !countryCode) return '';
  const state = State.getStateByCodeAndCountry(stateCode, countryCode);
  return state?.name || stateCode;
};

/**
 * Get all countries for dropdown
 * @returns Array of countries with isoCode and name
 */
export const getAllCountries = (): ICountry[] => {
  return Country.getAllCountries();
};

/**
 * Get states for a specific country
 * @param countryCode - ISO2 country code
 * @returns Array of states with isoCode and name
 */
export const getStatesByCountry = (countryCode: string | null | undefined): IState[] => {
  if (!countryCode) return [];
  return State.getStatesOfCountry(countryCode);
};

/**
 * Get cities for a specific state and country
 * @param countryCode - ISO2 country code
 * @param stateCode - State ISO code
 * @returns Array of cities with name
 */
export const getCitiesByStateAndCountry = (
  countryCode: string | null | undefined,
  stateCode: string | null | undefined
): ICity[] => {
  if (!countryCode || !stateCode) return [];
  return City.getCitiesOfState(countryCode, stateCode);
};

/**
 * Format location data for display (full address)
 * @param city - City name
 * @param stateCode - State ISO code
 * @param countryCode - ISO2 country code
 * @param zipCode - Zip/postal code
 * @returns Formatted address string
 */
export const formatAddress = (
  city: string | null | undefined,
  stateCode: string | null | undefined,
  countryCode: string | null | undefined,
  zipCode: string | null | undefined
): string => {
  const parts: string[] = [];
  
  if (city) parts.push(city);
  
  const stateName = getStateName(stateCode, countryCode);
  if (stateName) parts.push(stateName);
  
  const countryName = getCountryName(countryCode);
  if (countryName) parts.push(countryName);
  
  if (zipCode) parts.push(zipCode);
  
  return parts.join(', ');
};

/**
 * Get country object by code
 * @param countryCode - ISO2 country code
 * @returns Country object or null
 */
export const getCountryByCode = (countryCode: string | null | undefined): ICountry | null => {
  if (!countryCode) return null;
  return Country.getCountryByCode(countryCode) || null;
};

/**
 * Get state object by code and country
 * @param stateCode - State ISO code
 * @param countryCode - ISO2 country code
 * @returns State object or null
 */
export const getStateByCode = (
  stateCode: string | null | undefined,
  countryCode: string | null | undefined
): IState | null => {
  if (!stateCode || !countryCode) return null;
  return State.getStateByCodeAndCountry(stateCode, countryCode) || null;
};
