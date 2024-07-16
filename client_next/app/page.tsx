
import "../css/landingpage.css"
import { FC } from 'react';
import { DiApple, DiWebplatform } from "react-icons/di";
import { SlArrowRightCircle } from "react-icons/sl";
import { GoogleOriginal, GooglecloudOriginalWordmark, KaggleOriginal, LinuxOriginal, OpenapiOriginalWordmark,FacebookOriginal,OpenalOriginal,FigmaOriginal,DiscordjsOriginalWordmark,ReactOriginal,AppleOriginal } from 'devicons-react';

interface DividerProps {
  text: string;
}

interface ServiceBoxProps {
  titleComponent: () => JSX.Element;
  subTitle: {
    text: string;
    icon: () => JSX.Element;
  };
  setMobileService: (serviceType: string) => void;
  mobileService: "fixed" | "hourly";
}



export default function Home() {
  return (
    <div className="home-page">
      <HeroSection />

      <WidgetSection />

    </div>
  );
}


const HeroSection = () => {
  return(
      <div className="row1">
      <div className="hero-left">
          <div className="hero-m-title">
              <h2>Prevent now, for a safe and long future</h2>
          </div>
          <div className="hero-s-title">
              <h4>Stairs brings together your team's working docs and important discussions. Move projects faster, work more asyncrously and feel connected.</h4>
          </div>
          <div className="hero-b-row">
              <div className="filled-btn">
                  <h4>Try Stairs for free</h4>
              </div>
              <div className="unfilled-btn">
                  <h4>How it works</h4>
              </div>
          </div>
          <div className="trust-row">
              <h6>Companies trust us</h6>
              <GoogleOriginal size={30} style={{opacity:0.5}} />
              <FacebookOriginal size={30} style={{opacity:0.5}} />
              <OpenalOriginal size={30} style={{opacity:0.5}} />
          </div>
      </div>
  </div>
  )
};


const WidgetSection = () => {
  return(    
  <section id="why-us">
      <WhyUs_Divider 
          text={"WHY CHOOSE US ?"}
      />
      <h3 className="why-us-title"> <span className="gradient-span-purple">Modern</span> & <span className="gradient-span-green">Powerful</span> skills</h3>
      <h5 className="why-us-desc">Each member of our team is highly skilled and experienced in their domain, which makes our service quick, powerful and most up to date to the current market</h5>

      <Bubble_Container />

</section>)
};

const WhyUs_Divider: FC<DividerProps>  = ({
  text
}) => {
  return(
      <div className="why-us-divider">
          <hr />
          <h6>{text}</h6>
          <hr style={{borderImage:"linear-gradient(to left, rgba(0, 0, 0, 0.3), rgba(83, 83, 83)) 1"}} />
      </div>
  )
}

const Bubble_Container = () => {
  return(
      <div className="why-bubble-container">
      <div className="why-us-cont_t-1">
          <div className="why-bubble-t">
              <div className="bubble-title">
                  <h4>Delightful and <span style={{color:"white",fontWeight:700}}>simple</span> stat</h4>    
              </div>
              <div className="bubble-badge-green">
                  <h3>+ 10 000 hours of experience </h3>
              </div>
          </div>
          
          <div className="why-bubble-b">
              App Developers
          </div>
      </div>

      <div className="why-us-cont_t-2">
          <div className="why-bubble-t">
              Machine Learning
          </div>
          <div className="why-bubble-b">
              Web Developers
          </div>
      </div>
      <div className="why-us-cont_t-3">
      
          <div className="why-bubble-t">
              Web Developers
          </div>
          
          <div className="why-bubble-b">
              Mobile Developers
          </div>
      </div>
  </div>
  )
}

