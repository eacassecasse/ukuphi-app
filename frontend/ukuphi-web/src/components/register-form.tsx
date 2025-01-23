import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Control, FieldPath, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ChangeEventHandler, FormEventHandler, useState } from "react"

const formSchema = z.object({
  name: z
    .string({
      required_error: "Name is required.",
    })
    .min(3, {
      message: "Name must be at least 2 characters.",
    }),
  email: z.string({
    invalid_type_error: "Email must have this format: email@example.com",
  }).email().max(195, {
    message: "Description must be at most 195 characters.",
  }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(32, { message: "Password must not exceed 32 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one special character." }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
})

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [password, setPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    const passwordSchema = formSchema.innerType().pick({ password: true });

    const result = passwordSchema.safeParse(value);

    if (!result.success) {
      const passwordErrors = result.error.errors.map((error) => error.message);
      console.log(passwordErrors);
      setPasswordErrors(passwordErrors);
    } else {
      setPasswordErrors([]);
    }
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = formSchema.safeParse(values);

    if (payload.success) {
      console.log(`{name: ${payload.data.name}, email: ${payload.data.email}, password: ${payload.data.password}}`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your fields below to get started
          </p>
        </div>
        <div className="grid gap-6">
          <Button variant="outline" className="w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Sign in with Google
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              or
            </span>
          </div>
          <div className="grid gap-2">
            <RegisterFormField name="name" placeholder="Enter your full name" label="Full Name" formControl={form.control} />
          </div>
          <div className="grid gap-2">
            <RegisterFormField name="email" placeholder="m@example" label="Email" inputType="email" formControl={form.control} />
          </div>
          <div className="grid gap-2">
            <RegisterFormField name="password" placeholder="Create a password" label="Password" inputType="password" onChange={(e) => handlePasswordChange(e.target.value)} description={
              <div className="border border-pine-green">
                Description
              </div>
            } formControl={form.control} />
          </div>
          <div className="grid gap-2">
            <RegisterFormField name="confirmPassword" placeholder="Confirm your password" label="Confirm Password" inputType="password" formControl={form.control} />
          </div>
          <div className="border border-red-500">
            <Button type="submit" className="w-full">
              Create account
            </Button>
          </div>
        </div>
        <div className="text-center text-sm">
          Have an account already?{" "}
          <a href="#" className="underline underline-offset-4">
            Sign in
          </a>
        </div>
      </form>
    </Form>
  )
}


interface RegisterFormFieldProps {
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  description?: string | React.ReactNode;
  inputType?: string;
  formControl: Control<z.infer<typeof formSchema>, any>;
}
const RegisterFormField: React.FC<RegisterFormFieldProps> = ({
  name, label, placeholder, onChange, description, inputType = "text", formControl
}) => {
  return (
    <FormField
      control={formControl}
      name={name}
      render={
        ({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input type={inputType} placeholder={placeholder} {...field} onChange={(ev) => {
                field.onChange(ev);
                onChange?.(ev);
              }} />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      }
    />
  )
}

