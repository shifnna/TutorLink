import { FaArrowLeft, FaGraduationCap } from "react-icons/fa"
import { Button } from "../ui/button"

interface HeaderProps {
  name: string;
}

const Header = ({name}:HeaderProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FaGraduationCap className="w-8 h-8 text-amber-400 animate-bounce" />
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-300 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            {name}
          </h1>
        </div>
        <Button className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-xl font-bold hover:scale-105 transition">
          <FaArrowLeft /><a href="/admin-dashboard"> Back to Dashboard</a>
        </Button>
      </div>
    </div>
  )
}

export default Header
