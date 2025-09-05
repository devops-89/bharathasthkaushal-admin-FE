// import React, { useState } from 'react';
// import { Plus, Search, Filter, Edit2, Trash2, Eye, EyeOff, Grid, List } from 'lucide-react';
// const CategoryManagement = () => {
//   const [categories, setCategories] = useState([
//     {
//       id: 1,
//       name: 'Handloom',
//       image: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=400&h=300&fit=crop',
//       status: 'Active',
//       subcategories: [
//         { 
//           id: 11, 
//           name: 'Silk Sarees', 
//           image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=200&fit=crop',
//           status: 'Active',
//           products: 45
//         },
//         { 
//           id: 12, 
//           name: 'Cotton Sarees', 
//           image: 'https://images.unsplash.com/photo-1616986491129-3e37cb654c82?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//           status: 'Active',
//           products: 38
//         },
//         { 
//           id: 13, 
//           name: 'Banarasi Sarees', 
//           image: 'https://media.istockphoto.com/id/2045994242/photo/handmade-indian-sari-saree-with-golden-details-woman-wear-on-festival-ceremony-and-weddings.jpg?s=1024x1024&w=is&k=20&c=4MSlL7h4TERQPafdmU5ZBEmHFJbMIw8Nru6YAnlG7KE=',
//           status: 'Active',
//           products: 52
//         },
//         { 
//           id: 14, 
//           name: 'Kanchipuram Sarees', 
//           image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=200&fit=crop',
//           status: 'Active',
//           products: 41
//         },
//         { 
//           id: 15, 
//           name: 'Chanderi Sarees', 
//           image: 'https://media.istockphoto.com/id/466197068/photo/indian-maheshwari-sari-closeups.jpg?s=1024x1024&w=is&k=20&c=2xNlETZG85L5RpnWePED9yFNG6P0qaqPB-fjuEy2gHs=',
//           status: 'Active',
//           products: 29
//         },
//         { 
//           id: 16, 
//           name: 'Khadi Cotton Fabrics', 
//           image: 'https://media.istockphoto.com/id/2088152655/photo/close-up-view-of-different-color-hand-woven-natural-fiber-cotton-fabric-material-also-known.jpg?s=612x612&w=is&k=20&c=xUgiWlhfWfmHIaI32PB57n3qWW7RuQcZSdthmgSAh2Q=',
//           status: 'Active',
//           products: 35
//         },
//         { 
//           id: 17, 
//           name: 'Handwoven Dhotis', 
//           image: 'https://media.istockphoto.com/id/1438818386/photo/ethnic-fabric.jpg?s=612x612&w=is&k=20&c=fv8xwrwmpPi1x3C-KRnYYQkDIkGYAMWU-Q_RgThOxuE=',
//           status: 'Active',
//           products: 22
//         },
//         { 
//           id: 18, 
//           name: 'Traditional Shawls', 
//           image: 'https://media.istockphoto.com/id/1173874661/vector/blanket-stripes-seamless-vector-pattern-serape-design.jpg?s=612x612&w=is&k=20&c=hKoeyN6WFzUjdLriQuYt0GnmqZwAygXzW9sLbyUzddU=',
//           status: 'Active',
//           products: 31
//         },
//         { 
//           id: 19, 
//           name: 'Pashmina Shawls', 
//           image: 'https://media.istockphoto.com/id/861129128/photo/traditional-paisley-pattern-cashmere-pashmina-sample.jpg?s=612x612&w=is&k=20&c=26Nj9rHkzfyy3g0TWJflVbdgloi3RQdy9zJn0uQeu1M=',
//           status: 'Active',
//           products: 18
//         },
//         { 
//           id: 110, 
//           name: 'Wool Carpets', 
//           image: 'https://media.istockphoto.com/id/929499078/photo/beige-fabric-seamless-textured.jpg?s=1024x1024&w=is&k=20&c=CWYm15bkmrntb0MtCWd6blLbSMPqOJ1iSagpGPxjbiI=',
//           status: 'Active',
//           products: 28
//         },
//         { 
//           id: 111, 
//           name: 'Durries & Rugs', 
//           image: 'https://media.istockphoto.com/id/474736886/photo/traditional-ukrainian-woven-fabric.jpg?s=612x612&w=is&k=20&c=_NY_2SPuyC7N3iLaMP0-3XDFGVw3_s4aur0sWjPgdyU=',
//           status: 'Active',
//           products: 24
//         },
//         { 
//           id: 112, 
//           name: 'Handloom Bed Sheets', 
//           image: 'https://media.istockphoto.com/id/1363587846/photo/shawl.jpg?s=612x612&w=is&k=20&c=1oIbJ-7laeTLi56UyiysjcVhIHAb-6VQqcSNMJwKCrA=',
//           status: 'Active',
//           products: 33
//         },
//         { 
//           id: 113, 
//           name: 'Handwoven Curtains', 
//           image: 'https://media.istockphoto.com/id/1441866753/vector/beautiful-ikat-paisley-seamless-pattern.jpg?s=612x612&w=is&k=20&c=V0mbFMoBX4AOPYsAEk0uOBntIvIIBLDLpTJV5Nilnug=',
//           status: 'Active',
//           products: 19
//         },
//         { 
//           id: 114, 
//           name: 'Traditional Turbans', 
//           image: 'https://media.istockphoto.com/id/104687818/photo/turbans.jpg?s=612x612&w=is&k=20&c=77Lv5QEOckN9NpbvQPwy83zDJy-q_xG8FLhZ-yN-x-g=',
//           status: 'Active',
//           products: 15
//         }
//       ]
//     },
//     {
//       id: 2,
//       name: 'Handicraft',
//       image: 'https://media.istockphoto.com/id/1190753514/photo/indian-handmade-embroidery-indian-handicraft-background-pink-and-white-fashionable-embroidery.jpg?s=612x612&w=is&k=20&c=aCltlYHDLEKuRiVpjQH5Z1VhPBME5ImVpd37x9kHKx8=',
//       status: 'Active',
//       subcategories: [
//         { 
//           id: 21, 
//           name: 'Wooden Crafts', 
//           image: 'https://media.istockphoto.com/id/586934716/photo/hands-of-craftsman-carve-with-a-gouge.jpg?s=612x612&w=is&k=20&c=hz2vtysTvdWfq0aZ44ghMHyYXaZBZWgAjzrxkGLRJ4Y=',
//           status: 'Active',
//           products: 38
//         },
//         { 
//           id: 22, 
//           name: 'Clay Pottery', 
//           image: 'https://media.istockphoto.com/id/639487044/photo/hands-of-a-potter-creating-an-earthen-jar.jpg?s=612x612&w=is&k=20&c=VwfG6U4LFtYIbDqu8FEHt4pFwscIVRGKbpXy4LDqQI0=',
//           status: 'Active',
//           products: 42
//         },
//         { 
//           id: 23, 
//           name: 'Metal Art & Crafts', 
//           image: 'https://media.istockphoto.com/id/499688886/photo/luxury-background-black.jpg?s=612x612&w=is&k=20&c=qkJa_ergVXf5FwmYU7SqihOj84hHUfW1xGMIikH4ZLQ=',
//           status: 'Active',
//           products: 35
//         },
//         { 
//           id: 24, 
//           name: 'Bamboo Products', 
//           image: 'https://media.istockphoto.com/id/1353370234/photo/handmade-round-woven-placemat-placed-on-a-white-background.jpg?s=612x612&w=is&k=20&c=DfO7ZBU9NjPDz_IXWkDBhPJOYExS9WLImMUXijoif7c=',
//           status: 'Active',
//           products: 29
//         },
//         { 
//           id: 25, 
//           name: 'Stone Carvings', 
//           image: 'https://media.istockphoto.com/id/995458848/photo/old-stone-carved-celtic-design-symbol-celtic-knot.jpg?s=612x612&w=is&k=20&c=9Dkq3BWOmhz4r7wD4MkLYXXHrinAMBmacV_Ny9wmzeY=',
//           status: 'Active',
//           products: 21
//         },
//         { 
//           id: 26, 
//           name: 'Paper Mache Items', 
//           image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
//           status: 'Active',
//           products: 18
//         },
//         { 
//           id: 27, 
//           name: 'Leather Goods', 
//           image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
//           status: 'Active',
//           products: 33
//         },
//         { 
//           id: 28, 
//           name: 'Jute Products', 
//           image: 'https://images.unsplash.com/photo-1586281616620-1e3bfbc5ed5a?w=300&h=200&fit=crop',
//           status: 'Active',
//           products: 27
//         },
//         { 
//           id: 29, 
//           name: 'Cane & Wicker Items', 
//           image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
//           status: 'Active',
//           products: 24
//         },
//         { 
//           id: 210, 
//           name: 'Glass Art & Beads', 
//           image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop',
//           status: 'Active',
//           products: 16
//         },
//         { 
//           id: 211, 
//           name: 'Tribal Art & Crafts', 
//           image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
//           status: 'Active',
//           products: 31
//         },
//         { 
//           id: 212, 
//           name: 'Traditional Masks', 
//           image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
//           status: 'Active',
//           products: 14
//         },
//         { 
//           id: 213, 
//           name: 'Handmade Dolls', 
//           image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
//           status: 'Active',
//           products: 22
//         },
//         { 
//           id: 214, 
//           name: 'Musical Instruments', 
//           image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop',
//           status: 'Active',
//           products: 19
//         },
//         { 
//           id: 215, 
//           name: 'Decorative Boxes', 
//           image: 'https://images.unsplash.com/photo-1578662015928-3cdc5d9d4515?w=300&h=200&fit=crop',
//           status: 'Active',
//           products: 26
//         },
//         { 
//           id: 216, 
//           name: 'Traditional Lamps', 
//           image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
//           status: 'Active',
//           products: 20
//         }
//       ]
//     }
//   ]);

