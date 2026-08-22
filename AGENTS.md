<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
---
description:
alwaysApply: true
---

---

description: Core project architecture, folder structure, naming conventions, TypeScript, and code quality rules
globs: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"]
alwaysApply: true

---

# Project Architecture Rules

## Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **Data Fetching**: TanStack React Query v5
- **Forms**: React Hook Form + Zod
- **Auth**: NextAuth v4
- **i18n**: next-intl v4
- **Toasts**: Sonner

---

## Folder Structure

```
src/
├── app/
│   ├── api/
│   │   └── <route>/
│   │       └── route.ts                  # Route Handler (avoid exposing tokens/API URL)
│   ├── <route>/                          # kebab-case always
│   │   ├── _actions/                     # Private server actions (not reused elsewhere)
│   │   │   └── <action-name>.action.ts
│   │   ├── _components/                  # Truly private, one-off components only
│   │   │   │                             # (page-specific wrappers, unique layout shells)
│   │   │   │                             # NOT for feature sections — those go in features/
│   │   │   └── <component-name>.tsx
│   │   ├── _hooks/                       # Private hooks (not reused elsewhere)
│   │   │   └── <hook-name>.ts
│   │   ├── _utils/                       # Private utils (not reused elsewhere)
│   │   │   └── <utility-name>.ts
│   │   ├── <nested-route>/               # Nested route segment
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   ├── loading.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx                        # Root layout
│   ├── page.tsx
│   ├── error.tsx
│   ├── global-error.tsx
│   ├── not-found.tsx
│   └── loading.tsx
│
├── components/
│   ├── shared/                           # Small, generic, highly reusable (no feature logic)
│   │   └── <component-name>.tsx
│   ├── features/                         # Anything belonging to a feature domain
│   │   └── <feature-name>/               # Grouped by domain regardless of reuse count
│   │       └── <component-name>.tsx      # (home/, products/, auth/, bag/, categories/...)
│   ├── skeletons/
│   │   ├── shared/                       # Base skeleton parts (e.g. bar.skeleton.tsx)
│   │   │   └── <component-name>.skeleton.tsx
│   │   └── <feature-name>/               # Feature skeletons (e.g. product.skeleton.tsx)
│   │       └── <component-name>.skeleton.tsx
│   ├── layout/
│   │   ├── app/                          # Global UI: Navbar, Footer
│   │   │   └── <component-name>.tsx
│   │   └── <feature-name>/               # Feature layout: sidebar, auth-header
│   │       └── <component-name>.tsx
│   └── ui/                               # shadcn generated — NEVER edit manually
│       └── <component-name>.tsx
│
├── components/providers/
│   ├── app/
│   │   ├── index.tsx                     # Groups all global providers
│   │   └── components/
│   │       └── <provider>.provider.tsx
│   └── <feature-name>/
│       └── <provider-name>.provider.tsx
│
├── hooks/
│   ├── shared/                           # Non-feature-specific hooks
│   │   └── <hook-name>.ts
│   └── <feature-name>/                   # Feature-specific hooks
│       └── <hook-name>.ts
│
├── lib/
│   ├── constants/
│   │   └── <feature-name>.constant.ts
│   ├── schemes/                          # Zod validation schemas
│   │   └── <feature-name>.schema.ts
│   ├── types/
│   │   └── <feature-name>.d.ts
│   ├── utils/
│   │   └── <feature-name>.util.ts
│   ├── services/                         # API call functions (fetch wrappers)
│   │   └── <feature-name>.service.ts
│   └── actions/                          # Global server actions (reused across routes)
│       └── <feature-name>.action.ts
│
├── messages/
│   └── <language>.json                   # Flat, one-level translations
│
├── i18n/
│   ├── request.ts
│   ├── routing.ts
│   └── navigation.ts
│
├── middleware.ts
└── auth.ts
```

---

## Naming Conventions

| Type          | Convention                  | Example                                |
| ------------- | --------------------------- | -------------------------------------- |
| Route folders | kebab-case                  | `forgot-password/`, `product-details/` |
| Components    | PascalCase                  | `ProductCard.tsx`                      |
| Hooks         | camelCase + `use` prefix    | `useProducts.ts`                       |
| Schemas       | camelCase + `Schema` suffix | `loginSchema`                          |
| Services      | camelCase + feature         | `auth.service.ts`                      |
| Actions       | camelCase + `Action` suffix | `registerAction`                       |
| Constants     | SCREAMING_SNAKE_CASE        | `JSON_HEADER`, `BASE_URL`              |
| Types files   | camelCase + `.d.ts`         | `product.d.ts`                         |
| Utility files | camelCase + feature         | `date.util.ts`                         |

---

## TypeScript Rules

- Never use `any` — use `unknown` and narrow it, or define a proper type
- Always derive TypeScript types from Zod schemas using `z.infer<typeof schema>`
- Type all function return values explicitly
- Prefer discriminated unions over boolean flags

```typescript
// ✅ Good — type derived from schema
export type LoginFields = z.infer<typeof loginSchema>;

// ✅ Good — unknown narrowed
function handleError(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Unexpected error";
}

// ❌ Bad
const handler = async (data: any) => { ... };
```

---

## File Exports

- One component per file
- Named exports for all components
- Default export only for Next.js pages and layouts

```typescript
// ✅ components/features/products/ProductCard.tsx
export function ProductCard({ product }: ProductCardProps) { ... }

// ✅ app/products/page.tsx
export default function ProductsPage() { ... }
```

---

## Code Quality Rules

**Blank lines between sections** — always leave a blank line after `"use client"`, imports, constants, and between logical sections inside a component or function.

**Comments before sections** — add a short, concise comment before each logical section inside a component body. Do not write obvious or long descriptions.

```typescript
// ✅ Good — concise section comments
"use client";

import { useTranslations } from "next-intl";

export default function MyComponent() {
  // Translation
  const t = useTranslations("products");

  // State
  const [open, setOpen] = useState(false);

  // Queries
  const { data } = useProducts();

  // Functions
  function handleOpen() { setOpen(true); }

  return <></>;
}
```

