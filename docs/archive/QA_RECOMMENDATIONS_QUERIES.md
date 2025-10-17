# QA Recommendations Query Hooks

**Created:** October 11, 2025  
**Location:** `src/hooks/queries/hotel-management/useQARecommendationsQueries.ts`

---

## 📋 Overview

React Query hooks for managing hotel Q&A and recommendations. Provides CRUD operations, filtering by category/type, and search functionality for questions, answers, and recommendations provided to guests.

---

## 🗂️ Database Schema

```sql
qa_recommendations {
  id: uuid (PK)
  hotel_id: uuid (FK → hotels)
  category: text (required, non-empty)
  type: text (required, enum: 'Q&A' | 'Recommendation')
  question: text (nullable, non-empty if provided)
  answer: text (nullable, non-empty if provided)
  is_active: boolean (default: true)
  created_at: timestamp
  updated_at: timestamp
  created_by: uuid (FK → profiles)
  location: geography (nullable, for location-based recommendations)
}
```

### Type Constraint

- `type` must be either `'Q&A'` or `'Recommendation'`

### Indexes

- `hotel_id` - For filtering by hotel
- `category` - For category-based queries
- `type` - For filtering Q&A vs Recommendations
- `created_by` - For tracking creators

---

## 🔑 Query Keys Structure

```typescript
qaRecommendationsKeys = {
  all: ["qa-recommendations"],
  lists: () => ["qa-recommendations", "list"],
  list: (hotelId) => ["qa-recommendations", "list", hotelId],
  byCategory: (hotelId, category) => [
    "qa-recommendations",
    "category",
    hotelId,
    category,
  ],
  byType: (hotelId, type) => ["qa-recommendations", "type", hotelId, type],
  active: (hotelId) => ["qa-recommendations", "active", hotelId],
  details: () => ["qa-recommendations", "detail"],
  detail: (id) => ["qa-recommendations", "detail", id],
};
```

---

## 📚 Available Hooks

### Query Hooks

#### 1. `useQARecommendations(hotelId: string)`

**Purpose:** Fetch all QA recommendations for a hotel  
**Returns:** Array of QARecommendationWithDetails  
**Sorted by:** `created_at` (descending)

```typescript
const { data: recommendations, isLoading } = useQARecommendations(hotelId);
```

**Example:**

```typescript
import { useQARecommendations } from "@/hooks/queries/hotel-management/useQARecommendationsQueries";

const QAList = () => {
  const { data, isLoading, error } = useQARecommendations("hotel-uuid");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading recommendations</div>;

  return (
    <ul>
      {data?.map((item) => (
        <li key={item.id}>
          <strong>{item.category}</strong> - {item.type}
          {item.question && <p>Q: {item.question}</p>}
          {item.answer && <p>A: {item.answer}</p>}
        </li>
      ))}
    </ul>
  );
};
```

---

#### 2. `useActiveQARecommendations(hotelId: string)`

**Purpose:** Fetch only active QA recommendations  
**Returns:** Array of QARecommendationWithDetails  
**Sorted by:** `category` (ascending)

```typescript
const { data: activeItems } = useActiveQARecommendations(hotelId);
```

---

#### 3. `useQARecommendationsByCategory(hotelId: string, category: string)`

**Purpose:** Fetch QA recommendations filtered by category  
**Returns:** Array of QARecommendationWithDetails  
**Filter:** Only active items  
**Sorted by:** `created_at` (descending)

```typescript
const { data: diningQAs } = useQARecommendationsByCategory(hotelId, "Dining");
```

**Example Categories:**

- "Dining"
- "Transportation"
- "Entertainment"
- "Amenities"
- "Local Attractions"
- "Hotel Services"

---

#### 4. `useQARecommendationsByType(hotelId: string, type: QARecommendationType)`

**Purpose:** Fetch by type (Q&A or Recommendation)  
**Returns:** Array of QARecommendationWithDetails  
**Filter:** Only active items  
**Sorted by:** `category` (ascending)

```typescript
// Fetch only Q&A items
const { data: qas } = useQARecommendationsByType(hotelId, "Q&A");

// Fetch only Recommendations
const { data: recommendations } = useQARecommendationsByType(
  hotelId,
  "Recommendation"
);
```

