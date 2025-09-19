import React from 'react'

const Sidebar = () => {
  return (
    <div>
        
    </div>
  )
}

export default Sidebar
{/* <aside className="w-64 bg-white/30 backdrop-blur-md rounded-2xl p-4 shadow-md flex flex-col gap-6 flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-700 mb-2">Filter by Subject</h3>
          <div className="flex flex-col gap-2">
            {subjects.map(subject => (
              <Button
                key={subject}
                className={`rounded-full px-4 py-2 text-sm ${
                  selectedFilters.includes(subject)
                    ? "bg-purple-950 text-white"
                    : "bg-white text-gray-800 hover:bg-gray-200"
                }`}
                onClick={() => toggleFilter(subject)}
              >
                • {subject}
              </Button>
            ))}
          </div>
        </aside>

        {/* Tutors Grid */}
        // <section className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
        //   {filteredTutors.map((tutor) => (
        //     <div
        //       key={tutor.id}
        //       className="flex flex-col justify-between bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 h-44"
        //     >
        //       <div className="flex gap-4 items-center">
        //         <img
        //           src={tutor.image}
        //           alt={tutor.name}
        //           className="w-24 h-24 object-cover rounded-xl shadow-sm"
        //         />
        //         <div>
        //           <h3 className="text-lg font-bold">{tutor.name}</h3>
        //           <p className="text-gray-500 text-sm">{tutor.subject}</p>
        //           <p className="text-yellow-500 font-semibold mt-1 text-sm">⭐ {tutor.rating}</p>
        //         </div>
        //       </div>
        //       <div className="flex gap-2 justify-end mt-4">
        //         <Button className="bg-gradient-to-r from-blue-900 via-purple-800 to-pink-700 text-white rounded-full px-4 py-1 text-sm hover:scale-105 transition">
        //           Connect
        //         </Button>
        //         <Button 
        //           variant="outline"
        //           className="rounded-full border-purple-500/40 bg-gray-100 text-gray-800 px-6 py-3 hover:bg-gray-200 hover:border-gray-500 transition"
        //         >
        //           View
        //         </Button>
        //       </div>
        //     </div>
        //   ))}
        // </section> */}