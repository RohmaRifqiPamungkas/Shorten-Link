import React from "react";
import DashboardLayout from "@/Components/DashboardLayout/DashboardLayout";
import { Head } from "@inertiajs/react";
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import DeleteUserForm from "./Partials/DeleteUserForm";

export default function Edit({ mustVerifyEmail, status, auth }) {
    return (
        <DashboardLayout user={auth.user}>
            <Breadcrumb />
            <Head title="Profile" />

            <h2 className="text-xl font-semibold text-primary-100 mt-4 mb-6">
                My Profile
            </h2>

            <div className="min-w-full space-y-6 max-w-4xl">
                {/* Card Profile Information */}
                <div className="bg-white rounded-2xl shadow-xl w-full p-10">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                        Profile Information
                    </h3>
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="space-y-6"
                    />
                </div>

                {/* Card Update Password */}
                <div className="bg-white rounded-2xl shadow-xl w-full p-10">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                        Update Password
                    </h3>
                    <UpdatePasswordForm className="space-y-6" />
                </div>

                {/* Card Delete Account */}
                <div className="bg-white rounded-2xl shadow-xl w-full p-10 border border-red-200">
                    <h3 className="text-lg font-semibold text-red-600 mb-4">
                        Danger Zone
                    </h3>
                    <DeleteUserForm className="space-y-6" />
                </div>
            </div>
        </DashboardLayout>
    );
}
