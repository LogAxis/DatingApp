import { Component } from "react";
import { Link } from "react-router-dom";

const title = "About Dating Le Vavas";
const subtitle = "We aim to evoke emotions, bring people together, and craft joyful stories";
const desc = "Tebogo Leballo, inspired by a lifelong passion for romance, launched 'DatingleVava' after seeking a date for his sister before a wedding in December 2020. Despite the pandemic, he found success in connecting singles through social media, leading to requests from friends for similar help.";
const btnText = "Get A Membership";
const imgUrl = "assets/images/about/01.png";
const imgAlt = "Dating Thumb";

class AboutSectionSix extends Component {
    render() { 
        return (
            <div className="about about--style5 padding-top padding-bottom">
                <div className="container">
                    <div className="row justify-content-center g-4 align-items-center">
                        <div className="col-lg-6 col-12">
                            <div className="about__thumb">
                                <img src={`${imgUrl}`} alt={`${imgAlt}`} />
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className="about__content">
                                <h2>{title}</h2>
                                <h5>{subtitle}</h5>
                                <p>{desc}</p>
                                <Link to="/membership" className="default-btn reverse"><span>{btnText}</span></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default AboutSectionSix;