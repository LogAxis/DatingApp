// src/pages/Home.js
import React from 'react';
import { Component, Fragment } from "react";
import HeaderOne from '../Components/layout/header';
import BannerOne from '../Components/section/banner';
import AboutSectionSix from '../Components/section/aboutsix';
import AppSection from '../Components/section/appsection';
import Footer from '../Components/layout/footer';

class Home extends Component {
    render() { 
        return (
            <Fragment>
               <HeaderOne/>
               <BannerOne/>
               <AboutSectionSix/>
               <AppSection/>
               <Footer/>
            </Fragment>
        );
    }
}

export default Home;
