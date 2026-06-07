import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ShoppingBag } from "lucide-react";

export default function NotFound() {
  const location = useLocation();
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 animate-scale-in">
        <div className="text-8xl font-extrabold gradient-text">404</div>
        <h1 className="bangla text-2xl font-bold">পেজটি পাওয়া যায়নি!</h1>
        <p className="bangla text-muted-foreground">আপনি যে পেজটি খুঁজছেন সেটি বিদ্যমান নেই।</p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="bangla btn-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
            <Home className="w-4 h-4" /> হোম
          </Link>
          <Link to="/shop" className="bangla btn-secondary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" /> শপ
          </Link>
        </div>
      </div>
    </div>
  );
}
