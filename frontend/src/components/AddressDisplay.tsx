/**
 * AddressDisplay Component
 * Displays formatted address with country and state names converted from codes
 */

import { getCountryName, getStateName } from '@/utils/locationUtils';

export interface AddressDisplayProps {
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  stateCode?: string | null;
  countryCode?: string | null;
  zipCode?: string | null;
  className?: string;
  textClassName?: string;
  label?: string;
}

export function AddressDisplay({
  addressLine1,
  addressLine2,
  city,
  stateCode,
  countryCode,
  zipCode,
  className = '',
  textClassName = 'text-secondary',
  label,
}: AddressDisplayProps) {
  // Check if address has any data
  const hasAddress = addressLine1 || addressLine2 || city || stateCode || countryCode || zipCode;

  if (!hasAddress) {
    return <span className={textClassName}>-</span>;
  }

  // Convert codes to names
  const stateName = getStateName(stateCode, countryCode);
  const countryName = getCountryName(countryCode);

  return (
    <div className={className}>
      {label && <div className="font-medium text-primary mb-1">{label}</div>}
      <div className={textClassName}>
        {addressLine1 && <div>{addressLine1}</div>}
        {addressLine2 && <div>{addressLine2}</div>}
        <div>
          {[city, stateName, countryName, zipCode].filter(Boolean).join(', ')}
        </div>
      </div>
    </div>
  );
}

/**
 * Inline address display (single line)
 */
export function InlineAddressDisplay({
  addressLine1,
  city,
  stateCode,
  countryCode,
  zipCode,
  className = '',
  textClassName = 'text-secondary',
}: Omit<AddressDisplayProps, 'addressLine2' | 'label'>) {
  const hasAddress = addressLine1 || city || stateCode || countryCode || zipCode;

  if (!hasAddress) {
    return <span className={textClassName}>-</span>;
  }

  const stateName = getStateName(stateCode, countryCode);
  const countryName = getCountryName(countryCode);

  const parts = [addressLine1, city, stateName, countryName, zipCode].filter(Boolean);

  return <span className={`${textClassName} ${className}`}>{parts.join(', ')}</span>;
}
