

import React, { useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import Notification from "../Notification/Notification";

export default function CreateProject({
    show,
    onClose,
    data,
    setData,
    errors,
    processing,
}) {
    const [notification, setNotification] = useState(null);

    if (!show) return null;

   
  const handleSubmit = (e) => {
    e.preventDefault()

    post(route('shortlink.store'), {
      onSuccess: () => {
        setNotification({
          type: 'success',
          message: 'Link berhasil disingkat!',
        })
        reset()
      },
      onError: () => {
        setNotification({
          type: 'error',
          message: 'Terjadi kesalahan, periksa input Anda.',
        })
      },
    })
  }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-10 relative">
                <div className="flex justify-between">
                    <div className="flex flex-row">
                        <img
                            src="images/Hyperlink.png"
                            style={{ width: "24px", height: "24px" }}
                            alt="hyperlink"
                        />
                        <h2 className="text-xl ms-4 font-semibold text-primary-100 mb-4">
                          Edit Categories Link
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-foreground font-black hover:text-primary-100"
                    >
                        ✕
                    </button>
                </div>

                {/* Notifikasi */}
                {notification && (
                    <Notification
                        type={notification.type}
                        message={notification.message}
                        onClose={() => setNotification(null)}
                    />
                )}

                <div className="mt-4">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-sm text-foreground">
                               Name Categories
                            </label>
                            <input
                                type="url"
                                className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1"
                                placeholder="example"
                                value={data.long_url}
                                onChange={(e) =>
                                    setData("long_url", e.target.value)
                                }
                                required
                            />
                            {errors.long_url && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors.long_url}
                                </div>
                            )}
                        </div>


                        <PrimaryButton type="submit" disabled={processing}>
                              {processing ? 'Update Categories...' : 'Update Categories'}
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </div>
    );
}
