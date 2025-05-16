"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/components/addons/PrimaryButton";
import { signIn } from "@/utils/auth";
import { useAuth } from "@/context/AuthProvider";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const { setAuthData } = useAuth()

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const LoginSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .required("Password is required"),
    });

    const handleSubmit = async (values: { email: string; password: string }, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
        setError("");
        setIsLoading(true);

        try {
            const response = await signIn(values.email, values.password);
            if (response.success) {
                const data = response.data;
                if (data) {
                    localStorage.setItem("accessToken", data?.session.access_token);
                    setAuthData({
                        accessToken: data?.session.access_token || null,
                        userId: data.session.user?.id || null,
                        role: data.profile.role,
                    })
                    router.push('/');
                }
            } else {
                setError(response?.message || "Something went wrong!")
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
                console.log(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setIsLoading(false);
            setSubmitting(false)
        }
    };

    return (
        <div className="w-full fixed top-0 left-0 z-10 min-h-screen flex items-center justify-center bg-[#0d1117] p-4">
            <div className="w-full max-w-[500px]">
                <div className="text-center mb-8">
                    <Link href={'/'}>
                        <h1 className="text-[#00e5b0] text-3xl font-bold mb-2">NIRWANA</h1>
                    </Link>
                    <p className="text-gray-400">Sign in to your account</p>
                </div>

                <div className="bg-[#161b22] rounded-lg shadow-xl p-8">
                    {error && (
                        <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-md text-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    <Formik
                        initialValues={{ email: "", password: "" }}
                        validationSchema={LoginSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, errors, touched }) => (
                            <Form className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <Field
                                            id="email"
                                            name="email"
                                            type="email"
                                            className={`block w-full pl-10 pr-3 py-2.5 bg-[#0d1117] border ${errors.email && touched.email ? "border-red-500" : "border-gray-700"
                                                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00e5b0] focus:border-transparent text-gray-200`}
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <Field
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            className={`block w-full pl-10 pr-10 py-2.5 bg-[#0d1117] border ${errors.password && touched.password ? "border-red-500" : "border-gray-700"
                                                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00e5b0] focus:border-transparent text-gray-200`}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-300" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-500 hover:text-gray-300" />
                                            )}
                                        </button>
                                    </div>
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 bg-[#0d1117] border-gray-700 rounded focus:ring-[#00e5b0] focus:ring-offset-gray-800"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                                            Remember me
                                        </label>
                                    </div>
                                    <div className="text-sm">
                                        <Link href="https://anamcara-fe.vercel.app/auth/forgot-password" className="text-[#00e5b0] hover:text-[#00c49a]">
                                            Forgot your password?
                                        </Link>
                                    </div>
                                </div>
                                <PrimaryButton
                                    type="submit"
                                    text={isLoading ? "Signing in..." : "Sign in"}
                                    isLoading={isLoading}
                                    disabled={isSubmitting || isLoading}
                                    className="w-full"
                                />
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}