---

#### 5. `useQARecommendationById(recommendationId?: string)`

**Purpose:** Fetch a single item by ID  
**Returns:** QARecommendationWithDetails  
**Enabled:** Only when recommendationId is provided

```typescript
const { data: item } = useQARecommendationById(recommendationId);
```

---

#### 6. `useSearchQARecommendations(hotelId: string, searchText: string)`

**Purpose:** Search in questions and answers  
**Returns:** Array of QARecommendationWithDetails  
**Enabled:** Only when searchText is not empty  
**Sorted by:** `created_at` (descending)

```typescript
const { data: searchResults } = useSearchQARecommendations(
  hotelId,
  "breakfast"
);
```

---

#### 7. `useQACategories(hotelId: string)`

**Purpose:** Get all unique categories for a hotel  
**Returns:** Array of unique category strings (sorted)  
**Filter:** Only active items

```typescript
const { data: categories } = useQACategories(hotelId);
// Returns: ["Dining", "Entertainment", "Services", ...]
```

**Use Case:** Populate dropdown filters or category navigation

---

### Mutation Hooks

#### 8. `useCreateQARecommendation()`

**Purpose:** Create a new QA recommendation  
**Invalidates:** Lists, active, category, and type queries

```typescript
const createQA = useCreateQARecommendation();

createQA.mutate({
  hotel_id: hotelId,
  category: "Dining",
  type: "Q&A",
  question: "What time is breakfast served?",
  answer: "Breakfast is served from 7:00 AM to 10:30 AM daily.",
  is_active: true,
  created_by: userId,
});
```

---

#### 9. `useUpdateQARecommendation()`

**Purpose:** Update an existing item  
**Invalidates:** Lists, active, detail, category, and type queries

```typescript
const updateQA = useUpdateQARecommendation();

updateQA.mutate({
  id: itemId,
  updates: {
    answer: "Updated answer text",
    category: "Hotel Services",
  },
});
```

---

#### 10. `useDeleteQARecommendation()`

**Purpose:** Delete a QA recommendation  
**Invalidates:** All QA recommendation queries

```typescript
const deleteQA = useDeleteQARecommendation();

deleteQA.mutate(itemId);
```

---

#### 11. `useToggleQARecommendationActive()`

**Purpose:** Toggle active status  
**Invalidates:** Lists, active, detail, category, and type queries

```typescript
const toggleActive = useToggleQARecommendationActive();

toggleActive.mutate({
  id: itemId,
  isActive: false,
});
```

---

#### 12. `useBulkCreateQARecommendations()`

**Purpose:** Create multiple recommendations at once  
**Invalidates:** All QA recommendation queries

```typescript
const bulkCreate = useBulkCreateQARecommendations();

bulkCreate.mutate([
  {
    hotel_id: hotelId,
    category: "Dining",
    type: "Q&A",
    question: "Do you have vegetarian options?",
    answer: "Yes, we offer a wide variety of vegetarian dishes.",
    is_active: true,
    created_by: userId,
  },
  {
    hotel_id: hotelId,
    category: "Dining",
    type: "Recommendation",
    answer:
      "Try our signature pasta at the Italian restaurant on the 5th floor.",
    is_active: true,
    created_by: userId,
  },
]);
```

---

## 📦 Types

### QARecommendation

Base type from database table

### QARecommendationInsert

Type for inserting new recommendations

### QARecommendationUpdate

Type for updating existing recommendations

### QARecommendationType

```typescript
type QARecommendationType = "Q&A" | "Recommendation";
```

### QARecommendationWithDetails

Extended type with joined data:

```typescript
{
  ...QARecommendation,
  created_by_profile?: {
    id: string;
    email: string;
  };
  hotels?: {
    id: string;
    hotel_name: string;
  };
}
```

---

## 💡 Complete Usage Example