//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [viewMode, setViewMode] = useState('grid'); // grid or list
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showAddCategory, setShowAddCategory] = useState(false);
//   const [showAddSubcategory, setShowAddSubcategory] = useState(false);
  
//   const [newCategory, setNewCategory] = useState({
//     name: '',
//     image: '',
//     status: 'Active'
//   });

//   const [newSubcategory, setNewSubcategory] = useState({
//     name: '',
//     image: '',
//     status: 'Active',
//     parentId: ''
//   });

//   const handleCategoryClick = (category) => {
//     setSelectedCategory(category);
//   };

//   const handleBackToCategories = () => {
//     setSelectedCategory(null);
//   };

//   const handleAddCategory = () => {
//     if (newCategory.name.trim()) {
//       const category = {
//         id: Date.now(),
//         name: newCategory.name,
//         image: newCategory.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
//         status: newCategory.status,
//         subcategories: []
//       };
//       setCategories(prev => [...prev, category]);
//       setNewCategory({ name: '', image: '', status: 'Active' });
//       setShowAddCategory(false);
//     }
//   };

//   const handleAddSubcategory = () => {
//     if (newSubcategory.name.trim() && newSubcategory.parentId) {
//       const subcategory = {
//         id: Date.now(),
//         name: newSubcategory.name,
//         image: newSubcategory.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
//         status: newSubcategory.status,
//         products: 0
//       };
      
