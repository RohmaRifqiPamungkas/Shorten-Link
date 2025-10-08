import React, { useState } from "react";
import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import Web3LoginButton from "@/Components/Web3/Web3LoginButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        placeholder="Enter your email"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <div className="relative">
                        <TextInput
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full pr-10"
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            onChange={(e) => setData("password", e.target.value)}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            tabIndex={-1}
                        >
                            {showPassword ? <FiEye /> : <FiEyeOff />}
                        </button>
                    </div>

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="ms-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                            Remember Me
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="text-xs md:text-sm font-medium text-primary-100 hover:text-secondary"
                        >
                            Forgot Password?
                        </Link>
                    )}
                </div>

                {/* <div className="mt-4 flex items-center ">
                    <PrimaryButton className="" disabled={processing}>
                        LOGIN
                    </PrimaryButton>
                </div> */}

                <div className="mt-4 flex flex-col items-center space-y-3">
                    <PrimaryButton disabled={processing}>
                        LOGIN
                    </PrimaryButton>

                    <div className="relative my-2 w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-300"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">
                                or
                            </span>
                        </div>
                    </div>

                    <Web3LoginButton />
                </div>
                <p className="text-center text-sm text-gray-600 mt-6">
                    Don’t have account?{" "}
                    <Link
                        href={route("register")}
                        className="font-semibold text-primary-100 underline hover:text-secondary"
                    >
                        Create an Account
                    </Link>
                </p>

            </form>
        </GuestLayout >
    );
}
