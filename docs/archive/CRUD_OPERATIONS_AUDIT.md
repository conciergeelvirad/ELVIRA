# CRUD Operations Audit - Hotel Management Queries

**Audit Date:** October 11, 2025  
**Location:** `src/hooks/queries/hotel-management/`

---

## ✅ 1. useGuestsQueries.ts

| Operation  | Hook Name               | Status      | Notes                                        |
| ---------- | ----------------------- | ----------- | -------------------------------------------- |
| **List**   | `useGuests(hotelId)`    | ✅ Complete | Fetches all guests with joined personal data |
| **View**   | `useGuestById(guestId)` | ✅ Complete | Fetches single guest with full details       |
| **Create** | `useCreateGuest()`      | ✅ Complete | Creates guest + personal data (2 tables)     |
| **Update** | `useUpdateGuest()`      | ✅ Complete | Updates guest and/or personal data           |
| **Delete** | `useDeleteGuest()`      | ✅ Complete | Deletes with proper FK handling              |

**Summary:** ✅ **COMPLETE** - All CRUD operations implemented

---

## ✅ 2. useAmenitiesQueries.ts

| Operation  | Hook Name               | Status      | Notes                                |
| ---------- | ----------------------- | ----------- | ------------------------------------ |
| **List**   | `useAmenities(hotelId)` | ✅ Complete | Fetches all active amenities         |
| **View**   | `useAmenityDetails(id)` | ✅ Complete | Fetches single amenity               |
| **Create** | `useCreateAmenity()`    | ✅ Complete | Creates new amenity                  |
| **Update** | `useUpdateAmenity()`    | ✅ Complete | Updates amenity                      |
| **Delete** | `useDeleteAmenity()`    | ✅ Complete | Soft delete (sets is_active = false) |

**Summary:** ✅ **COMPLETE** - All CRUD operations implemented

---

## ✅ 3. useProductQueries.ts

| Operation  | Hook Name               | Status      | Notes                       |
| ---------- | ----------------------- | ----------- | --------------------------- |
| **List**   | `useProducts(hotelId)`  | ✅ Complete | Fetches all active products |
| **View**   | `useProductDetails(id)` | ✅ Complete | Fetches single product      |
| **Create** | `useCreateProduct()`    | ✅ Complete | Creates new product         |
| **Update** | `useUpdateProduct()`    | ✅ Complete | Updates product             |
| **Delete** | `useDeleteProduct()`    | ✅ Complete | Hard delete from database   |

**Additional Queries:**

- `useProductCategories(hotelId)` - Fetches unique categories
- `useMiniBarProducts(hotelId)` - Fetches minibar-specific products

**Summary:** ✅ **COMPLETE** - All CRUD operations implemented

---

## ✅ 4. useRestaurantQueries.ts

| Operation  | Hook Name                 | Status      | Notes                          |
| ---------- | ------------------------- | ----------- | ------------------------------ |
| **List**   | `useRestaurants(hotelId)` | ✅ Complete | Fetches all restaurants        |
| **View**   | N/A                       | ⚠️ Missing  | No single restaurant view hook |
| **Create** | `useCreateRestaurant()`   | ✅ Complete | Creates new restaurant         |
| **Update** | `useUpdateRestaurant()`   | ✅ Complete | Updates restaurant             |
| **Delete** | `useDeleteRestaurant()`   | ✅ Complete | Hard delete from database      |

**Additional Queries:**

- `useRestaurantMenuItems(restaurantId)` - Fetches menu items
- `useRestaurantDineInOrders(hotelId)` - Fetches dine-in orders

**Summary:** ⚠️ **MOSTLY COMPLETE** - Missing single restaurant view hook (can use list and filter)

---

## ✅ 5. useTaskQueries.ts

| Operation  | Hook Name           | Status      | Notes                             |
| ---------- | ------------------- | ----------- | --------------------------------- |
| **List**   | `useTasks(hotelId)` | ✅ Complete | Fetches all tasks with staff info |
| **View**   | `useTask(taskId)`   | ✅ Complete | Fetches single task               |
| **Create** | `useCreateTask()`   | ✅ Complete | Creates new task                  |
| **Update** | `useUpdateTask()`   | ✅ Complete | Updates task                      |
| **Delete** | `useDeleteTask()`   | ✅ Complete | Hard delete from database         |

