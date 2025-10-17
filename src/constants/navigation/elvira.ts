import {
  BarChart3,
  Bot,
  MessageSquare,
  Settings,
  TrendingUp,
  Database,
} from 'lucide-react';
import { NavigationItem } from '../../types/navigation';

export const ELVIRA_NAVIGATION: NavigationItem[] = [
  {
    id: 'overview',
    label: 'OVERVIEW',
    icon: BarChart3,
    path: '/elvira/overview',
  },
  {
    id: 'ai-support',
    label: 'AI SUPPORT',
    icon: Bot,
    path: '/elvira/ai-support',
  },
  {
    id: 'conversations',
    label: 'CONVERSATIONS',
    icon: MessageSquare,
    path: '/elvira/conversations',
  },
  {
    id: 'analytics',
    label: 'ANALYTICS',
    icon: TrendingUp,
    path: '/elvira/analytics',
  },
  {
    id: 'knowledge-base',
    label: 'KNOWLEDGE BASE',
    icon: Database,
    path: '/elvira/knowledge-base',
  },
  {
    id: 'settings',
    label: 'SETTINGS',
    icon: Settings,
    path: '/elvira/settings',
  },
];
