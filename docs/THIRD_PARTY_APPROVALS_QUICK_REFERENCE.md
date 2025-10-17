# Quick Reference: useThirdPartyApprovals

## 📋 Import

```typescript
import {
  useThirdPartyApprovals,
  useApprovedThirdParties,
  usePendingApprovals,
  useApproveThirdParty,
  useRejectThirdParty,
  useApprovalStatistics,
} from "@/hooks/queries/useThirdPartyApprovals";
```

## 🔍 Queries

| Hook                                             | Purpose       | Example                                                           |
| ------------------------------------------------ | ------------- | ----------------------------------------------------------------- |
| `useThirdPartyApprovals(hotelId, filters?)`      | All approvals | `const { data } = useThirdPartyApprovals(hotelId)`                |
| `useApprovedThirdParties(hotelId, type?)`        | Approved only | `const { data } = useApprovedThirdParties(hotelId, 'RESTAURANT')` |
| `usePendingApprovals(hotelId, type?)`            | Pending only  | `const { data } = usePendingApprovals(hotelId)`                   |
| `useThirdPartyApprovalStatus(hotelId, id, type)` | Check status  | `const { data } = useThirdPartyApprovalStatus(...)`               |
| `useApprovalStatistics(hotelId)`                 | Stats         | `const { data: stats } = useApprovalStatistics(hotelId)`          |

## ✏️ Mutations

| Hook                            | Purpose | Example                                                                    |
| ------------------------------- | ------- | -------------------------------------------------------------------------- |
| `useCreateThirdPartyApproval()` | Create  | `await create.mutateAsync({ hotel_id, third_party_id, third_party_type })` |
| `useApproveThirdParty()`        | Approve | `await approve.mutateAsync({ id, approvedBy })`                            |
| `useRejectThirdParty()`         | Reject  | `await reject.mutateAsync({ id, approvedBy })`                             |
| `useDeleteThirdPartyApproval()` | Delete  | `await del.mutateAsync(id)`                                                |
| `useBulkApproveThirdParties()`  | Bulk    | `await bulk.mutateAsync({ ids, approvedBy, hotelId })`                     |

## 🎯 Common Patterns

### Get Pending Approvals Count

```typescript
const { data: pending } = usePendingApprovals(hotelId);
const count = pending?.length || 0;
```

### Approve Button with Loading

```typescript
const approveMutation = useApproveThirdParty();

<button
  onClick={() => approveMutation.mutateAsync({ id, approvedBy })}
  disabled={approveMutation.isPending}
>
  {approveMutation.isPending ? "Approving..." : "Approve"}
</button>;
```

### Filter Restaurants Only

```typescript
const { data } = useApprovedThirdParties(hotelId, "RESTAURANT");
```

### Statistics Dashboard

```typescript
const { data: stats } = useApprovalStatistics(hotelId);

<div>
  <p>Total: {stats?.total}</p>
  <p>Pending: {stats?.pending}</p>
  <p>Approved: {stats?.approved}</p>
</div>;
```

## 🏷️ Types

```typescript
type ThirdPartyType = "RESTAURANT" | "TOUR AGENCY";
type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

interface ThirdPartyApproval {
  id: string;
  hotel_id: string;
  third_party_id: string;
  third_party_type: ThirdPartyType;
  status: ApprovalStatus;
  created_at: string;
  updated_at: string;
  approved_by: string | null;
}
```

## 🔑 Query Keys

```typescript
["third-party-approvals", hotelId, filters][
  ("third-party-approval-status", hotelId, thirdPartyId, type)
][("third-party-approval-statistics", hotelId)];
```

## ⚡ Quick Tips

1. **Always check loading**: `if (isLoading) return <Loading />`
2. **Handle errors**: `if (isError) return <Error />`
3. **Use convenience hooks**: `useApprovedThirdParties` vs manual filtering
4. **Bulk operations**: For multiple items, use `useBulkApproveThirdParties`
5. **Cache is automatic**: Mutations auto-invalidate relevant queries

## 🎨 Example Component

```typescript
function ApprovalsList({ hotelId, userId }) {
  const { data: pending } = usePendingApprovals(hotelId);
  const approveMutation = useApproveThirdParty();

  return (
    <div>
      {pending?.map((item) => (
        <div key={item.id}>
          <span>{item.third_party_type}</span>
          <button
            onClick={() =>
              approveMutation.mutateAsync({
                id: item.id,
                approvedBy: userId,
              })
            }
          >
            Approve
          </button>
        </div>
      ))}
    </div>
  );
}
```

## 📚 Full Documentation

See `src/hooks/queries/useThirdPartyApprovals.README.md` for complete documentation.
