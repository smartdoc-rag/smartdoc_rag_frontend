import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthStore } from "@/stores/useAuthStore"
import { useNavigate } from "react-router"

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const { signIn } = useAuthStore()
  const navigate = useNavigate()

  const onSubmit = async (data: LoginFormValues) => {
    const success = await signIn(data)

    if (success) {
      navigate("/")
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Đăng nhập </h1>
          <p className="text-sm text-balance text-muted-foreground">
            Nhập các thông tin bên dưới để đăng nhập
          </p>
        </div>

        {/* EMAIL */}
        <Field>
          <FieldLabel className="font-bold" htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="text"
            placeholder="m@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-destructive text-sm">
              {errors.email.message}
            </p>
          )}
        </Field>

        {/* PASSWORD */}
        <Field>
          <div className="flex items-center">
            <FieldLabel className="font-bold" htmlFor="password">
              Mật khẩu
            </FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Quên mật khẩu?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-destructive text-sm">
              {errors.password.message}
            </p>
          )}
        </Field>

        {/* SUBMIT */}
        <Field>
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </Field>

        <FieldSeparator>Hoặc đăng nhập với</FieldSeparator>

        {/* GITHUB */}
        <Field>
          <Button variant="outline" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12..."
                fill="currentColor"
              />
            </svg>
            Login with GitHub
          </Button>

          <FieldDescription className="text-center">
            Chưa có tài khoản?{" "}
            <span
              className="underline underline-offset-4 cursor-pointer hover:text-primary"
              onClick={() => navigate('/auth/sign-up')}
            >
              Đăng ký
            </span>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}