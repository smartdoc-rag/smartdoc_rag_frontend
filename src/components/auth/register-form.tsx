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

const registerSchema = z.object({
    fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"form">) {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    })

    const { signUp } = useAuthStore()
    const navigate = useNavigate()

    const onSubmit = async (data: RegisterFormValues) => {
        const { fullName, email, password } = data

        const success = await signUp({ fullName, email, password })

        if (success) {
            navigate("/auth/sign-in")
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
                    <h1 className="text-2xl font-bold">Đăng ký tài khoản</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        Nhập các thông tin bên dưới để đăng ký tài khoản mới
                    </p>
                </div>

                {/* FULL NAME */}
                <Field>
                    <FieldLabel className="font-bold" htmlFor="name">Họ tên</FieldLabel>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Nguyễn Văn A"
                        {...register("fullName")}
                    />
                    {errors.fullName && (
                        <p className="text-destructive text-sm">
                            {errors.fullName.message}
                        </p>
                    )}
                </Field>

                {/* EMAIL */}
                <Field>
                    <FieldLabel className="font-bold" htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
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
                    <FieldLabel className="font-bold" htmlFor="password">Mật khẩu</FieldLabel>
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

                {/* CONFIRM PASSWORD */}
                <Field>
                    <div className="flex items-center">
                        <FieldLabel className="font-bold" htmlFor="confirm-password">
                            Xác nhận mật khẩu
                        </FieldLabel>
                    </div>
                    <Input
                        id="confirm-password"
                        type="password"
                        {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                        <p className="text-destructive text-sm">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </Field>

                {/* SUBMIT */}
                <Field>
                    <Button disabled={isSubmitting} type="submit">
                        {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
                    </Button>
                </Field>

                <FieldSeparator>Hoặc</FieldSeparator>

                {/* GITHUB */}
                <Field>
                    <Button variant="outline" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path
                                d="M12 .297c-6.63 0-12 5.373-12 12..."
                                fill="currentColor"
                            />
                        </svg>
                        Sign up with GitHub
                    </Button>

                    <FieldDescription className="text-center">
                        Đã có tài khoản?{" "}
                        <span
                            className="underline underline-offset-4 cursor-pointer hover:text-primary"
                            onClick={() => navigate('/auth/sign-in')}
                        >
                            Đăng nhập
                        </span>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    )
}