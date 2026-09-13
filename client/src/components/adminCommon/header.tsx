import { FaArrowLeft, FaGraduationCap } from "react-icons/fa"
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom";

// Midnight theme type treatment — matches Home / ExploreTutors
const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };

interface HeaderProps {
  name: string;
}

const Header = ({name}:HeaderProps) => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FaGraduationCap className="w-8 h-8 text-[#7C9CFF] animate-bounce" />
          <h1
            className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#7C9CFF] via-[#A78CF5] to-[#C08BFA] bg-clip-text text-transparent"
            style={fraunces}
          >
            {name}
          </h1>
        </div>
        <Button className="flex items-center gap-2 bg-gradient-to-r from-[#7C9CFF] to-[#C08BFA] text-[#0E1016] rounded-xl font-bold hover:scale-105 transition"
        onClick={()=>navigate("/admin-dashboard")}>
          <FaArrowLeft />Back to Dashboard
        </Button>
      </div>
    </div>
  )
}

export default Header