//       setCategories(prev => 
//         prev.map(cat => 
//           cat.id === parseInt(newSubcategory.parentId)
//             ? { ...cat, subcategories: [...cat.subcategories, subcategory] }
//             : cat
//         )
//       );
      
//       setNewSubcategory({ name: '', image: '', status: 'Active', parentId: '' });
//       setShowAddSubcategory(false);
//     }
//   };

//   const toggleStatus = (categoryId, subcategoryId = null) => {
//     setCategories(prev => 
//       prev.map(cat => {
//         if (subcategoryId && cat.id === categoryId) {
//           return {
//             ...cat,
//             subcategories: cat.subcategories.map(sub => 
//               sub.id === subcategoryId 
//                 ? { ...sub, status: sub.status === 'Active' ? 'Inactive' : 'Active' }
//                 : sub
//             )
//           };
//         } else if (!subcategoryId && cat.id === categoryId) {
//           return { ...cat, status: cat.status === 'Active' ? 'Inactive' : 'Active' };
//         }
//         return cat;
//       })
//     );
//   };

//   const filteredCategories = categories.filter(category =>
//     category.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredSubcategories = selectedCategory ? 
//     selectedCategory.subcategories.filter(sub =>
//       sub.name.toLowerCase().includes(searchTerm.toLowerCase())
//     ) : [];