**No commented-out code** — remove all dead code. If intentionally kept, add a clear comment explaining why.

**No `console.log`** — remove all console.log before committing. Use `console.error` only for caught errors if needed.

**No unused imports** — every import must be used. Unused imports increase bundle size.

**Stable keys in lists** — never use array index as a React key. Use a unique, stable identifier from the data.

```typescript
// ✅ Good
products.map((product) => <ProductCard key={product.id} product={product} />)

// ❌ Bad
products.map((product, index) => <ProductCard key={index} product={product} />)
```

---

## Import Order

```typescript
// 1. React / Next.js core
import { useState } from 'react';
import { useRouter } from 'next-intl'; // NOT next/navigation

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

// 3. Internal aliases
import { Button } from '@/components/ui/button';
import { loginSchema } from '@/lib/schemes/auth.schema';

// 4. Relative
import { ProductCard } from './ProductCard';
import type { ProductCardProps } from './types';
```

---

## Component Internal Order

Always follow this order inside every component body:

```typescript
export default function MyComponent() {
  // Translation
  // Navigation
  // State
  // Ref
  // Context
  // Hooks
  // Queries
  // Mutation
  // Form & validation
  // Variables  (flexible — use when needed)
  // Functions
  // Effects

  return <></>;
}
```

## <!--  -->

description: Next.js 14 App Router — Server vs Client components, data fetching strategy, Route Handlers, Suspense, metadata
globs: ["app/**/*.tsx", "app/**/*.ts"]
alwaysApply: false

---

# Next.js 14 App Router Rules

## Server vs Client Components

Default to Server Components. Add `"use client"` only when the component needs:

- Event listeners (`onClick`, `onChange`, etc.)
- Browser APIs (`window`, `localStorage`, etc.)
- React hooks (`useState`, `useEffect`, `useRef`, etc.)
- Third-party client-only libraries

**Never place `"use client"` on a page or layout.** Keep pages as Server Components and extract the interactive part into a child `_components/` file.

```typescript
// ✅ app/products/page.tsx — stays Server Component
export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductList products={products} />;
}

// ✅ app/products/_components/add-to-cart-button.tsx — isolated client boundary
"use client";

export function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  // ...
}
```

---

## Data Fetching Strategy

**Default: server-side fetching** — call services directly in async Server Components and wrap with `<Suspense>`.

**Client-side fetching** — only when data depends on client state, interactivity, or real-time updates. In these cases, use a Route Handler (`app/api/`) and React Query.

**Never use Axios** — use the native `fetch()` API. Next.js extends `fetch` with built-in caching, revalidation, and deduplication.

```typescript
// ✅ Server Component with Suspense
// app/products/page.tsx
import { Suspense } from "react";
import { ProductListSkeleton } from "@/components/skeletons/products/product-list.skeleton";
import { ProductList } from "./_components/product-list";

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductListSkeleton />}>
      <ProductList />
    </Suspense>
  );
}

// app/products/_components/product-list.tsx — async, so Suspense works
import { getProducts } from "@/lib/services/product.service";

export async function ProductList() {
  const products = await getProducts();
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

**Suspense only works when the child component is `async` and returns a Promise.** A non-async component wrapped in `<Suspense>` has no effect.

---

## Mutations Strategy

Always use **Server Actions** for mutations (create, update, delete).

When the mutation is triggered from a **Client Component**, combine the Server Action with a **React Query mutation** via a custom hook for better caching, revalidation, and UX.

Flow: **Server Action → Custom Hook (useMutation) → Form/Client Component**

See `03-mutations.mdc` for the full pattern.

---

## Route Handlers (`app/api/`)

Use Route Handlers only when you need to avoid exposing sensitive information (tokens, API URLs) on the client. Do not create a Route Handler for every endpoint — server-side fetching directly in Server Components is preferred.

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { JSON_HEADER } from '@/lib/constants/api.constant';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') ?? '1';

  const res = await fetch(
    `${process.env.API}/products?page=${page}`,
    {
      headers: { ...JSON_HEADER },
    }
  );

  const data = await res.json();

  return NextResponse.json(data);
}
```

---

## App Directory Files

| File               | Purpose                                                               |
| ------------------ | --------------------------------------------------------------------- |
| `layout.tsx`       | Persistent shell — wraps all children, never re-renders on navigation |
| `page.tsx`         | Route content — required in every route segment                       |
| `loading.tsx`      | Shown while server-side promises are pending (auto Suspense boundary) |
| `error.tsx`        | Catches errors in the segment — must be `"use client"`                |
| `not-found.tsx`    | Shown when `notFound()` is called inside the segment                  |
| `global-error.tsx` | Root-level error catch — required at `app/` root                      |

```typescript
// app/<route>/error.tsx
"use client";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RouteError({ error, reset }: ErrorProps) {
  return (
    <div>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## Metadata

Export `metadata` or `generateMetadata` from every page:

```typescript
// Static metadata
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our catalog',
};

// Dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProduct(params.id);

  return {
    title: product.name,
    description: product.description,
  };
}
```

---

## Server-Side Search (URL-based)

Search inputs must write to the URL (not local state) and must be debounced. Data must be fetched already filtered from the server — never fetch all data and filter in memory on the client.

```typescript
// ✅ URL-driven search with debounce
"use client";

import { useSearchParams } from "next/navigation";         // useSearchParams is NOT locale-specific
import { useDebouncedCallback } from "use-debounce";
import { useRouter, usePathname } from "@/i18n/navigation"; // useRouter & usePathname ARE locale-specific

