import { Component } from "react";

const subtitle = "Stay Connected!";
const title = "Our App is Launching Soon";
const desc = "Looking for more convenience? No need to fret—our app will be launching soon, simplifying your online dating experience with Vava, and making it quick and easy, all at your fingertips! In the meantime, enjoy connecting with your matches!";



let AppList = [
    {
        imgUrl: 'assets/images/app/01.jpg',
        imgAlt: 'Dating Thumb',
        siteLink: '#',
    },
    {
        imgUrl: 'assets/images/app/02.jpg',
        imgAlt: 'Dating Thumb',
        siteLink: '#',
    },
]

class AppSectionTwo extends Component {
    render() { 
        return (
            <div className="app app--style2 padding-top padding-bottom">
                <div className="container">
                    <div className="row g-4 justify-content-center">
                        <div className="col-xxl-6 col-12">
                            <div className="app__item wow fadeInUp" data-wow-duration="1.5s">
                                <div className="app__inner">
                                    <div className="app__content text-center">
                                        <h4>{subtitle}</h4>
                                        <h2>{title}</h2>
                                        <p>{desc}</p>
                                        <ul className="justify-content-center">
                                            {AppList.map((val, i) => (
                                                <li key={i}><a href={`${val.siteLink}`}><img src={`${val.imgUrl}`} alt={`${val.imgUrl}`} /></a></li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default AppSectionTwo;