//   if (selectedCategory) {
//     return (
//       <div className=" ml-80 pt-20 flex-1 ">
//         {/* Header */}
//         <div className="mb-6">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <div className="flex items-center gap-2 mb-2 " >
//                 <button 
//                   onClick={handleBackToCategories}
//                   className="text-orange-500 hover:text-orange-600 font-medium"
//                 >
//                   ← Back to Categories
//                 </button>
//               </div>
//               <h1 className="text-2xl font-bold text-gray-900">{selectedCategory.name} Subcategories</h1>
//               <p className="text-gray-600">Dashboard • Categories • {selectedCategory.name}</p>
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowAddSubcategory(true)}
//                 className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//               >
//                 <Plus size={20} />
//                 Add Subcategory
//               </button>
//               <div className="flex border border-gray-200 rounded-lg">
//                 <button
//                   onClick={() => setViewMode('grid')}
//                   className={`p-2 ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
//                 >
//                   <Grid size={20} />
//                 </button>
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className={`p-2 ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
//                 >
//                   <List size={20} />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Search */}
//           <div className="flex items-center gap-4">
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//               <input
//                 type="text"
//                 placeholder="Search subcategories..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//               />
//             </div>
//             <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//               <Filter size={20} />
//               Filter
//             </button>
//           </div>
//         </div>

//         {/* Subcategories */}
//         {viewMode === 'grid' ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {filteredSubcategories.map((subcategory) => (
//               <div key={subcategory.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
//                 <div className="relative">
//                   <img 
//                     src={subcategory.image} 
//                     alt={subcategory.name}
//                     className="w-full h-48 object-cover"
//                   />
//                   <div className="absolute top-3 right-3">
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       subcategory.status === 'Active' 
//                         ? 'bg-green-100 text-green-800' 
//                         : 'bg-red-100 text-red-800'
//                     }`}>
//                       {subcategory.status}
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="p-4">
//                   <h3 className="font-semibold text-gray-900 mb-2">{subcategory.name}</h3>
//                   <p className="text-sm text-gray-600 mb-3">{subcategory.products} products</p>
                  
//                   <div className="flex items-center justify-between">
//                     <button 
//                       onClick={() => toggleStatus(selectedCategory.id, subcategory.id)}
//                       className="text-sm text-blue-600 hover:text-blue-700 font-medium"
//                     >
//                       {subcategory.status === 'Active' ? 'Deactivate' : 'Activate'}
//                     </button>
//                     <div className="flex gap-2">
//                       <button className="p-1 text-gray-500 hover:text-green-600 transition-colors">
//                         <Edit2 size={16} />
//                       </button>
//                       <button className="p-1 text-gray-500 hover:text-red-600 transition-colors">
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//             <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 font-medium text-gray-700 text-sm border-b">
//               <div>SUBCATEGORY</div>
//               <div>IMAGE</div>
//               <div>STATUS</div>
//               <div>PRODUCTS</div>
//               <div>CREATED DATE</div>
//               <div>ACTIONS</div>
//             </div>

