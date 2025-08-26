import React, { useState } from 'react';
import { X, Upload, Video, MapPin, DollarSign, Home, Bed, Bath, PlusCircle, Square, Info, Calendar, User, Image as ImageIcon, Grid } from 'lucide-react';

export default function AddPropertyModal({ onClose, onAddProperty }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'Apartment',
    price: '',
    units: '',
    bedrooms: '',
    bathrooms: '',
    furnishing: 'Unfurnished',
    possession: 'Immediate',
    builtYear: '',
    locality: '',
    city: '',
    images: [],
    videoUrls: [],
    lat: '',
    lng: '',
    amenities: [],
    submittedBy: '',
  });

  const [newAmenity, setNewAmenity] = useState('');
  // State to manage the video URL input field
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const propertyTypes = [
    'Apartment', 'Villa', 'Plot', 'Commercial Space', 'Farmhouse',
    'Penthouse', 'Studio Apartment', 'Duplex', 'Row House', 'Independent House',
    'Service Apartment', 'Co-working Space', 'Retail Shop', 'Office Space',
    'Warehouse', 'Agricultural Land', 'Industrial Plot', 'Residential Plot',
    'Resort Property', 'Guest House', 'Builder Floor', 'Loft Apartment'
  ];
  const furnishingOptions = ['Unfurnished', 'Semi-Furnished', 'Furnished'];
  const possessionOptions = ['Immediate', 'Within 3 Months', 'Under Construction'];
  const commonAmenities = ['Parking', 'Gym', 'Swimming Pool', '24/7 Security', 'Power Backup', 'Lift', 'Garden', 'Clubhouse', 'Kids Play Area'];

  const handleChange = (e) => {
    const { id, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        amenities: checked
          ? [...prev.amenities, value]
          : prev.amenities.filter((item) => item !== value),
      }));
    } else if (type === 'file') {
      const newImages = Array.from(files).filter(file => !formData.images.some(existingFile => existingFile.name === file.name));
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleAddVideoUrl = () => {
    // Now uses the state-controlled input field instead of prompt()
    if (videoUrlInput && videoUrlInput.trim() !== '') {
      setFormData((prev) => ({ ...prev, videoUrls: [...prev.videoUrls, videoUrlInput.trim()] }));
      setVideoUrlInput(''); // Clear the input after adding
    }
  };

  const handleRemoveVideoUrl = (index) => {
    setFormData((prev) => ({
      ...prev,
      videoUrls: prev.videoUrls.filter((_, i) => i !== index),
    }));
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (amenityToRemove) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((amenity) => amenity !== amenityToRemove),
    }));
  };

  const handleNextStep = () => setCurrentStep(prev => prev + 1);
  const handlePrevStep = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProperty(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl my-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
          title="Close"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-blue-500 pb-3 text-center">Add New Property</h2>

        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setCurrentStep(1)} className={`p-3 rounded-lg font-semibold transition-colors ${currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>1. Basic Details</button>
            <button type="button" onClick={() => setCurrentStep(2)} className={`p-3 rounded-lg font-semibold transition-colors ${currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>2. Features</button>
            <button type="button" onClick={() => setCurrentStep(3)} className={`p-3 rounded-lg font-semibold transition-colors ${currentStep === 3 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>3. Media & Location</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label htmlFor="title" className="block text-gray-700 text-sm font-semibold">Property Name/Title <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Home size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="text" id="title" className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Luxury Apartment" value={formData.title} onChange={handleChange} required />
                </div>

                <label htmlFor="propertyType" className="block text-gray-700 text-sm font-semibold">Property Type <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Grid size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <select id="propertyType" className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-blue-500 focus:border-blue-500" value={formData.propertyType} onChange={handleChange} required>
                    {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                
                <label htmlFor="description" className="block text-gray-700 text-sm font-semibold">Description <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Info size={20} className="absolute left-3 top-4 text-gray-500" />
                  <textarea id="description" rows="5" className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500" placeholder="Provide a detailed description of the property..." value={formData.description} onChange={handleChange} required></textarea>
                </div>
              </div>

              <div className="space-y-4">
                <label htmlFor="price" className="block text-gray-700 text-sm font-semibold">Price (e.g., 9000-60000 per yard) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <DollarSign size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="text" id="price" className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 9000-60000 per yard" value={formData.price} onChange={handleChange} required />
                </div>
                
                <label htmlFor="units" className="block text-gray-700 text-sm font-semibold">Area (Sq. Ft.) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Square size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="number" id="units" className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 1200" value={formData.units} onChange={handleChange} required />
                </div>

                <label htmlFor="locality" className="block text-gray-700 text-sm font-semibold">Locality <span className="text-red-500">*</span></label>
                <div className="relative">
                  <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="text" id="locality" className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Indirapuram" value={formData.locality} onChange={handleChange} required />
                </div>
                
                <label htmlFor="city" className="block text-gray-700 text-sm font-semibold">City <span className="text-red-500">*</span></label>
                <div className="relative">
                  <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="text" id="city" className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Ghaziabad" value={formData.city} onChange={handleChange} required />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-4">
                <label htmlFor="bedrooms" className="block text-gray-700 text-sm font-semibold">Bedrooms</label>
                <div className="relative">
                  <Bed size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="number" id="bedrooms" min="0" className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 3" value={formData.bedrooms} onChange={handleChange} />
                </div>

                <label htmlFor="bathrooms" className="block text-gray-700 text-sm font-semibold">Bathrooms</label>
                <div className="relative">
                  <Bath size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="number" id="bathrooms" min="0" className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 2" value={formData.bathrooms} onChange={handleChange} />
                </div>
                
                <label htmlFor="furnishing" className="block text-gray-700 text-sm font-semibold">Furnishing</label>
                <select id="furnishing" className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-blue-500 focus:border-blue-500" value={formData.furnishing} onChange={handleChange}>
                  {furnishingOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
                
                <label htmlFor="possession" className="block text-gray-700 text-sm font-semibold">Possession</label>
                <select id="possession" className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-blue-500 focus:border-blue-500" value={formData.possession} onChange={handleChange}>
                  {possessionOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
                
                <label htmlFor="builtYear" className="block text-gray-700 text-sm font-semibold">Built Year</label>
                <div className="relative">
                  <Calendar size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="number" id="builtYear" min="1900" max={new Date().getFullYear()} className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 2020" value={formData.builtYear} onChange={handleChange} />
                </div>

                <label htmlFor="submittedBy" className="block text-gray-700 text-sm font-semibold">Submitted By (Broker Name)</label>
                <div className="relative">
                  <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="text" id="submittedBy" className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., John Doe" value={formData.submittedBy} onChange={handleChange} />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Amenities</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {commonAmenities.map(amenity => (
                    <label key={amenity} className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-gray-800 text-sm cursor-pointer hover:bg-gray-200 transition-colors">
                      <input
                        type="checkbox"
                        value={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onChange={handleChange}
                        className="form-checkbox h-4 w-4 text-blue-600 rounded mr-1"
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 p-2 border border-gray-300 rounded-lg text-gray-900"
                    placeholder="Add custom amenity"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                  />
                  <button type="button" onClick={handleAddAmenity} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                    <PlusCircle size={20} />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.amenities.filter(a => !commonAmenities.includes(a)).map((amenity, index) => (
                    <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center">
                      {amenity}
                      <button type="button" onClick={() => handleRemoveAmenity(amenity)} className="ml-1 text-red-500 hover:text-red-700">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label htmlFor="images" className="block text-gray-700 text-sm font-semibold">Property Images</label>
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input type="file" id="images" multiple accept="image/*" className="hidden" onChange={handleChange} />
                  <Upload size={48} className="text-gray-400 mb-2" />
                  <span className="text-gray-600 font-semibold text-center">Click to Upload or Drag & Drop</span>
                  <span className="text-sm text-gray-500 text-center">JPG, PNG, GIF supported</span>
                </label>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative aspect-video">
                      <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover rounded-lg" />
                      <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <label className="block text-gray-700 text-sm font-semibold">Video URLs</label>
                <div className="flex items-center gap-2">
                  {/* FIXED: This input is now controlled by React state */}
                  <input 
                    type="text" 
                    id="videoUrlInput" 
                    className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-900" 
                    placeholder="Paste video URL here" 
                    value={videoUrlInput}
                    onChange={(e) => setVideoUrlInput(e.target.value)}
                  />
                  <button type="button" onClick={handleAddVideoUrl} className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                    <PlusCircle size={20} />
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {formData.videoUrls.map((url, index) => (
                    <div key={index} className="flex items-center bg-gray-100 p-3 rounded-lg text-gray-800 text-sm">
                      <Video size={16} className="mr-2 text-gray-500" />
                      <span className="truncate flex-1">{url}</span>
                      <button type="button" onClick={() => handleRemoveVideoUrl(index)} className="ml-2 text-red-500 hover:text-red-700">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-gray-700 text-sm font-semibold">Map Location (Latitude, Longitude)</label>
                <div className="relative">
                  <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="text" id="lat" className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500" placeholder="Latitude" value={formData.lat} onChange={handleChange} />
                </div>
                <div className="relative">
                  <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="text" id="lng" className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500" placeholder="Longitude" value={formData.lng} onChange={handleChange} />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  * Use a tool like Google Maps to get precise coordinates.
                </p>
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                  Interactive Map Placeholder
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between gap-3 pt-4">
            {currentStep > 1 && (
              <button type="button" onClick={handlePrevStep} className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition shadow-md font-semibold">
                Previous
              </button>
            )}
            {currentStep < 3 && (
              <button type="button" onClick={handleNextStep} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md font-semibold ml-auto">
                Next
              </button>
            )}
            {currentStep === 3 && (
              <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md font-semibold ml-auto">
                Add Property
              </button>
            )}
            {currentStep === 1 && (
               <div className="w-full flex justify-end">
                <button type="button" onClick={handleNextStep} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md font-semibold">
                  Next
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}