export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Debounced to avoid a request on every keystroke
  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, 400);

  return (
    <input
      defaultValue={searchParams.get("q") ?? ""}
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
}
```

---

## Images

Always use `next/image` — never use the plain `<img>` tag. The Next.js `<Image>` component provides automatic optimization, lazy loading, WebP/AVIF output, CLS prevention, and better Core Web Vitals.

```typescript
// ✅ Good
import Image from "next/image";

<Image
  src={product.imageUrl}
  alt={product.name}
  width={400}
  height={400}
  className="object-cover"
/>

// For fill containers
<div className="relative aspect-square">
  <Image src={src} alt={alt} fill className="object-cover" />
</div>

// ❌ Bad
<img src={product.imageUrl} alt={product.name} />
```

## <!--  -->

description: Mutations flow — Server Action, custom hook with React Query, form component integration
globs: ["lib/actions/**", "hooks/**", "**/_actions/**", "**/_hooks/**", "**/*.tsx"]
alwaysApply: false

---

# Mutations Flow

Always follow this three-layer pattern for mutations triggered from Client Components:

```
Server Action  →  Custom Hook (useMutation)  →  Form / Client Component
```

---

## Layer 1 — Server Action

Place in `lib/actions/<feature>.action.ts` if reused globally, or in `app/<route>/_actions/<name>.action.ts` if private to that route.

```typescript
// lib/actions/auth.action.ts
'use server';

import { JSON_HEADER } from '@/lib/constants/api.constant';
import type { RegistrationFields } from '@/lib/schemes/auth.schema';
import type {
  APIResponse,
  RegisterResponse,
} from '@/lib/types/auth.d';

export const registerAction = async (
  fields: RegistrationFields
): Promise<APIResponse<RegisterResponse>> => {
  const response = await fetch(`${process.env.API}/auth/signup`, {
    method: 'POST',
    body: JSON.stringify(fields),
    headers: { ...JSON_HEADER },
  });

  const payload: APIResponse<RegisterResponse> =
    await response.json();

  return payload;
};
```

---

## Layer 2 — Custom Hook

Place in `hooks/<feature-name>/<hook-name>.ts` if reused, or `app/<route>/_hooks/<hook-name>.ts` if private.

Always handle `onError` inside the mutation.

```typescript
// hooks/auth/use-register.ts
'use client';

import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation'; // useSearchParams is NOT locale-specific
import { useRouter } from '@/i18n/navigation'; // useRouter IS locale-specific

import { registerAction } from '@/lib/actions/auth.action';
import type { RegistrationFields } from '@/lib/schemes/auth.schema';

export default function useRegister() {
  // Navigation
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mutation
  const { isPending, error, mutate } = useMutation({
    mutationFn: async (fields: RegistrationFields) =>
      registerAction(fields),
    onSuccess: () => {
      router.push(`/auth/login?${searchParams.toString()}`);
    },
    onError: () => {
      // Error is returned and surfaced in the form
    },
  });

  return { isPending, error, register: mutate };
}
```

---

## Layer 3 — Form Component

Place in `app/<route>/_components/<form-name>.tsx` or `components/features/<feature>/<form-name>.tsx`.

Always follow the internal order: Translation → Navigation → Hooks → Form → Functions.

```typescript
// app/auth/register/_components/register-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerSchema, type RegistrationFields } from "@/lib/schemes/auth.schema";
import useRegister from "@/hooks/auth/use-register";

export default function RegisterForm() {
  // Translation
  const t = useTranslations("auth");

  // Hooks
  const { isPending, error, register } = useRegister();

  // Form
  const form = useForm<RegistrationFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      rePassword: "",
    },
  });

  // Functions
  function onSubmit(values: RegistrationFields) {
    register(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* First name */}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              {/* Label */}
              <FormLabel>{t("firstname-label")}</FormLabel>

              {/* Field */}
              <FormControl>
                <Input
                  placeholder={t("firstname-placeholder")}
                  autoComplete="given-name"
                  {...field}
                />
              </FormControl>

              {/* Feedback */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? t("registering") : t("register")}
        </Button>

      </form>
    </Form>
  );
}
```

---

## Services vs Actions

|                 | `lib/services/`                        | `lib/actions/`                        |
| --------------- | -------------------------------------- | ------------------------------------- |
| **Runs on**     | Server (called from Server Components) | Server only (`"use server"`)          |
| **Called from** | Server Components, Route Handlers      | Client Components (via mutation hook) |
| **Use for**     | GET / read operations                  | POST / PUT / DELETE mutations         |

```typescript
// lib/services/product.service.ts — used in Server Components
export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${process.env.API}/products`, {
    next: { revalidate: 300 },
  });
  const data: APIResponse<Product[]> = await res.json();
  return data.payload;
}

// lib/actions/product.action.ts — used in mutations from Client Components
('use server');

export const deleteProductAction = async (
  id: string
): Promise<APIResponse<void>> => {
  const res = await fetch(`${process.env.API}/products/${id}`, {
    method: 'DELETE',
    headers: { ...JSON_HEADER },
  });
  return res.json();
};
```

---

## Query Key Factory

Centralize all query keys — never hardcode strings inline.

```typescript
// lib/constants/query-keys.constant.ts
export const queryKeys = {
  products: {
    all: ['products'] as const,
    list: (filters?: ProductFilters) =>
      ['products', 'list', filters] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
  },
  orders: {
    all: ['orders'] as const,
    byUser: (userId: string) => ['orders', userId] as const,
  },
} as const;
```

---

## Read Queries (Client-side)

Wrap every `useQuery` call in a custom hook. Never call `useQuery` directly inside a component.

```typescript
// hooks/products/use-products.ts
'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/constants/query-keys.constant';
import type { ProductFilters } from '@/lib/types/product.d';

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () =>
      fetch(
        `/api/products?${new URLSearchParams(filters as Record<string, string>)}`
      ).then((r) => r.json()),
    staleTime: 1000 * 60 * 5,
  });
}
```

---

## Rules Summary

