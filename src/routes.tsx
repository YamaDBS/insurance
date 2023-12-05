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
    { path: '/insurances', component: <div>insurances</div> },
    { path: '/users', component: <div>users</div> }
]

const admin_routes = [
    ...agent_routes,
    { path: '/agents', component: <div>insurances</div> },
]

export const routes = {
    public: public_routes,
    admin: admin_routes,
    agent: agent_routes
}