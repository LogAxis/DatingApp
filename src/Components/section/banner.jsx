import { Component } from "react";

const title = "Find Your True Love";
const desc = "Your match is a click away";

const labelchangeone = "I am a";
const labelchangetwo = "Looking for";
const labelchangethree = "Age";
const labelchangefour = "Province";
const btnText = "Find Your Partner";


const imgLink = "assets/images/banner/01.png";
const imgAlt = "Dating Thumb";

class BannerOne extends Component {
    render() { 
        return (
            <div className="banner padding-top padding-bottom bg_img" style={{backgroundImage: "url(/assets/images/banner/bg.jpg)"}}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6 col-12">
                            <div className="banner__content wow fadeInUp" data-wow-duration="1.5s" data-wow-delay=".5s">
                                <div className="banner__title">
                                    <h2>{title}</h2>
                                    <p>{desc}</p>
                                </div>
                                <div className="banner__form">
                                    <form action="#">
                                        <div className="banner__list">
                                            <label>{labelchangeone}</label>
                                            <div className="row">
                                                <div className="col-6">
                                                    <label className="banner__inputlist" htmlFor="male">
                                                        <input type="radio" id="male" name="me" className="male" defaultChecked />
                                                        <span>Male</span>
                                                        <span className="banner__inputlist--icon"><i className="fa-solid fa-mars"></i></span>
                                                    </label>
                                                </div>
                                                <div className="col-6">
                                                    <label className="banner__inputlist" htmlFor="female">
                                                        <input type="radio" id="female" name="me" className="female" />
                                                        <span>Female</span>
                                                        <span className="banner__inputlist--icon"><i className="fa-solid fa-venus"></i></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="banner__list">
                                            <label>{labelchangetwo}</label>
                                            <div className="row">
                                                <div className="col-6">
                                                    <label className="banner__inputlist" htmlFor="male2">
                                                        <input type="radio" id="male2" name="me2" className="male" />
                                                        <span>Male</span>
                                                        <span className="banner__inputlist--icon"><i className="fa-solid fa-mars"></i></span>
                                                    </label>
                                                </div>
                                                <div className="col-6">
                                                    <label className="banner__inputlist" htmlFor="female2">
                                                        <input type="radio" id="female2" name="me2" className="female" defaultChecked />
                                                        <span>Female</span>
                                                        <span className="banner__inputlist--icon"><i className="fa-solid fa-venus"></i></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="banner__list">
                                            <label>{labelchangethree}</label>
                                            <div className="row">
                                                <div className="col-6">
                                                    <div className="banner__inputlist">
                                                        <select>
                                                            <option defaultValue="18">18</option>
                                                            <option defaultValue="19">19</option>
                                                            <option defaultValue="20">20</option>
                                                            <option defaultValue="21">21</option>
                                                            <option defaultValue="22">22</option>
                                                            <option defaultValue="23">23</option>
                                                            <option defaultValue="24">24</option>
                                                            <option defaultValue="25">25</option>
                                                            <option defaultValue="26">26</option>
                                                            <option defaultValue="27">27</option>
                                                            <option defaultValue="28">28</option>
                                                            <option defaultValue="29">29</option>
                                                            <option defaultValue="30">30</option>
                                                            <option defaultValue="31">31</option>
                                                            <option defaultValue="32">32</option>
                                                            <option defaultValue="33">33</option>
                                                            <option defaultValue="34">34</option>
                                                            <option defaultValue="35">35</option>
                                                            <option defaultValue="36">36</option>
                                                            <option defaultValue="37">37</option>
                                                            <option defaultValue="38">38</option>
                                                            <option defaultValue="39">39</option>
                                                            <option defaultValue="40">40</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="banner__inputlist">
                                                        <select>
                                                            <option defaultValue="25">25</option>
                                                            <option defaultValue="18">18</option>
                                                            <option defaultValue="19">19</option>
                                                            <option defaultValue="20">20</option>
                                                            <option defaultValue="21">21</option>
                                                            <option defaultValue="22">22</option>
                                                            <option defaultValue="23">23</option>
                                                            <option defaultValue="24">24</option>
                                                            <option defaultValue="26">26</option>
                                                            <option defaultValue="27">27</option>
                                                            <option defaultValue="28">28</option>
                                                            <option defaultValue="29">29</option>
                                                            <option defaultValue="30">30</option>
                                                            <option defaultValue="31">31</option>
                                                            <option defaultValue="32">32</option>
                                                            <option defaultValue="33">33</option>
                                                            <option defaultValue="34">34</option>
                                                            <option defaultValue="35">35</option>
                                                            <option defaultValue="36">36</option>
                                                            <option defaultValue="37">37</option>
                                                            <option defaultValue="38">38</option>
                                                            <option defaultValue="39">39</option>
                                                            <option defaultValue="40">40</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="banner__list">
                                            <label>{labelchangefour}</label>
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="banner__inputlist">
                                                        <select id="Province" name="Province">
                                                            <option defaultValue="Eastern Cape">Eastern Cape</option>
                                                            <option defaultValue="Free State">Free State</option>
                                                            <option defaultValue="Gauteng">Gauteng</option>
                                                            <option defaultValue="Limpopo">Limpopo</option>
                                                            <option defaultValue="KwaZulu-Natal">KwaZulu-Natal</option>
                                                            <option defaultValue="Mpumalanga">Mpumalanga</option>
                                                            <option defaultValue="Northern Cape">Northern Cape</option>
                                                            <option defaultValue="North West">North West</option>
                                                            <option defaultValue="Western Cape">Western Cape</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button type="submit" className="default-btn reverse d-block"><span>{btnText}</span></button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className="banner__thumb banner__thumb--thumb1 wow fadeInUp" data-wow-duration="1.5s" data-wow-delay="1s">
                                <img src={imgLink} alt={imgAlt} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default BannerOne;