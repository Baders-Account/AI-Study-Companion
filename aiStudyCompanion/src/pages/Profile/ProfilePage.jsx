import React, { useState } from "react";
import NavBar from "../../components/NavBar";

export default function ProfilePage() {
  const [preview, setPreview] = useState(null);
  const [username, setUsername] = useState("xxxxxxxxxxxx");
  const [name, setName] = useState("xxxxxxxxxx");
  const [email, setEmail] = useState("xxxxxxxxxxx");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("xxxxxxxxxxxxxxxxxxxx");
  const [bio, setBio] = useState(
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  );

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col">
      {/* NAVBAR*/}
      <div className="w-full bg-gray-800 border-b border-gray-700">
        <NavBar />
      </div>

      {/* MAIN CONTENT*/}
      <div className="flex-1 flex items-center justify-center px-2 py-5">
        <div className="w-full max-w-5xl">
          {/* Profile Card */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
            <h1 className="text-3xl font-bold text-center text-gray-100 mb-15">
              Edit Profile
            </h1>

            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-20">

              {/*Avatar + Username */}
              <div className="flex flex-col items-center md:items-start space-y-10 ">
                <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-gray-600 bg-gray-700 flex items-center justify-center">
                  {preview ? (
                    <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-20 h-20 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>

                <label className="cursor-pointer" >
                  <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                  <span className="px-10 bg-gray-800 hover:bg-gray-600 text-gray-100 font-medium rounded-lg transition ">
                    Change Photo
                  </span>
                </label>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-400 mb-4">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/30 transition"
                  />
                </div>
              </div>

              {/*Form Fields */}
              <div className="space-y-5">
                {[
                  { label: "Full Name", value: name, set: setName },
                  { label: "Email", value: email, set: setEmail, type: "email" },
                  { label: "New Password", value: password, set: setPassword, type: "password", placeholder: "Leave blank to keep current" },
                  { label: "Role / Title", value: role, set: setRole },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-sm font-medium text-gray-400 mb-0.5">
                      {field.label}
                    </label>
                    <input
                      type={field.type || "text"}
                      value={field.value}
                      onChange={(e) => field.set(e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/30 transition"
                    />
                  </div>
                ))}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={9}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 resize-none focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/30 transition"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-12 text-center">
              <button className="px-12 py-4 bg-gray-700 hover:bg-gray-600 text-gray-100 font-bold text-lg rounded-xl shadow-lg transition transform hover:scale-105">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}