- ✅ Server Actions for all mutations
- ✅ Custom hook wraps every mutation/query — never call `useMutation`/`useQuery` raw in components
- ✅ Always handle `onError` in mutation hooks
- ✅ Use Next.js `fetch()` — never Axios
- ✅ Services for reads in Server Components, Actions for mutations from Client Components
- ✅ Centralize query keys in constants
- ❌ Never fetch in `useEffect`
- ❌ Never filter/sort data on the client if it can be done on the server
<!--  -->

---

description: Forms — Zod schema definitions, React Hook Form patterns, shadcn Form components
globs: ["lib/schemes/**", "**/_components/**", "components/features/**"]

================================================================
CLEAN CODE - QUICK REFERENCE
================================================================
Keep this open while you work.
If you only remember three things:

1. Write names the next person can read.
2. Keep functions small.
3. Don't repeat yourself.
   Priority when rules clash:
   Make it work -> Make it readable -> Make it well-structured.
   ================================================================
4. # NAMES
   A good name tells you WHAT and WHY without a comment.
   BAD:
   const [data, setData] = useState(null);
   const [flag, setFlag] = useState(false);
   GOOD:
   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
   const [isCheckoutDisabled, setIsCheckoutDisabled] = useState(false);
   Rules:

- Functions are verbs: getProducts, submitOrder, isLoading.
- Booleans start with: is / has / should.
- No magic numbers. Give them a name:
  BAD: if (day > 5)
  GOOD: if (day > WORK_DAYS_PER_WEEK)
- Pick one word per concept. Don't mix get / fetch / retrieve
  for the same thing across the codebase.
- # No types inside names (strName, IProduct). The IDE shows the type.

2. # FUNCTIONS
   Small. One job. Few arguments.

- Aim for ~20 lines or less.
- A function should do ONE thing. If it does several,
  those are separate functions it calls.
  BAD - does everything:
  async function submitOrder(form) {
  // validate... format... call API... toast... redirect... log...
  }
  GOOD - each step has a name:
  async function submitOrder(form: OrderForm) {
  const data = validateOrder(form);
  const payload = formatOrder(data);
  await createOrder(payload);
  notifyOrderPlaced();
  redirectToConfirmation();
  }
  No boolean flag arguments. A flag means the function does two things - split it.
  BAD: renderItem(item, true)
  GOOD: renderActiveItem(item);
  renderInactiveItem(item);
  More rules:
- Prefer one object argument over many positional ones.
- A function either ANSWERS a question or DOES an action. Never both.
- # No hidden side effects. addProduct only adds a product.

3. # DRY (DON'T REPEAT YOURSELF)
   Copy-paste is the #1 source of bugs. If you're copying:

- Repeated JSX -> reusable component
- Repeated logic -> utility function
- Repeated useEffect /
  state logic -> custom hook
  Workflow: make it work first, then refactor.
  ================================================================

4. # COMMENTS
   Default: don't write one. A good name is better.
   AVOID:

- Comments that just restate the code.
- Commented-out code (git has the history).
- "Fixed a bug here" diary entries.
- JSDoc on every function.
  OK TO USE:
