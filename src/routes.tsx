import ClientPage from "./pages/ClientPage/ClientPage"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage/LoginPage"
import ProfilePage from "./pages/ProfilePage/ProfilePage"

const public_routes = [
    { path: '/login', component: <LoginPage /> },
    { path: '/profile', component: <ProfilePage /> },
    { path: '/', component: <HomePage /> },
    { path: '*', component: <div>404</div> }
]
const agent_routes = [
    ...public_routes,
    { path: '/client/:id', component: <ClientPage /> },
]


export const routes = {
    public: public_routes,
    agent: agent_routes,
    admin: agent_routes,
}