**Additional Queries:**

- `useTasksByStatus(hotelId, status)` - Filtered by status
- `useTasksByStaff(staffId)` - Filtered by staff
- `useUpdateTaskStatus()` - Quick status update
- `useAssignTask()` - Assign task to staff

**Summary:** ✅ **COMPLETE** - All CRUD operations implemented + extras

---

## ✅ 6. useAbsenceRequestQueries.ts

| Operation  | Hook Name                      | Status      | Notes                        |
| ---------- | ------------------------------ | ----------- | ---------------------------- |
| **List**   | `useAbsenceRequests(hotelId)`  | ✅ Complete | Fetches all absence requests |
| **View**   | `useAbsenceRequest(requestId)` | ✅ Complete | Fetches single request       |
| **Create** | `useCreateAbsenceRequest()`    | ✅ Complete | Creates new absence request  |
| **Update** | `useUpdateAbsenceRequest()`    | ✅ Complete | Updates absence request      |
| **Delete** | `useDeleteAbsenceRequest()`    | ✅ Complete | Hard delete from database    |

**Additional Queries:**

- `useAbsenceRequestsByStatus(hotelId, status)` - Filtered by status
- `useAbsenceRequestsByStaff(staffId)` - Filtered by staff
- `useUpdateAbsenceRequestStatus()` - Quick status update

**Summary:** ✅ **COMPLETE** - All CRUD operations implemented + extras

---

## ⚠️ 7. useAnnouncementQueries.ts

| Operation  | Hook Name                   | Status      | Notes                            |
| ---------- | --------------------------- | ----------- | -------------------------------- |
| **List**   | `useAnnouncements(hotelId)` | ✅ Complete | Fetches all announcements        |
| **View**   | N/A                         | ⚠️ Missing  | No single announcement view hook |
| **Create** | `useCreateAnnouncement()`   | ✅ Complete | Creates new announcement         |
| **Update** | `useUpdateAnnouncement()`   | ✅ Complete | Updates announcement             |
| **Delete** | `useDeleteAnnouncement()`   | ✅ Complete | Hard delete from database        |

**Summary:** ⚠️ **MOSTLY COMPLETE** - Missing single view hook (can use list and filter)

---

## ⚠️ 8. useAmenityRequestQueries.ts

| Operation  | Hook Name                         | Status      | Notes                        |
| ---------- | --------------------------------- | ----------- | ---------------------------- |
| **List**   | `useAmenityRequests(hotelId)`     | ✅ Complete | Fetches all amenity requests |
| **View**   | N/A                               | ⚠️ Missing  | No single request view hook  |
| **Create** | N/A                               | ❌ Missing  | No create hook               |
| **Update** | `useUpdateAmenityRequestStatus()` | ✅ Partial  | Only updates status          |
| **Delete** | `useDeleteAmenityRequest()`       | ✅ Complete | Hard delete from database    |

**Summary:** ❌ **INCOMPLETE** - Missing CREATE and full UPDATE, missing VIEW

---

## ⚠️ 9. useShopOrderQueries.ts

| Operation  | Hook Name                    | Status      | Notes                     |
| ---------- | ---------------------------- | ----------- | ------------------------- |
| **List**   | `useShopOrders(hotelId)`     | ✅ Complete | Fetches all shop orders   |
| **View**   | N/A                          | ⚠️ Missing  | No single order view hook |
| **Create** | N/A                          | ❌ Missing  | No create hook            |
| **Update** | `useUpdateShopOrderStatus()` | ✅ Partial  | Only updates status       |
| **Delete** | `useDeleteShopOrder()`       | ✅ Complete | Hard delete from database |

**Summary:** ❌ **INCOMPLETE** - Missing CREATE and full UPDATE, missing VIEW

---

## ⚠️ 10. useEmergencyContactQueries.ts

