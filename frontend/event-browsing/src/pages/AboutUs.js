import React from "react";

const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">About Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="mb-4">
            Welcome to our event browsing platform. We are dedicated to connecting people with exciting events around them. Our mission is to make it easy for everyone to discover, attend, and enjoy a wide variety of events in their local area and beyond.
          </p>
          <p className="mb-4">
            Founded in 2023, our platform has quickly grown to become a go-to resource for event-goers and organizers alike. We believe that events have the power to bring communities together, inspire creativity, and create lasting memories.
          </p>
          <p>
            Whether you're looking for concerts, sports events, cultural festivals, or professional networking opportunities, our platform offers a diverse range of events to suit all interests and preferences.
          </p>
        </div>
        <div>
        
          <img 
            src="https://images.unsplash.com/photo-1487611459768-bd414656ea10?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDMxfHx8ZW58MHx8fHx8" 
            alt="Team working together" 
            className="rounded-lg shadow-md w-full h-auto"
          />
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Our Values</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Community-focused: We prioritize events that bring people together and strengthen local communities.</li>
          <li>Diversity and Inclusion: We strive to showcase a wide range of events that cater to diverse interests and backgrounds.</li>
          <li>User Experience: We continuously improve our platform to ensure a seamless and enjoyable experience for all users.</li>
          <li>Support for Organizers: We provide tools and resources to help event organizers succeed in promoting and managing their events.</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutUs;