- Section headers over a GROUP of lines (// State, // Effects).
- // WARNING: or // TODO: with real context.
- # Explaining a non-obvious WHY, not WHAT.

5.  # COMPONENT STRUCTURE

    Declare things in this order inside a component, with section
    comments above each group.
    Order:
    Translation -> Navigation -> State -> Ref -> Context -> Query
    -> Mutation -> Custom hooks -> Form -> Variables -> Functions
    -> Effects
    Example:
    function ProductCard({ id }: { id: string }) {
    // Translation
    const t = useTranslations("ProductCard");
    // Navigation
    const router = useRouter();

        // State
        const [isOpen, setIsOpen] = useState(false);

        // Ref
        const cardRef = useRef<HTMLDivElement>(null);

        // Context
        const { currency } = useContext(StoreContext);

        // Query
        const { data: product } = useSuspenseQuery(productQuery(id));

        // Mutation
        const { mutate: addToCart } = useMutation({ mutationFn: addToCartAction });

        // Custom hooks
        const { isFavorite, toggleFavorite } = useFavorite(id);

        // Form
        const form = useForm({ resolver: zodResolver(reviewSchema) });

        // Variables (derived)
        const formattedPrice = formatPrice(product.price, currency);

        // Functions (handlers)
        const handleAddToCart = () => addToCart(id);

        // Effects (rare, last)
        useEffect(() => { /* ... */ }, []);
        return /* ... */;

    # }

6.  # REACT RULES OF THUMB
    DERIVE, DON'T DUPLICATE.
    If you can compute it, don't store it.
    BAD:
    const [items, setItems] = useState([]);
    const [itemCount, setItemCount] = useState(0);
    GOOD:
    const [items, setItems] = useState([]);
    const itemCount = items.length;
    DON'T PUT PROPS IN STATE.
    Use the prop directly, or derive from it.
    useEffect SHOULD BE RARE.
    If it just syncs derived state, compute it in render instead.
    USE THE RIGHT TOOL:

- Multiple state pieces change together -> useReducer
- useMemo / useCallback / memo -> only when needed,
  not by reflex
- Values not depending on props/state -> declare OUTSIDE
  the component
  OTHER:
- Use <>...</> instead of a wrapper <div> when no element is needed.
- # Don't reach for context when local state works.

7. # ERRORS & TYPES

- Use async/await, not .then() chains.
- Handle errors in ONE shared place, not a try/catch in
  every component.
- Show the user a message they understand. Never a raw error.
- Use optional chaining (a?.b?.c) for possibly-missing values.
- Never use `any`. Type from the API response, or use `unknown`
  and narrow.
  ================================================================

8. # CSS & HTML

- One styling approach per project (Tailwind OR CSS modules,
  not both).
- Flexbox vs Grid:
  Flexbox -> when content shapes the layout
  (navbar, row of items)
  Grid -> when layout shapes the content
  (page templates, card grids)
- Avoid !important. Fix the specificity instead.
- Use semantic HTML: <button>, <nav>, <section>.
  Not <div> for everything.
- Prefer min() / max() / clamp() / auto-fit over piles of
  media queries.
  ================================================================

9. # PROJECT STACK RULES
   NEXT.JS (App Router, v16):

- Middleware file is `proxy.ts` (not middleware.ts).
- Server components by default. Push 'use client' down to the
  smallest interactive leaf. Never on a whole page.
  TYPESCRIPT:
- Strict mode. No `any`.
  TAILWIND v4:
- Use semantic tokens: bg-primary, text-destructive, border-ring.
  Never raw hex.
- Reusable components are w-full, sized by the parent.
  No baked-in widths like w-82.
  SHADCN/UI:
- Use it for primitives.
  NEXT-INTL (i18n):
- Locales: /en and /ar. Flat message keys.
- Never hardcode user-facing strings.
- For RTL, use logical properties: ps-, pe-, ms-, me-,
  inset-s-0. Not left / right.
  FORMS:
- React Hook Form + Zod. One schema, shared resolver,
  no manual validation state.
  SERVER STATE:
- React Query. Gate devtools behind
  process.env.NODE_ENV === "development".
  STRUCTURE:
- Feature-based folders under src/shared/.
- Kebab-case route folders.
- One alias: @/ -> src/.
  ACCESSIBILITY:
- <label> linked to each input.
- aria-label on icon-only buttons.
- Visible focus-visible states.
- # aria-invalid + aria-describedby on error fields.
  # SELF-CHECK BEFORE YOU PUSH
  [ ] Can someone read my names and know what they do?
  [ ] Is each function doing ONE thing?
  [ ] Did I copy-paste anything that should be a
  component / hook / util?
  [ ] Any `any` in my types?
  [ ] Any hardcoded strings that should be in the i18n messages?
  [ ] Any raw colors instead of semantic tokens?
  [ ] Any useEffect I could replace with a derived value?
  [ ] Did I leave commented-out code or console.logs?
  ================================================================
  Code is read ~10x more than it's written.
  Write it for the next person.

\*\*\* End Patch
alwaysApply: false

---

# Forms — React Hook Form + Zod + shadcn

## Schema First

Always define the Zod schema in `lib/schemes/<feature>.schema.ts` before writing the form. Derive the TypeScript type from the schema — never duplicate types.

```typescript
// lib/schemes/auth.schema.ts
import { z } from 'zod';

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters'),
    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
    rePassword: z.string(),
  })
  .refine((data) => data.password === data.rePassword, {
    message: 'Passwords do not match',
    path: ['rePassword'],
  });

// Always derive types from schemas — never define separately
export type RegistrationFields = z.infer<typeof registerSchema>;
```

---

## shadcn Form Components

Always use shadcn `<Form>` components with React Hook Form. Never wire up raw native HTML forms.

The shadcn `<Form>` setup provides accessibility, consistent error display, and clean integration with `react-hook-form`'s `control`.

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginFields } from "@/lib/schemes/auth.schema";

export function LoginForm() {
  // Translation
  const t = useTranslations("auth");

  // Form
  const form = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Functions
  function onSubmit(values: LoginFields) {
    // Pass to mutation hook
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email-label")}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("email-placeholder")}
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("password-label")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={t("password-placeholder")}
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {t("login")}
        </Button>

      </form>
    </Form>
  );
}
```

---

## Field Comment Structure

Every form field must follow this comment structure:

```typescript
{/* Field name */}
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      {/* Label */}
      <FormLabel>{t("label")}</FormLabel>

      {/* Field */}
      <FormControl>
        <Input {...field} />
      </FormControl>

      {/* Feedback */}
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## Form with Mutation Hook

```typescript
export default function RegisterForm() {
  // Translation
  const t = useTranslations("auth");

  // Hooks
  const { isPending, register } = useRegister();

  // Form
  const form = useForm<RegistrationFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "", rePassword: "" },
  });

  // Functions
  function onSubmit(values: RegistrationFields) {
    register(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* fields */}
        <Button type="submit" disabled={isPending}>
          {isPending ? t("submitting") : t("submit")}
        </Button>
      </form>
    </Form>
  );
}
```

---

## Rules Summary

- ✅ All schemas go in `lib/schemes/<feature>.schema.ts`
- ✅ Always derive `type` from schema with `z.infer<typeof schema>`
- ✅ Always use shadcn `<Form>` + `<FormField>` — never raw HTML forms
- ✅ Always use `zodResolver` — never manual validation
- ✅ Use `form.formState.isSubmitting` or mutation `isPending` to disable submit
- ✅ Server-side errors go to mutation `onError` callback
- ❌ Never use `useState` to track form field values
- ❌ Never access `register()` directly — always use `<FormField>` with `control`
<!--  -->

---

description: Component architecture — categories, structure, skeletons, loading/error/empty states
globs: ["components/**/*.tsx", "app/**/_components/**/*.tsx"]
alwaysApply: false

---

# Component Architecture

## Component Categories

| Folder                            | Purpose                                           | Example                                   |
| --------------------------------- | ------------------------------------------------- | ----------------------------------------- |
| `components/shared/`              | Generic, small, highly reusable, no feature logic | `Headline.tsx`, `SectionWrapper.tsx`      |
| `components/features/<feature>/`  | Feature-specific, less customizable               | `ProductCard.tsx`, `CartSummary.tsx`      |
| `components/skeletons/<feature>/` | Feature skeleton loaders                          | `product-card.skeleton.tsx`               |
| `components/skeletons/shared/`    | Base skeleton building blocks                     | `bar.skeleton.tsx`, `circle.skeleton.tsx` |
| `components/layout/app/`          | Global persistent UI                              | `Navbar.tsx`, `Footer.tsx`                |
| `components/layout/<feature>/`    | Feature-level layout UI                           | `AuthHeader.tsx`, `DashboardSidebar.tsx`  |
| `components/ui/`                  | shadcn generated — never edit                     | `button.tsx`, `input.tsx`                 |
| `app/<route>/_components/`        | Private components, not reused elsewhere          | `register-form.tsx`                       |

---

## Props Pattern

Every component that accepts props must have an explicit typed interface. Always pass all required props — never assume defaults unless the prop is explicitly marked optional.

```typescript
// ✅ Good
interface ProductCardProps {
  product: Product;
  className?: string;
  onAddToCart?: (id: string) => void;
}

export function ProductCard({
  product,
  className,
  onAddToCart,
}: ProductCardProps) {
  // ...
}
```

---

## Loading / Error / Empty States

Every data-driven component must handle all three states:

```typescript
// components/features/products/product-list.tsx
"use client";

export function ProductList({ filters }: { filters: ProductFilters }) {
  // Queries
  const { data: products, isLoading, isError } = useProducts(filters);

  // Loading state
  if (isLoading) return <ProductListSkeleton />;

  // Error state
  if (isError) return <ErrorState message="Failed to load products" />;

  // Empty state
  if (!products?.length) return <EmptyState title="No products found" />;

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
```

---

## Skeleton Pattern

Create a skeleton for every data-driven component. Place it in `components/skeletons/<feature>/`.

Build feature skeletons using base shared skeleton components from `components/skeletons/shared/`.

```typescript
// components/skeletons/shared/bar.skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface BarSkeletonProps {
  className?: string;
}

export function BarSkeleton({ className }: BarSkeletonProps) {
  return <Skeleton className={cn("h-4 rounded", className)} />;
}

// components/skeletons/products/product-card.skeleton.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarSkeleton } from "@/components/skeletons/shared/bar.skeleton";

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <CardContent className="space-y-2 p-4">
        <BarSkeleton className="w-3/4" />
        <BarSkeleton className="w-1/2" />
      </CardContent>
    </Card>
  );
}

// Feature list skeleton
export function ProductListSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Index as key is acceptable here — items are static placeholders with no identity or state */}
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i}>
          <ProductCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
```

---

## Suspense Wrapping (Server Components)

When a component fetches data server-side, the parent wraps it in `<Suspense>` with a skeleton fallback. The fetching component must be `async`.

```typescript
// app/products/page.tsx — Server Component, no "use client"
import { Suspense } from "react";
import { ProductListSkeleton } from "@/components/skeletons/products/product-list.skeleton";
import { ProductList } from "./_components/product-list";

export default function ProductsPage() {
  return (
    <section>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList />
      </Suspense>
    </section>
  );
}

// app/products/_components/product-list.tsx — must be async
import { getProducts } from "@/lib/services/product.service";

export async function ProductList() {
  const products = await getProducts();
  // ...
}
```

---

## Dialog Pattern

```typescript
// components/shared/confirm-dialog.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  isPending?: boolean;
  variant?: "default" | "destructive";
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isPending,
  variant = "default",
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className={
              variant === "destructive"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }
          >
            {isPending ? "Loading..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

---

## Rules Summary

- ✅ Match the component to its correct category folder
- ✅ Every data-driven component handles loading, error, and empty states
- ✅ Every data-driven component has a matching skeleton
- ✅ All required props must always be passed — unless explicitly optional
- ✅ Use `key={item.id}` — never `key={index}`
- ✅ Accept and forward `className` prop for composability
- ❌ Never use `React.FC` type — use regular function declarations
- ❌ Never import from a sibling feature folder — promote to `components/shared/`
- ❌ Never edit files inside `components/ui/`
<!--  -->

---

description: Styling — Tailwind CSS conventions, shadcn/ui usage, cn utility, text casing, no static values
globs: ["**/*.tsx", "**/*.ts"]
alwaysApply: false

---

# Styling — Tailwind CSS + shadcn/ui

## Pixel-Perfect UI

The UI must match the Figma design **exactly**. Every component must be implemented to pixel-perfect accuracy — spacing, font sizes, colors, border radius, shadows, and responsive breakpoints must all match the design spec precisely.

Before marking any UI task complete:

- Compare side-by-side with the Figma frame
- Check all breakpoints (`sm`, `md`, `lg`, `xl`)
- Verify spacing, padding, and margin values match the design tokens
- Never approximate — if a value doesn't map to a Tailwind class, check the design token or use the exact value from the design system

---

## shadcn/ui Rules

Never manually edit files inside `components/ui/`. They are generated and owned by shadcn.

Add components via CLI only:

```bash
npx shadcn@latest add [component-name]
```

Extend by wrapping — never by modifying the source:

```typescript
// ✅ Extend by wrapping — components/shared/loading-button.tsx
import { Loader2 } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

export function LoadingButton({
  isLoading,
  loadingText,
  children,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={isLoading || disabled} {...props}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isLoading && loadingText ? loadingText : children}
    </Button>
  );
}
```

---

## `cn()` Utility

Use `cn()` whenever you need JavaScript logic inside a `className`. Never use string concatenation or template literals for conditional classes.

```typescript
import { cn } from "@/lib/utils";