const OurServicesSection = ({

}) => {
  return(
      <section id="services">
      <WhyUs_Divider 
          text={"How can we help ?"}
      />
      <h3 className="why-us-title"> Our <span className="gradient-span-purple">Services</span> </h3>
      <h5 className="why-us-desc">Each member of our team is highly skilled and experienced in their domain, which makes our service quick, powerful and most up to date to the current market</h5>
      
      <ServiceBox_Video_Timeline />

      <ServiceBox_SingleFeature 
          titleComponent={() =>
              <h3 className="s-m-desc">Get your dream <span className="word-high-primary">Mobile App</span> idea up and running on both IOS and Android appstores !</h3>
          }
          setMobileService={(e) => {}}
          mobileService="hourly"
          subTitle={{text:"Topic Interesting Desc",icon:() => <DiApple size={35} color="white" />}}
      />

      <div className="services-container" style={{flexDirection:"row-reverse"}}>
          <div className="service-box" >
              <div className="s-t-desc-cont">
                  <GoogleOriginal size={35} color="white" />
                  <h5>Topic Interesting Desc</h5>
              </div>
              <h3 className="s-m-desc">Get your dream <span className="word-high-secondary">Web App</span> idea up and running on all mainstream platforms !</h3>
              <div className="s-cont">
                  <div className="s-row">
                      <DiApple color="white" />
                      <h4>Service Title</h4>
                      <SlArrowRightCircle color="white" />
                  </div>

                  <div className="s-row">
                      <DiApple color="white" />
                      <h4>Service Title</h4>
                      <SlArrowRightCircle color="white" />
                  </div>

                  <div className="s-row">
                      <DiApple color="white" />
                      <h4>Service Title</h4>
                      <SlArrowRightCircle color="white" />
                  </div>
              </div>
              <div className="see-more-btn">
                  <h4>Interested</h4>
              </div>
          </div>

      </div>

      <div className="service-bottom-row">
          <div className="consultation-box">
              <h5>We are up for the challange</h5>
              <h2>Appoint a <span>Free</span> consultation</h2>
              <h3>In order to make an appointment you will need to answer a few crutial questions designed for understanding your needs ...</h3>
              <div className="consultation-btn">
                  <h4>Get Started</h4>
              </div>
          </div>

          <div className="consultation-box">
              <h5>We are up for the challange</h5>
              <h2>Appoint a <span>Free</span> consultation</h2>
              <h3>In order to make an appointment you will need to answer a few crutial questions designed for understanding your needs ...</h3>
              <div className="consultation-btn">
                  <h4>Get Started</h4>
              </div>
          </div>
      </div>

  </section>
  )
}

const ServiceBox_Video_Timeline = () => {
  return(
      <div className="services-container-video">
      <div className="service-box-video">
          <div className="s-t-desc-cont">
              <DiApple size={35} color="white" />
              <h5>Topic Interesting Desc</h5>
          </div>
          <h3 className="s-m-desc">This is the process for making your<span className="word-high-primary"> Product</span> !</h3>
          <div className="service-process-row">
              <div className="service-video">

              </div>

              <ol className="timeline">
                  <li className="timeline-item">
                      <span className="timeline-item-icon | faded-icon">
                          <DiscordjsOriginalWordmark size={50} />
                      </span>
                      <div className="timeline-item-description">
                          <i className="avatar | small">
                              1
                          </i>
                          <span><a>Converting </a>your ideas to <a>technical solutions</a> for limitation assesment</span>
                      </div>
                  </li>
                  
                  <li className="timeline-item">
                      <span className="timeline-item-icon | faded-icon">
                          <FigmaOriginal size={30} />
                      </span>
                      <div className="timeline-item-description">
                          <i className="avatar | small">
                              2
                          </i>
                          <span><a>Designing</a> & <a>Planning</a><h5> UI / UX / Frontend / Backend </h5> <br />with for proper communication and constans <a>client feedback</a></span>
                      </div>
                  </li>

                  <li className="timeline-item">
                      <span className="timeline-item-icon | faded-icon">
                          <ReactOriginal size={30} />
                      </span>
                      <div className="timeline-item-description">
                          <i className="avatar | small">
                              3
                          </i>
                          <span>Application <a>Building</a> with transparent progress feedback</span>
                      </div>
                  </li>

                  <li className="timeline-item">
                      <span className="timeline-item-icon | faded-icon">
                          <AppleOriginal size={30} />
                      </span>
                      <div className="timeline-item-description">
                          <i className="avatar | small">
                              4
                          </i>
                          <span><a>Publishing</a> your app to Appstores & Managing your <a>well-organised</a> software for your future development</span>
                      </div>
                  </li>
              </ol>

          </div>

      </div>
  </div>
  )
}

