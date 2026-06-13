import React from 'react';
import Header from '../components/Header/Header';
import HeroSection from '../components/HeroSection/HeroSection';
import SearchBar from '../components/SearchBar/SearchBar';
import FeaturedSlider from '../components/FeaturedSlider/FeaturedSlider';
import QuotesCarousel from '../components/QuotesCarousel/QuotesCarousel';
import WelcomeGallery from '../components/WelcomeGallery/WelcomeGallery';
import TimelineSection from '../components/TimelineSection/TimelineSection';
import AboutSection from '../components/AboutSection/AboutSection';
import NewsletterCTA from '../components/NewsletterCTA/NewsletterCTA';
import Footer from '../components/Footer/Footer';
import ScrollReveal from '../components/common/ScrollReveal/ScrollReveal';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="homepage" id="homepage">
      <Header />
      <main>
        <HeroSection />
        
        <ScrollReveal animation="fade-up" delay="0.1s">
          <SearchBar />
        </ScrollReveal>
        
        <ScrollReveal animation="fade-up">
          <FeaturedSlider />
        </ScrollReveal>
        
        <ScrollReveal animation="fade-in">
          <QuotesCarousel />
        </ScrollReveal>
        
        <ScrollReveal animation="fade-up">
          <WelcomeGallery />
        </ScrollReveal>
        
        <ScrollReveal animation="fade-up">
          <TimelineSection />
        </ScrollReveal>
        
        <ScrollReveal animation="fade-up">
          <AboutSection />
        </ScrollReveal>
        
        <ScrollReveal animation="zoom-in">
          <NewsletterCTA />
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  );
}
