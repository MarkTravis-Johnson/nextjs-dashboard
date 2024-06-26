'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
//import { UpdateCustomer } from '../ui/customers/buttons';


  const InvoiceFormSchema = z.object({
    id: z.string(),
    customerId: z.string({invalid_type_error: 'Please select a user',}),
    amount: z.coerce.number()
                     .gt(0, {message: 'Amounts must be greater than \$0.00'}),
    status: z.enum(['pending', 'paid'], {invalid_type_error: 'Please select a status'}),
    date: z.string(),
  });

  const CustomerFormSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    image_url: z.string()
  });

  const CreateInvoice = InvoiceFormSchema.omit({ id: true, date: true });
  const UpdateInvoice = InvoiceFormSchema.omit({ id: true, date: true });

  const CreateCustomer = CustomerFormSchema.omit({ id: true, image_url: true})
  const UpdateCustomer = CustomerFormSchema.omit({ id: true, image_url: true})

  export type InvoiceState = {
    errors?: {
      customerId?: string[];
      amount?: string[];
      status?: string[];
    };
    message?: string | null;
  };

  export type CustomerState = {
    errors?: {
      name?: string[];
      email?: string[];
    };
    message?: string | null;
  };

export async function createInvoice(prevState: InvoiceState, formData: FormData) {
    const validatedFields = CreateInvoice.safeParse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Create Invoice.',
        };
      }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    
    try {
        await sql`INSERT INTO invoices(customer_id, amount, status, date)
                VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`; 
    }
    catch (error)
    {
        return {
            message : 'Database Error: Failed to create Invoice because ',
        }
    }
    
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, prevState: InvoiceState, formData: FormData) {
    const validatedFields = UpdateInvoice.safeParse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
   
    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Create Invoice.',
        };
      }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;

   //try{
    await sql`UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}`;
//    } catch (error) {
//     return {
//         message : 'Database Error: Failed to Update Invoice',
//     }
//    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }

export async function deleteInvoice(id:string) 
  {
    
    try
    {
        await sql `DELETE FROM invoices WHERE id= ${id}`;
        revalidatePath('/dashboard/invoices');
    }
    catch (error)
    {
        return {
            message: 'Database Error.  Unable to delete Invoice'
        }
    }
  }

  export async function updateCustomer(id:string, prevState:CustomerState, formData: FormData)
  {
    const validatedFields = UpdateCustomer.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Update Customer.',
      };
    }
    const { name, email } = validatedFields.data;
    await sql`UPDATE customers
    SET name = ${name}, email = ${email}
    WHERE id = ${id}`;

    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
  }

  export async function deleteCustomer(id:string) 
  {
    
    try
    {
        await sql `DELETE FROM customers WHERE id= ${id}`;
        
        revalidatePath('/dashboard/customers');
    }
    catch (error)
    {
        return {
            message: 'Database Error.  Unable to delete Invoice'
        }
    }
  } 

  export async function createCustomer(prevState: CustomerState, formData: FormData) {
    const validatedFields = CreateCustomer.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
    });

    if (!validatedFields.success) {
        return {
          errors: validatedFields.error.flatten().fieldErrors,
          message: 'Missing Fields. Failed to Create Customer.',
        };
      }

    const { name, email } = validatedFields.data;
    const image_url = "/customers/emil-kowalski.png";
    
    try {
        await sql`INSERT INTO customers(name, email, image_url)
                VALUES (${name}, ${email}, ${image_url} )`; 
    }
    catch (error)
    {
        return {
            message : 'Database Error: Failed to create Customer because ',
        }
    }
    
    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}
  export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }