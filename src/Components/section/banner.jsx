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
    constructor(props) {
        super(props);
        this.state = {
            currentSentenceIndex: 0,
        };
        this.sentences = [
            "Chomi nayindoda.",
            "Okakreya motho.",
            "Kry jou person.",
            "Shela mfowethu.",
            "Okatopatopa",
            "Make that connection",
            "ninga wana Lufuno"
        ];
    }

    componentDidMount() {
        this.sentenceInterval = setInterval(() => {
            this.setState((prevState) => ({
                currentSentenceIndex: (prevState.currentSentenceIndex + 1) % this.sentences.length,
            }));
        }, 9000); // Change every 3 seconds
    }

    componentWillUnmount() {
        clearInterval(this.sentenceInterval); // Cleanup interval when component unmounts
    }

    handleJoinClick = () => {
        // Navigate to a new route when button is clicked
        this.props.history.push('/register');  // Navigate to the 'join' page
    };
    
    render() { 
        return (
            <div className="banner padding-top padding-bottom bg_img" style={{backgroundImage: "url(/assets/images/banner/bg.jpg)"}}>
                <div className="container">
                    <div className="row justify-content-center">
                    <h2 style={{ color: 'white', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }} className="welcome-text">
                            {this.sentences[this.state.currentSentenceIndex]}
                        </h2>
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