// ✅ Good
<div className={cn(
  "base-class another-class",
  isActive && "active-class",
  variant === "destructive" && "text-destructive border-destructive",
  className
)} />

// ❌ Bad
<div className={`base-class ${isActive ? "active-class" : ""}`} />
<div className={"base-class " + (isActive ? "active-class" : "")} />
```

---

## No Static Values in Tailwind

Do not use arbitrary static values like `w-[1280px]`. Always use Tailwind's built-in utility scale. Use the `container` class for consistent page-width layouts.

```typescript
// ✅ Good
<div className="container mx-auto px-4">
<div className="w-full max-w-7xl">
<div className="h-12 w-12">

// ❌ Bad
<div className="w-[1280px]">
<div className="h-[48px] w-[48px]">
```

---

## Text Casing — Use CSS, Not Content

Control text case with Tailwind utility classes. Never hardcode content in uppercase or lowercase in JSX.

```typescript
// ✅ Good — easy to change later without editing content
<h2 className="uppercase tracking-widest">section title</h2>
<span className="capitalize">category name</span>

// ❌ Bad — hardcoded, hard to update
<h2>SECTION TITLE</h2>
<span>Category Name</span>
```

---

## Dark Mode — Use CSS Variables

All colors must use shadcn's CSS variable tokens, not hardcoded Tailwind color values. This ensures dark mode works automatically.

```typescript
// ✅ Good — works in both light and dark mode
<div className="bg-background text-foreground">
<p className="text-muted-foreground">
<div className="border border-border bg-card text-card-foreground">
<span className="text-destructive">

