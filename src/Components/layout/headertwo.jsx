import { Component } from "react";
import { Link, NavLink } from "react-router-dom";

let HeaderInfoList = [
    {
        iconName: 'fa-solid fa-phone',
        text: '+27 60 497 7954',
    },
    {
        iconName: 'fa-solid fa-envelope',
        text: 'info@datinglevava.co.za',
    },
]

let HeaderSocialList = [
    {
        iconName: 'fa-brands fa-facebook-f',
        text: 'Dating Le Vava',
        link: '#https://web.facebook.com/cedric.leballo'
    },
    {
        iconName: 'fa-brands fa-instagram',
        text: 'Dating le Vava',
        link: '#'
    },
    {
        iconName: 'fa-brands fa-tiktok',
        text: 'Dating Le Vava',
        link: '#'
    },
]

class HeaderTwo extends Component {
    render() { 
        window.addEventListener('scroll', function() {
            var value = window.scrollY;
            if (value > 200) {
                document.querySelector('.header').classList.add(['header-fixed'], ['animated'], ['fadeInDown'])
            }else{
                document.querySelector('.header').classList.remove(['header-fixed'], ['animated'], ['fadeInDown'])
            }
        });
        return (
            <header className="header" id="navbar">
                <div className="header__top d-none d-lg-block">
                    <div className="container">
                        <div className="header__top--area">
                            <div className="header__top--left">
                                <ul>
                                    {HeaderInfoList.map((val, i) => (
                                        <li key={i}>
                                            <i className={val.iconName}></i> <span>{val.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="header__top--right">
                                <ul>
                                    {HeaderSocialList.map((val, i) => (
                                        <li key={i}><a href={val.link}><i className={val.iconName}></i> {val.text}</a></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="header__bottom">
                    <div className="container">
                        <nav className="navbar navbar-expand-lg">
                            <Link className="navbar-brand" to="/"><img src="assets/images/logo/logo.png" alt="logo" /></Link>
                            <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false"
                                aria-label="Toggle navigation">
                                <span className="navbar-toggler--icon"></span>
                            </button>
                            <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
                                <div className="navbar-nav mainmenu">
                                    <ul>
                                    <li><NavLink to="/homethree">Home</NavLink></li>
                                    <li><NavLink to="/member-single">Members</NavLink></li> 

                                     <li className="menu-item-has-children">
                                            <a href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-bs-offset="0,0">Events</a>
                                            <ul className="dropdown-menu">
                                                <li><NavLink to="/blog">Events</NavLink></li>
                                                <li><NavLink to="/members">Upcoming Events</NavLink></li>
                                                <li><NavLink to="/membership">Event Details</NavLink></li>
                                            </ul>
                                        </li>
                                        <li><NavLink to="/contact">contact</NavLink></li>
                                    </ul>
                                </div>
                                <div className="header__more">
                                    <button className="default-btn dropdown-toggle" type="button" id="moreoption" data-bs-toggle="dropdown" aria-expanded="false">My Account</button>
                                    <ul className="dropdown-menu" aria-labelledby="moreoption">
                                        <li><Link className="dropdown-item" to="/login">Log In</Link></li>
                                        <li><Link className="dropdown-item" to="/register">Sign Up</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>
        );
    }
}
 
export default HeaderTwo;