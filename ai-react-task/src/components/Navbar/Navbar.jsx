import { useContext } from "react";
import { Authcontext } from "../AuthProvider/AuthProvider";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
    const { user, logOut } = useContext(Authcontext);


    // handle LogOUt
    const handleLogOUt = () => {
        logOut()
            .then()
            .catch(error => {
                console.log(error)
            })
    }


    const navItems = <>
        <li className='mr-4'>
            <NavLink
                to='/'
                className={({ isActive }) => isActive ? "font-bold text-white" : "text-black"}
            >Home
            </NavLink>
        </li>
        <li className='mr-4'>
            <NavLink
                to='/leaderboard'
                className={({ isActive }) => isActive ? "font-bold text-white" : "text-black"}
            >Leaderboard
            </NavLink>
        </li>

        <li className='mr-4'>
            {!user ?
                <NavLink
                    to='/register'
                    className={({ isActive }) => isActive ? "font-bold text-white" : "text-black"}
                >Register
                </NavLink> :
                <></>
            }
        </li>
    </>

    return (
        <div className="navbar sticky top-0 z-50 bg-blue-500 text-white lg:px-12 md:px-8">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden px-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-blue-500 rounded-box w-52">
                        {navItems}
                    </ul>
                </div>
                <div className="">
                    <Link to="/" className="btn btn-ghost normal-case text-xs md:text-xl px-0 ml-2"> AI Text Generator</Link>
                </div>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navItems}
                </ul>
            </div>
            <div className="navbar-end">
                {
                    user ? <>
                        <div className="tooltip tooltip-left" data-tip={user?.displayName}>
                            <img className='rounded-full w-6 h-6 md:w-10 md:h-10 mr-3' src={user?.photoURL || "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png"} alt="User image" />
                        </div>
                        <button onClick={handleLogOUt} className='btn btn-sm lg:btn'>Logout</button>
                    </> :
                        <Link to='/login'>
                            <button className='btn btn-sm lg:btn lg:btn-neutral'>Login</button>
                        </Link>
                }
            </div>
        </div>
    );
};

export default Navbar;