// ❌ Bad — breaks in dark mode
<div className="bg-white text-gray-900">
<p className="text-gray-500">
<div className="border border-gray-200 bg-white">
```

---

## CVA for Component Variants

Use `class-variance-authority` for components that have multiple visual variants:

```typescript
// components/shared/status-badge.tsx
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      status: {
        active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        inactive: "bg-muted text-muted-foreground",
        pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        error: "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      status: "active",
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return <span className={cn(badgeVariants({ status }), className)} />;
}
```

---

## Lucide Icons

```typescript
// Always set size via className — not the size prop
import { ShoppingCart, Trash2 } from "lucide-react";

<ShoppingCart className="h-5 w-5" />
<Trash2 className="h-4 w-4 text-destructive" />
```

---

## Composability — Accept `className`

Every reusable component should accept and forward a `className` prop:

```typescript
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
}

export function Section({ title, className, children, ...props }: SectionProps) {
  return (
    <section className={cn("py-12", className)} {...props}>
      <h2 className="text-2xl font-bold">{title}</h2>
      {children}
    </section>
  );
}
```

---

## Rules Summary

- ✅ UI must be pixel-perfect — match the Figma design exactly at all breakpoints
- ✅ Use `cn()` for all conditional/merged classNames
- ✅ Use Tailwind utility scale — no arbitrary static values
- ✅ Use CSS text casing (`uppercase`, `capitalize`) — not hardcoded content
- ✅ Use shadcn CSS variable tokens for all colors
- ✅ Use `container` class for page-width layouts
- ✅ Accept and forward `className` prop in reusable components
- ❌ Never edit `components/ui/` files
- ❌ Never use string concatenation for class names
- ❌ Never use hardcoded color values like `text-gray-500`
<!--  -->

---

description: next-intl v4 — flat translations, navigation imports, RTL support for Arabic, routing config
globs: ["i18n/**", "messages/**", "**/*.tsx", "**/*.ts", "middleware.ts"]
alwaysApply: false

---

# Internationalization — next-intl v4

## Supported Locales

```typescript
// i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
});

export type Locale = (typeof routing.locales)[number];
```

---

## Flat Translations — No Nesting

Translation keys must be one-level flat. Never use nested objects inside translation files.

```json
// ✅ messages/ar.json — flat, one level
{
  "login-title": "تسجيل الدخول",
  "login-email-label": "البريد الإلكتروني",
  "login-email-placeholder": "example@email.com",
  "login-password-label": "كلمة المرور",
  "login-submit": "دخول",
  "register-title": "إنشاء حساب",
  "register-firstname-label": "الاسم الأول"
}

// ❌ Bad — nested translations
{
  "login": {
    "title": "تسجيل الدخول",
    "email": { "label": "البريد الإلكتروني" }
  }
}
```

---

## Navigation Imports

Always import navigation utilities from `next-intl` or the project's `i18n/navigation.ts` — never from `next/navigation`. This ensures locale handling works correctly.

```typescript
// i18n/navigation.ts
import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
```

```typescript
// ✅ Good — locale-aware navigation
import { useRouter, usePathname, Link } from '@/i18n/navigation';

// ✅ Good — next-intl hooks
import { useTranslations, useLocale } from 'next-intl';

// ❌ Bad — bypasses locale handling
import { useRouter, usePathname, Link } from 'next/navigation';
```

---

## Using Translations in Server Components

```typescript
// app/products/page.tsx
import { getTranslations } from "next-intl/server";

export default async function ProductsPage() {
  const t = await getTranslations();

  return <h1>{t("products-title")}</h1>;
}
```

---

## Using Translations in Client Components

```typescript
"use client";

import { useTranslations } from "next-intl";

export function AddToCartButton() {
  // Translation
  const t = useTranslations();

  return <button>{t("product-add-to-cart")}</button>;
}
```

---

## RTL Support

Set `dir` on the root `<html>` element based on locale:

```typescript
// app/[locale]/layout.tsx
import { routing } from "@/i18n/routing";

const rtlLocales = ["ar"];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dir = rtlLocales.includes(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body>{children}</body>
    </html>
  );
}
```

---

## RTL-aware Tailwind Classes

Use logical CSS properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`) in shared components instead of directional properties. This ensures layout works correctly in both LTR and RTL.

```typescript
// ✅ Good — works in Arabic (RTL) and English (LTR)
<div className="ms-4 pe-6 text-start">
<ul className="ps-4">

// ❌ Bad — breaks in RTL
<div className="ml-4 pr-6 text-left">
<ul className="pl-4">
```

---

## Number & Date Formatting

Always use locale-aware formatting with `Intl`:

```typescript
// ✅ Good
const formatted = new Intl.NumberFormat(locale, {
  style: 'currency',
  currency: 'EGP',
}).format(price);

const date = new Intl.DateTimeFormat(locale, {
  dateStyle: 'long',
}).format(new Date(createdAt));
```

---

## next-intl Middleware

```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
```

---

## Rules Summary

