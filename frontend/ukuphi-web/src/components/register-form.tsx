import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Control, FieldPath, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ChangeEventHandler, useState } from "react"
import { CheckCircle, Circle, Loader } from "lucide-react"
import useApi from "@/hooks/use-api"
import { Modal } from "@/components/modal"
import { InputOTPForm } from "@/components/otp-form"

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

  const { fetch } = useApi();

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const [loading, setLoading] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const handlePasswordChange = (value: string) => {
    setPasswordValidation({
      length: value.length >= 8 && value.length <= 32,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    });

    form.setValue("password", value);
  }

  const handleConfirmPasswordChange = (value: string) => {
    const password = form.getValues("password");
    if (value !== password && value !== "") {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError(null)
    }
    form.setValue("confirmPassword", value);
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const payload = formSchema.safeParse(values);

    if (payload.success) {
      setLoading(true);
      try {
        const data = await fetch('/auth/register', {
          method: 'POST',
          data: {
            name: payload.data.name,
            email: payload.data.email,
            password: payload.data.password,
            phone: `+27${Math.floor(Math.random() * 1000000000)}`,
          },
        });
        
        setLoading(false);
        setUserId(data.id);
        setOtpModalVisible(true);
        form.reset();
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    }
  }

  return (
    <>
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
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "At least 8 characters.", valid: passwordValidation.length },
                    { label: "One uppercase letter.", valid: passwordValidation.uppercase },
                    { label: "One lowercase letter.", valid: passwordValidation.lowercase },
                    { label: "One number.", valid: passwordValidation.number },
                    { label: "One special character.", valid: passwordValidation.special },
                  ].map((rule, index) => (
                    <div key={index} className="flex px-1 items-center gap-2">
                      {rule.valid ? (
                        <CheckCircle className="text-green-500 w-4 h-4" />
                      ) : (
                        <Circle className="text-gray-400 w-4 h-4" />
                      )}
                      <span>{rule.label}</span>
                    </div>
                  ))}

                </div>
              } formControl={form.control} />
            </div>
            <div className="grid gap-2">
              <RegisterFormField name="confirmPassword" placeholder="Confirm your password" label="Confirm Password" inputType="password" onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                description={
                  confirmPasswordError ? (
                    <span className="text-red-500">{confirmPasswordError}</span>
                  ) : null
                } formControl={form.control} />
            </div>
            <div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <span>Creating account... <Loader className="animate-spin" /> </span> : "Create Account"}
              </Button>
            </div>
          </div>
        </form>
      </Form>

      {
        otpModalVisible && (
          <Modal open={otpModalVisible} onOpenChange={setOtpModalVisible}>
            <Modal.Content className="justify-center items-center p-12">
              <InputOTPForm id={userId} />
            </Modal.Content>
          </Modal>
        )
      }
    </>
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

