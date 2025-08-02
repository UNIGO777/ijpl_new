import React from 'react'
import { Trophy, Calendar, MapPin, Users } from 'lucide-react'
import logo from '../assets/logo.jpeg'

const Navbar = () => {
  return (
    <div className="w-full bg-gradient-to-r from-blue-900 to-indigo-900 border-b border-blue-700 py-4 px-4 md:px-10">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        {/* Main League Branding */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="IJPL Logo" className="w-auto h-[7vh] mr-3 rounded-full" />
          <div className="text-center lg:text-left">
            <div className="text-white font-bold text-xl md:text-2xl uppercase">
              Indian Jabalpur Premier League
            </div>
            <div className="text-blue-200 text-sm font-medium">
              Season 2025 - Registration Open
            </div>
          </div>
        </div>

        {/* League Information */}
        <div className="flex flex-col sm:flex-row items-center gap-6 text-white">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">Season 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">Jabalpur, MP</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">All Age Groups</span>
          </div>
        </div>

        {/* Registration CTA */}
        <div className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold text-sm uppercase text-center">
          Register Now - 1,100
        </div>
      </div>
    </div>
  )
}

export default Navbar