```typescript
import {
  useActiveQARecommendations,
  useQARecommendationsByCategory,
  useQACategories,
  useCreateQARecommendation,
  useToggleQARecommendationActive,
} from "@/hooks/queries/hotel-management/useQARecommendationsQueries";

export const QAManagementPage = () => {
  const hotelId = "your-hotel-uuid";
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Fetch categories for filter
  const { data: categories } = useQACategories(hotelId);

  // Fetch recommendations
  const { data: recommendations, isLoading } = selectedCategory
    ? useQARecommendationsByCategory(hotelId, selectedCategory)
    : useActiveQARecommendations(hotelId);

  // Mutations
  const createQA = useCreateQARecommendation();
  const toggleActive = useToggleQARecommendationActive();

  const handleCreate = () => {
    createQA.mutate({
      hotel_id: hotelId,
      category: "Services",
      type: "Q&A",
      question: "Is there room service?",
      answer: "Yes, 24/7 room service is available.",
      is_active: true,
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Q&A Management</h1>

      {/* Category Filter */}
      <select onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">All Categories</option>
        {categories?.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <button onClick={handleCreate}>Add New Q&A</button>

      {/* List */}
      <ul>
        {recommendations?.map((item) => (
          <li key={item.id}>
            <div>
              <span className="category">{item.category}</span>
              <span className="type">{item.type}</span>
            </div>
            {item.question && (
              <p>
                <strong>Q:</strong> {item.question}
              </p>
            )}
            {item.answer && (
              <p>
                <strong>A:</strong> {item.answer}
              </p>
            )}
            <button
              onClick={() =>
                toggleActive.mutate({
                  id: item.id,
                  isActive: !item.is_active,
                })
              }
            >
              {item.is_active ? "Deactivate" : "Activate"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

---

## 🔄 Query Invalidation Strategy

The mutation hooks automatically invalidate relevant queries:

- **Create:** Invalidates `lists()`, `active()`, `byCategory()`, and `byType()`
- **Update:** Invalidates `lists()`, `active()`, `detail()`, `byCategory()`, and `byType()`
- **Delete:** Invalidates all QA recommendation queries
- **Toggle Active:** Invalidates `lists()`, `active()`, `detail()`, `byCategory()`, and `byType()`
- **Bulk Create:** Invalidates all QA recommendation queries

---

## 🎯 Use Cases

### 1. Guest FAQ Section

```typescript
const { data: faqs } = useQARecommendationsByType(hotelId, "Q&A");
```

### 2. Recommendation Feed

```typescript
const { data: recommendations } = useQARecommendationsByType(
  hotelId,
  "Recommendation"
);
```

### 3. Category-based Navigation

```typescript
const { data: categories } = useQACategories(hotelId);
const { data: items } = useQARecommendationsByCategory(
  hotelId,
  selectedCategory
);
```

### 4. Search Functionality

```typescript
const [searchTerm, setSearchTerm] = useState("");
const { data: results } = useSearchQARecommendations(hotelId, searchTerm);
```

---

## 🎯 Features

- ✅ Full CRUD operations
- ✅ Type-safe (Q&A vs Recommendation)
- ✅ Category filtering
- ✅ Active/inactive filtering
- ✅ Text search (question and answer)
- ✅ Unique categories query
- ✅ Bulk creation support
- ✅ Automatic query invalidation
- ✅ TypeScript type safety
- ✅ Relationships with profiles and hotels
- ✅ Optimistic updates ready
- ✅ Error handling
- ✅ Location support (geography field)

---

## 📝 Best Practices

1. **Use Type Filtering:** Separate Q&A from Recommendations in your UI
2. **Category Organization:** Use consistent category names across the hotel
3. **Active Status:** Use soft-delete via `is_active` flag
4. **Search:** Leverage the search hook for guest-facing search features
5. **Bulk Operations:** Use bulk create for importing FAQ data
6. **Categories Hook:** Use `useQACategories` to build dynamic filters

---

## 🔮 Future Enhancements

- Location-based recommendations using the `location` geography field
- Multi-language support for questions/answers
- Rating system for recommendations
- Analytics tracking for most viewed Q&As
- AI-generated answers based on hotel context

---

## 📝 Notes

- The `location` field supports geography data for location-based recommendations
- Both `question` and `answer` can be null, but must be non-empty if provided
- Use "Recommendation" type when `question` is null (pure recommendations)
- Use "Q&A" type when both question and answer are present
- Categories are free-form text - consider standardizing them across your application
