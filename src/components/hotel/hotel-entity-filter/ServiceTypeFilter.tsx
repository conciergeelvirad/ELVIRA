/**
 * Service Type Filter Component
 *
 * Filter for menu item service types (breakfast, lunch, dinner)
 */

import React from "react";
import { FilterPanel } from "../../common/FilterPanel";

interface ServiceTypeFilterProps {
  selectedServiceTypes: string[];
  onServiceTypeToggle: (serviceType: string) => void;
}

const serviceTypes = ["breakfast", "lunch", "dinner"];

export const ServiceTypeFilter: React.FC<ServiceTypeFilterProps> = ({
  selectedServiceTypes,
  onServiceTypeToggle,
}) => {
  return (
    <FilterPanel.Section title="Service Type">
      {serviceTypes.map((type) => (
        <FilterPanel.Checkbox
          key={type}
          label={type.charAt(0).toUpperCase() + type.slice(1)}
          checked={selectedServiceTypes.includes(type)}
          onChange={() => onServiceTypeToggle(type)}
        />
      ))}
    </FilterPanel.Section>
  );
};
