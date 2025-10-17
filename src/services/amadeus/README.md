# Amadeus API Integration

## Directory Structure

```
amadeus/
├── types/
│   └── index.ts     # Type definitions for the API
├── utils/
│   └── auth.ts      # Authentication utilities
└── index.ts        # Main API service functions
```

## Features

- Tour and activity search
- Location-based results
- Automatic token management
- Type-safe interfaces
- Error handling

## Usage

```typescript
import { searchActivities } from "@/services/amadeus";
import type { AmadeusActivity } from "@/services/amadeus/types";

// Search for activities
const activities = await searchActivities(
  {
    latitude: 41.9,
    longitude: 12.5,
    radius: 5,
    limit: 20,
  },
  "your-client-id",
  "your-client-secret"
);
```

## Performance Considerations

1. Authentication

   - Tokens are cached and reused
   - Automatic token renewal before expiration
   - Single token instance across requests

2. Data Management

   - Configurable result limits
   - Optional pagination support
   - Category filtering

3. Error Handling
   - Automatic retry on auth failures
   - Comprehensive error reporting
   - Network error recovery

## Configuration

The service uses the Amadeus test environment by default. For production:

1. Update the API URLs
2. Use production credentials
3. Implement additional error handling

## Type Safety

All interfaces are fully typed for better development experience and fewer runtime errors.
