import { Link, NavLink } from "react-router-dom";
import "./Header.scss"

// import LogoutAndAdmin from "../../LogoutAndAdmin";
import { MenuFoldOutlined,MenuUnfoldOutlined  } from '@ant-design/icons';
import { getCookie } from "../../../helpers/cookie";
import LogoutAndAdmin from "../../LogoutAndAdmin";



function Header(props) {
    const { collapsed, setCollapsed } = props;
    const token = getCookie("token");
    return (
        <>
            <header className='header'>
                <div className='header__logo'>
                    <div className={"header__logo-img " + (collapsed && "header__logo-img-false")}>
                        {
                            !token ? <Link to={"/"}>{collapsed ? <>IT</> : <>Duong IT</>}</Link> :
                            <Link>{collapsed ? <>IT</> : <>Duong IT</>}</Link>
                        }
                        
                    </div>
                    {
                        token && (
                            <>
                                <div className="header__logo-nav">
                                    <span className="header__logo-nav-colnav" onClick={() => { setCollapsed(!collapsed) }}>
                                       {collapsed ? <MenuUnfoldOutlined />:<MenuFoldOutlined />} 
                                    </span>

                                </div>
                            </>
                        )
                    }

                </div>

                <div className="header__account">
                    {
                        token ?
                            (
                                <>
                                    <LogoutAndAdmin />
                                </>
                            )
                            :
                            (
                                <>
                                    <NavLink to={"/login"}>
                                        Login
                                    </NavLink>
                                    <NavLink to={"register"}>
                                        Register
                                    </NavLink>
                                </>
                            )
                    }

                </div>
                <div className="header__bar">
                    {/* <HeaderBar token = {token}/> */}
                </div>
            </header>
        </>
    )
}
export default Header