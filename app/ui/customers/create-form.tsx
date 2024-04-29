'use client';
import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { useFormState } from 'react-dom';
import { createCustomer } from '@/app/lib/actions';


export default function NewCustomerForm() {
    const initialState = { message: null, errors: {} };
    const [state, dispatch] = useFormState(createCustomer, initialState);

    return (
        <form action={dispatch}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Customer Name */}
                <div className="mb-4">
                    <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                    Customer Name
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                          <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter Full Name"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                          />
                        </div>
{/*                         <div id="name-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.name &&
                            state.errors.name.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                            ))}
                        </div>
 */}                    </div>
                    <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                    Customer Name
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                          <input
                            id="email"
                            name="email"
                            type="text"
                            placeholder="Enter Email Address"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                          />
                        </div>
{/*                         <div id="name-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.name &&
                            state.errors.name.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                            ))}
                        </div>
 */}                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Customer</Button>
      </div>

        </form>
    );
}