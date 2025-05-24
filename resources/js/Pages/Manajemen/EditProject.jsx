

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import PrimaryButton from '@/Components/PrimaryButton';
import Breadcrumb from '@/Components/Breadcrumb/Breadcrumb';

const EditUrlPage = () => {
  // Dummy state
  const [data, setDataState] = useState({
    long_url: 'https://example.com/',
    expiration_date: '2025-12-31',
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  // Dummy setData function
  const setData = (field, value) => {
    setDataState(prev => ({ ...prev, [field]: value }));
  };

  // Dummy submit handler
  const onSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    console.log("Submitted data:", data);
    setTimeout(() => {
      setProcessing(false);
      alert("Dummy submit success!");
    }, 1000);
  };

  return (
    <DashboardLayout>
        <Breadcrumb/>
      <h2 className="text-xl font-semibold text-blue-900 mt-4 mb-4">Edit Project URL</h2>

      {/* URL & Icons Row */}
      <div className="mb-4 flex items-center justify-between text-sm text-foreground">
        <span className="text-foreground font-medium">
        Your Link Is : <a className='underline'>sevenpion.com/m/example-alias</a>
        </span>
       <div className="flex gap-2 ml-4">
  <button type="button" title="Copy" className="group bg-white p-3 rounded-lg shadow hover:bg-primary-100">
    <Icon
      icon="akar-icons:copy"
      width={20}
      height={20}
      className="text-foreground group-hover:text-white"
    />
  </button>
  <button type="button" title="Delete" className="group bg-white p-3 rounded-lg shadow hover:bg-primary-100">
    <Icon
      icon="gravity-ui:trash-bin"
      width={20}
      height={20}
      className="text-foreground group-hover:text-white"
    />
  </button>
  <button type="button" title="Share" className="group bg-white p-3 rounded-lg shadow hover:bg-primary-100">
    <Icon
      icon="tabler:share"
      width={20}
      height={20}
      className="text-foreground group-hover:text-white"
    />
  </button>
</div>

      </div>

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl md:max-w-7xl p-10 relative">
        <div className="mt-4">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="text-sm text-foregroundtext-foreground">
               Project Name
              </label>
              <input
                type="url"
                className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1"
                placeholder="https://example.com/"
                value={data.long_url}
                onChange={(e) =>
                  setData("long_url", e.target.value)
                }
                required
              />
              {errors.long_url && (
                <div className="text-red-500 text-sm">
                  {errors.long_url}
                </div>
              )}
            </div>

            <div className="flex flex-row ">
              <div className="basis-2/4">
                <label className="text-sm text-foreground">
               Project URL
                </label>
                <input
                  type="text"
                  className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1 bg-white text-gray-700"
                  value={`sevenpion.com/m/`}
                  readOnly
                />
              </div>
              <div className="basis-3/4 ms-4">
                <label className="text-sm text-foreground">
                  Alias
                </label>
                <input
                  type="text"
                  className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1 bg-white text-gray-700"
                  placeholder="custom-alias"
                  required
                />
              </div>
            </div>

            <PrimaryButton type="submit" disabled={processing}>
          Update
            </PrimaryButton>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditUrlPage;