| Operation  | Hook Name                | Status      | Notes                          |
| ---------- | ------------------------ | ----------- | ------------------------------ |
| **List**   | `useEmergencyContacts()` | ✅ Complete | Fetches all emergency contacts |
| **View**   | N/A                      | ⚠️ Missing  | No single contact view hook    |
| **Create** | N/A                      | ❌ Missing  | No create hook                 |
| **Update** | N/A                      | ❌ Missing  | No update hook                 |
| **Delete** | N/A                      | ❌ Missing  | No delete hook                 |

**Summary:** ❌ **INCOMPLETE** - Only has LIST operation

---

## ⚠️ 11. useStaffQueries.ts

| Operation  | Hook Name                         | Status      | Notes                     |
| ---------- | --------------------------------- | ----------- | ------------------------- |
| **List**   | `useHotelStaffWithPersonalData()` | ✅ Complete | Fetches all staff         |
| **View**   | N/A                               | ⚠️ Missing  | No single staff view hook |
| **Create** | N/A                               | ❌ Missing  | No create hook            |
| **Update** | N/A                               | ❌ Missing  | No update hook            |
| **Delete** | N/A                               | ❌ Missing  | No delete hook            |

**Summary:** ❌ **INCOMPLETE** - Only has LIST operation

---

## 📊 Overall Summary

| File                       | List | View | Create | Update | Delete | Status             |
| -------------------------- | ---- | ---- | ------ | ------ | ------ | ------------------ |
| useGuestsQueries           | ✅   | ✅   | ✅     | ✅     | ✅     | ✅ Complete        |
| useAmenitiesQueries        | ✅   | ✅   | ✅     | ✅     | ✅     | ✅ Complete        |
| useProductQueries          | ✅   | ✅   | ✅     | ✅     | ✅     | ✅ Complete        |
| useTaskQueries             | ✅   | ✅   | ✅     | ✅     | ✅     | ✅ Complete        |
| useAbsenceRequestQueries   | ✅   | ✅   | ✅     | ✅     | ✅     | ✅ Complete        |
| useRestaurantQueries       | ✅   | ⚠️   | ✅     | ✅     | ✅     | ⚠️ Mostly Complete |
| useAnnouncementQueries     | ✅   | ⚠️   | ✅     | ✅     | ✅     | ⚠️ Mostly Complete |
| useAmenityRequestQueries   | ✅   | ⚠️   | ❌     | ⚠️     | ✅     | ❌ Incomplete      |
| useShopOrderQueries        | ✅   | ⚠️   | ❌     | ⚠️     | ✅     | ❌ Incomplete      |
| useEmergencyContactQueries | ✅   | ❌   | ❌     | ❌     | ❌     | ❌ Incomplete      |
| useStaffQueries            | ✅   | ❌   | ❌     | ❌     | ❌     | ❌ Incomplete      |

---

## 🎯 Recommendations

### High Priority (Missing Essential Operations)

1. **useEmergencyContactQueries** - Add Create, Update, Delete
2. **useStaffQueries** - Add View, Create, Update, Delete
3. **useAmenityRequestQueries** - Add Create, full Update
4. **useShopOrderQueries** - Add Create, full Update

### Medium Priority (Missing View Hooks)

5. **useRestaurantQueries** - Add `useRestaurantById()`
6. **useAnnouncementQueries** - Add `useAnnouncementById()`
7. **useAmenityRequestQueries** - Add `useAmenityRequestById()`
8. **useShopOrderQueries** - Add `useShopOrderById()`

---

## ✅ Fully Complete Files (5/11)

1. ✅ **useGuestsQueries.ts** - All CRUD operations
2. ✅ **useAmenitiesQueries.ts** - All CRUD operations
3. ✅ **useProductQueries.ts** - All CRUD operations
4. ✅ **useTaskQueries.ts** - All CRUD operations
5. ✅ **useAbsenceRequestQueries.ts** - All CRUD operations

---

## Status Legend

- ✅ **Complete** - Operation fully implemented
- ⚠️ **Partial** - Operation partially implemented or can be worked around
- ❌ **Missing** - Operation not implemented