//             {filteredSubcategories.map((subcategory) => (
//               <div key={subcategory.id} className="grid grid-cols-6 gap-4 p-4 border-b hover:bg-gray-50 transition-colors">
//                 <div className="font-medium text-gray-900">{subcategory.name}</div>
//                 <div>
//                   <img 
//                     src={subcategory.image} 
//                     alt={subcategory.name}
//                     className="w-16 h-12 rounded-lg object-cover border"
//                   />
//                 </div>
//                 <div>
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                     subcategory.status === 'Active' 
//                       ? 'bg-green-100 text-green-800' 
//                       : 'bg-red-100 text-red-800'
//                   }`}>
//                     {subcategory.status}
//                   </span>
//                 </div>
//                 <div className="text-gray-600">{subcategory.products}</div>
//                 <div className="text-gray-600">Dec 15, 2024</div>
//                 <div className="flex items-center gap-2">
//                   <button 
//                     onClick={() => toggleStatus(selectedCategory.id, subcategory.id)}
//                     className="text-gray-500 hover:text-blue-600 transition-colors"
//                   >
//                     {subcategory.status === 'Active' ? <EyeOff size={16} /> : <Eye size={16} />}
//                   </button>
//                   <button className="text-gray-500 hover:text-green-600 transition-colors">
//                     <Edit2 size={16} />
//                   </button>
//                   <button className="text-gray-500 hover:text-red-600 transition-colors">
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Add Subcategory Modal */}
//         {showAddSubcategory && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-md">
//               <h3 className="text-lg font-semibold mb-4">Add New Subcategory to {selectedCategory.name}</h3>
              
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Subcategory Name
//                   </label>
//                   <input
//                     type="text"
//                     value={newSubcategory.name}
//                     onChange={(e) => setNewSubcategory(prev => ({ ...prev, name: e.target.value }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                     placeholder="Enter subcategory name"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Image URL
//                   </label>
//                   <input
//                     type="url"
//                     value={newSubcategory.image}
//                     onChange={(e) => setNewSubcategory(prev => ({ ...prev, image: e.target.value }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                     placeholder="https://example.com/image.jpg"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Status
//                   </label>
//                   <select
//                     value={newSubcategory.status}
//                     onChange={(e) => setNewSubcategory(prev => ({ ...prev, status: e.target.value }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                   >
//                     <option value="Active">Active</option>
//                     <option value="Inactive">Inactive</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="flex gap-3 mt-6">
//                 <button
//                   onClick={() => setShowAddSubcategory(false)}
//                   className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => {
//                     setNewSubcategory(prev => ({ ...prev, parentId: selectedCategory.id.toString() }));
//                     handleAddSubcategory();
//                   }}
//                   className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
//                 >
//                   Add Subcategory
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen ml-64 pt-20 flex-1">
//       {/* Header */}
//       <div className="mb-6">
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
//             <p className="text-gray-600">Dashboard • Categories</p>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={() => setShowAddCategory(true)}
//               className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//             >
//               <Plus size={20} />
//               Add Category
//             </button>
//             <div className="flex border border-gray-200 rounded-lg">
//               <button
//                 onClick={() => setViewMode('grid')}
//                 className={`p-2 ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
//               >
//                 <Grid size={20} />
//               </button>
//               <button
//                 onClick={() => setViewMode('list')}
//                 className={`p-2 ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
//               >
//                 <List size={20} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Search */}
//         <div className="flex items-center gap-4">
//           <div className="relative flex-1 max-w-md">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search categories..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//             />
//           </div>
//           <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
//             <Filter size={20} />
//             Filter
//           </button>
//         </div>
//       </div>

//       {/* Categories Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {filteredCategories.map((category) => (
//           <div key={category.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group">
//             <div className="relative" onClick={() => handleCategoryClick(category)}>
//               <img 
//                 src={category.image} 
//                 alt={category.name}
//                 className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
//               <div className="absolute top-3 right-3">
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                   category.status === 'Active' 
//                     ? 'bg-green-100 text-green-800' 
//                     : 'bg-red-100 text-red-800'
//                 }`}>
//                   {category.status}
//                 </span>
//               </div>
//               <div className="absolute bottom-4 left-4 text-white">
//                 <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
//                 <p className="text-sm opacity-90">{category.subcategories.length} subcategories</p>
//               </div>
//             </div>
            
