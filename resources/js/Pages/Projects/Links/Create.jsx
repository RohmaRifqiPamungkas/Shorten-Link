

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import PrimaryButton from '@/Components/PrimaryButton';
import Breadcrumb from '@/Components/Breadcrumb/Breadcrumb';
import { Head, useForm, Link } from '@inertiajs/react';

const CreateLink = ({ project, selectedCategoryId }) => {

     const { data, setData, post, processing, errors } = useForm({
            category_id: selectedCategoryId ?? '',
            links: [{ title: '', url: '' }],
        });
    
        const handleLinkChange = (index, field, value) => {
            const updatedLinks = [...data.links];
            updatedLinks[index][field] = value;
            setData('links', updatedLinks);
        };
    
        const addLinkField = () => {
            setData('links', [...data.links, { title: '', url: '' }]);
        };
    
        const removeLinkField = (index) => {
            const updatedLinks = data.links.filter((_, i) => i !== index);
            setData('links', updatedLinks);
        };
    
        const submit = (e) => {
            e.preventDefault();
            post(`/dashboard/projects/${project.id}/links`);
        };
    

  return (
    <DashboardLayout>
      <Head title="Tambah Link Baru" />

        <Breadcrumb/>
      <h2 className="text-xl font-semibold text-blue-900 mt-4 mb-4">Edit URL</h2>

      {/* URL & Icons Row */}
      <div className="mb-4 flex items-center justify-between text-sm text-foreground">
        <span className="text-foreground font-medium">
        Your Link Is : <a className='underline'>sevenpion.com/s/example-alias</a>
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
           <form onSubmit={submit} className=" space-y-5 ">
                            <input type="hidden" value={data.category_id} name="category_id" />
        
                            {data.links.map((link, index) => (
                                <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-3 border border-brfourth rounded-md p-6">
                                    <div className="flex-1 w-full">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title URL</label>
                                        <input
                                            type="text"
                                            placeholder="Example"
                                            value={link.title}
                                            onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                                            className="w-full px-3 py-2 border-brfourth rounded-md focus:outline-none"
                                        />
                                    </div>
        
                                    <div className="flex-1 w-full">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                                        <input
                                            type="url"
                                            placeholder="Example"
                                            value={link.url}
                                            onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                            className="w-full px-3 py-2 border-brfourth rounded-md focus:outline-none"
                                        />
                                    </div>
        
                                    <div className="flex items-center gap-2 pt-1 mt-5">
                                        {data.links.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeLinkField(index)}
                                                className="text-white bg-primary-100 hover:bg-secondary p-2 rounded"
                                            >
                                                <Icon icon="gravity-ui:trash-bin" width={18} height={18} />
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={addLinkField}
                                            className="text-white bg-secondary hover:bg-primary-100 p-2 rounded"
                                        >
                                            <Icon icon="mdi:plus" width={18} height={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
        
                            {errors.links && (
                                <p className="text-sm text-red-500">{errors.links}</p>
                            )}
        
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="w-full bg-primary-100 hover:bg-secondary text-white py-2 rounded-md font-semibold"
                            >
                                Submit
                            </PrimaryButton>
                        </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateLink;