const ServiceBox_SingleFeature: FC<ServiceBoxProps> = ({
  titleComponent,
  subTitle,
  setMobileService,
  mobileService,
}) => {
  return(
      <div className="services-container">
      <div className="service-box">
          <div className="s-t-desc-cont">
              <DiApple size={35} color="white" />
              <h5>{subTitle.text}</h5>
          </div>
          {titleComponent()}
          <div className="s-cont">
              <div onClick={() => setMobileService("hourly")} className={`${mobileService == "hourly" ? "s-row active" : "s-row"}`}>
                  <DiApple color="white" />
                  <h4>Hourly Rate Service</h4>
                  <SlArrowRightCircle color="white" />
              </div>

              <div onClick={() => setMobileService("fixed")} className={`${mobileService == "fixed" ? "s-row active" : "s-row"}`}>
                  <DiApple color="white" />
                  <h4>Fixed Price Project</h4>
                  <SlArrowRightCircle color="white" />
              </div>
          </div>
          <div className="see-more-btn">
              <h4>Interested</h4>
          </div>
      </div>
      <div className="service-desc-cont">
          <div className="service-dec-img">

          </div>
          <div className="service-desc-box">
              <h4>30 $ / Hour </h4>
              <h4>Recommended:</h4>
              <ul>
                  <li>For feature updates</li>
                  <li>Implementing new ideas</li>
                  <li>Less Planning - Quick & Effective</li>
              </ul>
          </div>
      </div>
  </div>
  )
}

export const Why_Us_Section = () => {
  return(
      <section id="why-us">
      <WhyUs_Divider 
          text={"Pocket Protect Team"}
      />
      <h3 className="why-us-title"> <span className="gradient-span-purple">Young</span> & <span className="gradient-span-green">Passionate</span> Team</h3>
      <h5 className="why-us-desc">We strive for bringing your wildest ideas to life with proper and reccurrent communication & multiple iteration for the perfect product </h5>

  
  </section>
  )
}


const OLD_VERSION =() => {
  return(
          
          <>
          <div className="home-services">
          {/*TITLE*/}
          <div className="services-title">
            <h6>
              Our Services
            </h6>
            <h2>
              What We Offer
            </h2>
          </div>
          {/*ROW 1*/}
          <div className="services-row">
            {/*Box 1*/}
            <div className="service-box">
              <div className="service-box-title">
                <MedicalIconIHealthServices />
                <h4>Cardiovascular Risk</h4>
              </div>
              <h6>Assess your risk for cardiovascular diseases</h6>
              <div className="service-box-btn">
                See More
              </div>
            </div>
            {/*Box 2*/}
            <div className="service-box">
              <div className="service-box-title">
                <MedicalIconIHealthServices />
                <h4>Cardiovascular Risk</h4>
              </div>
              <h6>Assess your risk for cardiovascular diseases</h6>
              <div className="service-box-btn">
                See More
              </div>
            </div>
            {/*Box 3*/}
            <div className="service-box">
              <div className="service-box-title">
                <MedicalIconIHealthServices />
                <h4>Cardiovascular Risk</h4>
              </div>
              <h6>Assess your risk for cardiovascular diseases</h6>
              <div className="service-box-btn">
                See More
              </div>
            </div>
          </div>
          {/*ROW 2*/}
          <div className="services-row">
            {/*Box 1*/}
            <div className="service-box">
              <div className="service-box-title">
                <MedicalIconIHealthServices />
                <h4>Cardiovascular Risk</h4>
              </div>
              <h6>Assess your risk for cardiovascular diseases</h6>
              <div className="service-box-btn">
                See More
              </div>
            </div>
            {/*Box 2*/}
            <div className="service-box">
              <div className="service-box-title">
                <MedicalIconIHealthServices />
                <h4>Cardiovascular Risk</h4>
              </div>
              <h6>Assess your risk for cardiovascular diseases</h6>
              <div className="service-box-btn">
                See More
              </div>
            </div>
            {/*Box 3*/}
            <div className="service-box">
              <div className="service-box-title">
                <MedicalIconIHealthServices />
                <h4>Cardiovascular Risk</h4>
              </div>
              <h6>Assess your risk for cardiovascular diseases</h6>
              <div className="service-box-btn">
                See More
              </div>
            </div>
          </div>
          </div>
        
        <div className="showcase">
          <h1 style={{padding:50}}>Prevention Over Recovery</h1>
          <div className="showcase-table">
            <div className="showcase-box">
                <h4>Valami text</h4>
                <h5>Image</h5>
            </div>
            <div className="showcase-box">
                <h4>Valami text</h4>
                <h5>Image</h5>
            </div>
            <div className="showcase-box">
                <h4>Valami text</h4>
                <h5>Image</h5>
            </div>
          </div>
        </div>
        </>
  )
}