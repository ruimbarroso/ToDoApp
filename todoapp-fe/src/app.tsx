import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/userContext";
import ProtectedRoute from "./routes/protectedRoute";
import LoginForm from "./pages/LoginPage/LoginForm";
import HomePage from "./pages/HomePage/HomePage";
import { ToDosProvider } from "./context/todosContext";
import { PopUpsProvider } from "./context/popupsContext";
import PopUp from "./components/PopUps/PopUp";

export function App() {
    return <AuthProvider>
        <ToDosProvider>
            <PopUpsProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<LoginForm />} />
                        <Route
                            path="/"
                            element={<ProtectedRoute><HomePage /></ProtectedRoute>}
                        />
                    </Routes>
                </Router>
                <PopUp />
            </PopUpsProvider>
        </ToDosProvider>
    </AuthProvider>;
}