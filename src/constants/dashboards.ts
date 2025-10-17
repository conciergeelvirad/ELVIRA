export enum DashboardType {
  ELVIRA = 'elvira',
  HOTEL = 'hotel',
  THIRD_PARTY = 'third-party',
}

export const DASHBOARD_CONFIG = {
  [DashboardType.ELVIRA]: {
    name: 'Elvira Dashboard',
    description: 'AI-powered hotel concierge management',
    basePath: '/elvira',
  },
  [DashboardType.HOTEL]: {
    name: 'Hotel Dashboard',
    description: 'Hotel operations and management',
    basePath: '/hotel',
  },
  [DashboardType.THIRD_PARTY]: {
    name: 'Third Party Dashboard',
    description: 'Third party services and integrations',
    basePath: '/third-party',
  },
} as const;
