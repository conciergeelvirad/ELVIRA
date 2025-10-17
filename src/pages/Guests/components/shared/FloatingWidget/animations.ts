/**
 * Floating Widget Animations
 *
 * CSS animations for the floating widget components:
 * - Bell ringing animation when new messages arrive
 * - Fade in animation for expanded buttons
 * - Badge pulse animation for unread count
 */

export const widgetAnimations = `
  @keyframes ring {
    0% { transform: rotate(0deg); }
    10% { transform: rotate(14deg); }
    20% { transform: rotate(-12deg); }
    30% { transform: rotate(14deg); }
    40% { transform: rotate(-12deg); }
    50% { transform: rotate(14deg); }
    60% { transform: rotate(-12deg); }
    70% { transform: rotate(8deg); }
    80% { transform: rotate(-8deg); }
    90% { transform: rotate(4deg); }
    100% { transform: rotate(0deg); }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes badge-pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.9;
    }
  }

  .animate-ring {
    animation: ring 0.6s ease-in-out;
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }

  .animate-badge-pulse {
    animation: badge-pulse 2s ease-in-out infinite;
  }
`;

// Tailwind classes for animations
export const animationClasses = {
  ring: "animate-ring",
  fadeIn: "animate-fade-in",
  badgePulse: "animate-badge-pulse",
} as const;
