import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createTournament,
  fetchTournamentById,
  updateTournament,
} from "../../../redux/slices/tournamentSlice";
import BackButton from "../../../components/backButton";
import ImageUpload from "../../../components/ImageUpload";
import RoleManager from "../../../components/admin/RoleManager";
import { Spinner } from "../../../components/spinner";

const CreateTournament = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { tournament: currentTournament, loading, error } = useSelector((state) => state.tournament);

  const [tournament, setTournament] = useState({
    name: "",
    description: "",
    type: "BP",
    platform: "online",
    status: "upcoming",
    registrationStartDate: "",
    registrationEndDate: "",
    postPaymentRedirectUrl: "",
    roles: [],
  });
  const [banner, setBanner] = useState(null);

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchTournamentById(id));
    }
  }, [id, isEditMode, dispatch]);

  useEffect(() => {
    if (isEditMode && currentTournament) {
      setTournament({
        name: currentTournament.name || "",
        description: currentTournament.description || "",
        type: currentTournament.type || "BP",
        platform: currentTournament.platform || "online",
        status: currentTournament.status || "upcoming",
        registrationStartDate: currentTournament.registrationStartDate?.split("T")[0] || "",
        registrationEndDate: currentTournament.registrationEndDate?.split("T")[0] || "",
        postPaymentRedirectUrl: currentTournament.postPaymentRedirectUrl || "",
        roles: currentTournament.roles || [],
      });
      setBanner(currentTournament.banner?.url);
    }
  }, [isEditMode, currentTournament]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTournament({ ...tournament, [name]: value });
  };

  const handleRolesChange = (newRoles) => {
    setTournament({ ...tournament, roles: newRoles });
  };

  const handleBannerChange = (file) => {
    setBanner(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(tournament).forEach(key => {
        if (key === 'roles') {
            formData.append(key, JSON.stringify(tournament[key]));
        } else {
            formData.append(key, tournament[key]);
        }
    });

    if (banner && banner instanceof File) {
      formData.append("banner", banner);
    }

    if (isEditMode) {
      dispatch(updateTournament({ id, tournamentData: formData })).then(() => {
        navigate("/admin/tournaments");
      });
    } else {
      dispatch(createTournament(formData)).then(() => {
        navigate("/admin/tournaments");
      });
    }
  };

  if (loading && isEditMode) {
    return <Spinner />;
  }

  if (error) {
    return <div className="p-6">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <BackButton />
        <h1 className="text-2xl font-bold ml-4">
          {isEditMode ? "Edit Tournament" : "Create New Tournament"}
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Tournament Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={tournament.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows="3"
                value={tournament.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Tournament Banner Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Tournament Banner</h2>
          <ImageUpload onFileChange={handleBannerChange} currentImage={banner} />
        </div>

        {/* Configuration Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
              <select name="type" id="type" value={tournament.type} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="BP">BP</option>
                <option value="WSDC">WSDC</option>
              </select>
            </div>
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700">Platform</label>
              <select name="platform" id="platform" value={tournament.platform} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select name="status" id="status" value={tournament.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="upcoming">Upcoming</option>
                <option value="registration_open">Registration Open</option>
                <option value="registration_closed">Registration Closed</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Registration Period & URL Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Registration Period & URL</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="registrationStartDate" className="block text-sm font-medium text-gray-700">Registration Start Date</label>
                    <input type="date" name="registrationStartDate" id="registrationStartDate" value={tournament.registrationStartDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                </div>
                <div>
                    <label htmlFor="registrationEndDate" className="block text-sm font-medium text-gray-700">Registration End Date</label>
                    <input type="date" name="registrationEndDate" id="registrationEndDate" value={tournament.registrationEndDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="postPaymentRedirectUrl" className="block text-sm font-medium text-gray-700">Post-Payment Redirect URL</label>
                    <input type="url" name="postPaymentRedirectUrl" id="postPaymentRedirectUrl" value={tournament.postPaymentRedirectUrl} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
            </div>
        </div>

        {/* Roles & Pricing Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Roles & Pricing</h2>
            <RoleManager roles={tournament.roles} onRolesChange={handleRolesChange} />
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={() => navigate("/admin/tournaments")} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
            Cancel
          </button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" disabled={loading}>
            {loading ? "Saving..." : (isEditMode ? "Save Changes" : "Create Tournament")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTournament; 