- ✅ Flat (one-level) translation keys only — never nested
- ✅ Import `useRouter`, `usePathname`, `Link` from `@/i18n/navigation` — not `next/navigation`
- ✅ Use logical Tailwind classes (`ms-*`, `ps-*`, `text-start`) in shared components
- ✅ Set `dir` on `<html>` from locale
- ✅ Pass `locale` to all `Intl` number/date formatters
- ❌ Never use `text-left` / `text-right` in shared/reusable components
<!--  -->

---

description: NextAuth v4 — auth.ts config, session types, route protection via middleware
globs: ["auth.ts", "middleware.ts", "lib/actions/auth.action.ts", "hooks/auth/**"]
alwaysApply: false

---

# Authentication — NextAuth v4

## Config (`auth.ts`)

NextAuth config lives at `auth.ts` in the project root (next to `middleware.ts`).

```typescript
// auth.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { loginSchema } from '@/lib/schemes/auth.schema';

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const res = await fetch(`${process.env.API}/auth/login`, {
          method: 'POST',
          body: JSON.stringify(parsed.data),
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) return null;

        const user = await res.json();

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: user.token,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.token;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.accessToken = token.accessToken as string;
      return session;
    },
  },
});
```

---

## Route Handler for NextAuth

```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth';

export const { GET, POST } = handlers;
```

---

## Type Augmentation

```typescript
// lib/types/next-auth.d.ts
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      role: string;
      accessToken: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    accessToken: string;
  }
}
```

---

## Getting Session

```typescript
// Server Components / Route Handlers
import { auth } from "@/auth";
import { redirect } from "@/i18n/navigation";

export default async function ProtectedPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  return <div>Hello, {session.user.name}</div>;
}

// Client Components
"use client";

import { useSession } from "next-auth/react";

export function UserMenu() {
  // Hooks
  const { data: session, status } = useSession();

  if (status === "loading") return <UserMenuSkeleton />;
  if (!session) return null;

  return <div>{session.user.name}</div>;
}
```

---

## Middleware — Auth + i18n Combined

```typescript
// middleware.ts
import { auth } from '@/auth';
import createIntlMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';

import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

const protectedRoutes = ['/dashboard', '/profile', '/checkout'];

export default auth(function middleware(req: NextRequest) {
  const { nextUrl, auth: session } = req as NextRequest & {
    auth: unknown;
  };
  const isProtected = protectedRoutes.some((route) =>
    nextUrl.pathname.includes(route)
  );

  if (isProtected && !session) {
    return Response.redirect(new URL('/auth/login', req.url));
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
```

---

## Rules Summary

- ✅ Auth config lives in `auth.ts` at project root
- ✅ Augment `Session` and `JWT` types in `lib/types/next-auth.d.ts`
- ✅ Protect routes in `middleware.ts` — not inside pages
- ✅ Use `auth()` in Server Components for session
- ✅ Use `useSession()` in Client Components for session
- ❌ Never expose raw tokens in session without type augmentation
<!--  -->

---

description: Error handling, Sonner toasts, performance patterns, providers setup
globs: ["**/*.ts", "**/*.tsx", "providers/**"]
alwaysApply: false

---

# Error Handling, Toasts & Performance

## Sonner Toast Patterns

Import `toast` from `sonner`. Use it inside mutation `onSuccess`/`onError` callbacks or event handlers — never inside render.

```typescript
import { toast } from 'sonner';

// Success
toast.success('Product created successfully');

// Error
toast.error('Failed to delete product');

// With description
toast.error('Upload failed', {
  description: 'File size must be under 5MB',
});

// Promise — best for async operations with loading state
toast.promise(saveProduct(data), {
  loading: 'Saving...',
  success: 'Saved!',
  error: 'Failed to save',
});
```

---

## API Error Handling

```typescript
// lib/utils/error.util.ts

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred';
}
```

Always handle errors in mutation hooks — not in components:

```typescript
// hooks/products/use-delete-product.ts
const { mutate } = useMutation({
  mutationFn: (id: string) => deleteProductAction(id),
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.products.all,
    });
    toast.success('Product deleted');
  },
  onError: (error) => {
    toast.error(getErrorMessage(error));
  },
});
```

---

## Providers Setup

Group all global providers in `providers/app/index.tsx`. Never scatter provider wrappers across different layout files.

```typescript
// providers/app/components/query-provider.provider.tsx
"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // State
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

// providers/app/index.tsx
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import { QueryProvider } from "./components/query-provider.provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
```

```typescript
// app/layout.tsx
import { AppProviders } from "@/providers/app";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
```

---

## Performance — Dynamic Imports

Use `next/dynamic` to lazy-load heavy components that are not needed on initial render:

```typescript
import dynamic from "next/dynamic";

import { CarouselSkeleton } from "@/components/skeletons/shared/carousel.skeleton";

const HeroCarousel = dynamic(
  () => import("@/components/features/home/hero-carousel"),
  {
    ssr: false,
    loading: () => <CarouselSkeleton />,
  }
);
```

---

## Constants File Structure

```typescript
// lib/constants/api.constant.ts
export const JSON_HEADER = {
  'Content-Type': 'application/json',
} as const;

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
```

---

## Stale Time Guidelines

```typescript
// lib/constants/query.constant.ts
export const STALE_TIMES = {
  REAL_TIME: 0, // Live data (prices, stock)
  SHORT: 1000 * 30, // 30 seconds
  STANDARD: 1000 * 60 * 5, // 5 minutes (default)
  LONG: 1000 * 60 * 30, // 30 minutes (static lists)
  PERMANENT: Infinity, // User preferences, config
} as const;
```

---

## Rules Summary

- ✅ All global providers go in `providers/app/index.tsx`
- ✅ Toast calls go in mutation callbacks — never in render
- ✅ Always handle `onError` in mutations with `toast.error`
- ✅ Use `next/dynamic` for heavy client-only components
- ✅ Set `staleTime` explicitly on all queries
- ✅ Centralize API headers in `lib/constants/api.constant.ts`
- ❌ Never leave `console.log` in committed code
<!--  -->