//             <div className="p-4">
//               <div className="flex items-center justify-between">
//                 <button 
//                   onClick={() => toggleStatus(category.id)}
//                   className="text-sm text-blue-600 hover:text-blue-700 font-medium"
//                 >
//                   {category.status === 'Active' ? 'Deactivate' : 'Activate'}
//                 </button>
//                 <div className="flex gap-2">
//                   <button className="p-1 text-gray-500 hover:text-green-600 transition-colors">
//                     <Edit2 size={16} />
//                   </button>
//                   <button className="p-1 text-gray-500 hover:text-red-600 transition-colors">
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Add Category Modal */}
//       {showAddCategory && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Category Name
//                 </label>
//                 <input
//                   type="text"
//                   value={newCategory.name}
//                   onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                   placeholder="Enter category name"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Image URL
//                 </label>
//                 <input
//                   type="url"
//                   value={newCategory.image}
//                   onChange={(e) => setNewCategory(prev => ({ ...prev, image: e.target.value }))}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                   placeholder="https://example.com/image.jpg"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Status
//                 </label>
//                 <select
//                   value={newCategory.status}
//                   onChange={(e) => setNewCategory(prev => ({ ...prev, status: e.target.value }))}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                 >
//                   <option value="Active">Active</option>
//                   <option value="Inactive">Inactive</option>
//                 </select>
//               </div>
//             </div>

//             <div className="flex gap-3 mt-6">
//               <button
//                 onClick={() => setShowAddCategory(false)}
//                 className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddCategory}
//                 className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
//               >
//                 Add Category
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CategoryManagement;
import React, { useState } from "react";
import { Plus, Search, Filter, Grid, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import handloomImage from "/src/assets/Handloom.jpg";
import handicraftsImage from "/src/assets/Handicraft.jpg";

const CategoryManagement = () => {
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");

  // Dummy Data
  const [categories] = useState([
    {
      id: 1,
      name: "Handloom",
      image: handloomImage,
      status: "Active",
      products: 25,
      subcategories: [
        { id: 1, name: "Sarees", image: "https://via.placeholder.com/150", status: "Active", products: 12 },
        { id: 2, name: "Shawls", image: "https://via.placeholder.com/150", status: "Inactive", products: 7 },
      ],
    },
    {
      id: 2,
      name: "Handicrafts",
      image: handicraftsImage,
      status: "Active",
      products: 18,
      subcategories: [
        { id: 1, name: "Wooden Toys", image: "https://via.placeholder.com/150", status: "Active", products: 8 },
        { id: 2, name: "Clay Pots", image: "https://via.placeholder.com/150", status: "Active", products: 10 },
      ],
    },
  ]);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryClick = (id) => {
    // Fixed: Navigate with the category ID in the URL
    navigate(`/category-management/sub-category/${id}`);
  };

  return (
    <div className="ml-64 pt-20 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">Category Management</h1>
            <p className="text-gray-600">Dashboard • Categories</p>
          </div>
          <div className="flex gap-3">
            <div className="flex border border-gray-200 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-orange-500 text-white" : "text-gray-500 hover:text-gray-700"}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-orange-500 text-white" : "text-gray-500 hover:text-gray-700"}`}
              >
                <List size={20} />
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              <Plus size={20} />
              Add Category
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={20} />
            Filter
          </button>
        </div>
      </div>

      {/* Categories */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
              onClick={() => handleCategoryClick(cat.id)}
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-auto max-h-50 object-contain " 
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                <p className="text-sm text-gray-600">{cat.products} products</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 font-medium text-gray-700 text-sm border-b">
            <div>Category</div>
            <div>Image</div>
            <div>Status</div>
            <div>Products</div>
          </div>
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="grid grid-cols-4 gap-4 p-4 border-b cursor-pointer hover:bg-gray-50 transition"
              onClick={() => handleCategoryClick(cat.id)}
            >
              <div>{cat.name}</div>
              <img src={cat.image} alt={cat.name} className="w-16 h-12 rounded-lg object-cover" />
              <span>{cat.status}</span>
              <span>{cat.products}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;