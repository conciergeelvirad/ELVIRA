# Components Documentation

## Restaurant Management Components

### RestaurantFormModal

The RestaurantFormModal component uses the following dependencies:

```typescript
// From @shadcn/ui or similar form library
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// For data validation
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
```

The form follows this pattern for validation:

```typescript
const formSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  cuisine: z.enum(["Italian", "Mexican", ...]),
  description: z.string().optional(),
  food_types: z.array(z.string()).optional(),
  is_active: z.boolean().default(true),
})

type FormData = z.infer<typeof formSchema>
```

Usage:

```typescript
const form = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    name: initialData?.name || "",
    cuisine: initialData?.cuisine || "Other",
    description: initialData?.description || "",
    food_types: initialData?.food_types || [],
    is_active: initialData?.is_active ?? true,
  },
});
```
