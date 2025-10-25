import { useAuthInit } from "./hooks/AuthInitializer";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const loading = useAuthInit();

  if (loading)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return <AppRoutes />;
}

export default App;
