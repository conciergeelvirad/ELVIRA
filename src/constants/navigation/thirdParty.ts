import {
  BarChart3,
  Shield,
  Link2,
  Package,
  DollarSign,
  FileText,
  Settings,
} from 'lucide-react';
import { NavigationItem } from '../../types/navigation';

export const THIRD_PARTY_NAVIGATION: NavigationItem[] = [
  {
    id: 'overview',
    label: 'OVERVIEW',
    icon: BarChart3,
    path: '/third-party/overview',
  },
  {
    id: 'partners',
    label: 'PARTNERS',
    icon: Shield,
    path: '/third-party/partners',
  },
  {
    id: 'integrations',
    label: 'INTEGRATIONS',
    icon: Link2,
    path: '/third-party/integrations',
  },
  {
    id: 'services',
    label: 'SERVICES',
    icon: Package,
    path: '/third-party/services',
  },
  {
    id: 'billing',
    label: 'BILLING',
    icon: DollarSign,
    path: '/third-party/billing',
  },
  {
    id: 'contracts',
    label: 'CONTRACTS',
    icon: FileText,
    path: '/third-party/contracts',
  },
  {
    id: 'settings',
    label: 'SETTINGS',
    icon: Settings,
    path: '/third-party/settings',
  },
];
