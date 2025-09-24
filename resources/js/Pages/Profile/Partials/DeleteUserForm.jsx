import DangerButton from "@/Components/DangerButton";
import SecondaryButton from "@/Components/SecondaryButton";
import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import { useRef, useState } from "react";

export default function DeleteUserForm({ className = "" }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <p className="text-sm text-gray-600">
                Once your account is deleted, all of its resources and data will
                be permanently deleted. Please make sure to download any data
                you want to keep before continuing.
            </p>

            <DangerButton onClick={confirmUserDeletion}>
                Delete Account
            </DangerButton>

            {/* Modal Konfirmasi */}
            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form
                    onSubmit={deleteUser}
                    className=""
                >
                    <div className="p-8 space-y-6">
                        {/* Icon + Heading */}
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-red-100 rounded-full text-red-600">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01M5.07 19h13.86A2.07 2.07 0 0021 16.93V7.07A2.07 2.07 0 0018.93 5H5.07A2.07 2.07 0 003 7.07v9.86A2.07 2.07 0 005.07 19z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-lg font-semibold text-red-600">
                                Are you sure you want to delete your account?
                            </h2>
                        </div>

                        <p className="text-sm text-gray-600 leading-relaxed">
                            This action <span className="font-semibold text-red-600">cannot be undone</span>.
                            Please enter your password to confirm you want to permanently delete your account.
                        </p>

                        {/* Input Password */}
                        <div>
                            <label className="text-sm text-foreground">Password</label>
                            <input
                                id="password"
                                type="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary-100"
                                placeholder="Enter your password"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 px-8 py-4 border-t border-gray-200">
                        <SecondaryButton type="button" onClick={closeModal}>
                            Cancel
                        </SecondaryButton>
                        <DangerButton disabled={processing}>
                            {processing ? "Deleting..." : "Delete Account"}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
