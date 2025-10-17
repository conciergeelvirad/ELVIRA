import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  User,
  Building,
  Tag,
} from "lucide-react";
import { DataField } from "./FieldFormatters";

export const fieldIcons = {
  email: Mail,
  phone: Phone,
  url: MapPin,
  date: Calendar,
  datetime: Clock,
  status: Tag,
  badge: Tag,
  text: User,
  custom: Building,
};

export const getFieldIcon = (field: DataField): React.ReactNode => {
  if (field.icon) {
    return field.icon;
  }

  const IconComponent = fieldIcons[field.type || "text"];
  return <IconComponent size={16} className="text-gray-400" />;
};
