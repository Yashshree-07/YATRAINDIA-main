const TravelExperience = () => {
  return (
    <section className="py-16 bg-[#1D3557]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">Experience the Rich Culture & Heritage of India</h2>
            <p className="text-[#A8DADC] mb-6">
              India is a land of diverse cultures, ancient traditions, and breathtaking landscapes. 
              From the snow-capped Himalayas to the sun-kissed beaches of Goa, from the royal palaces 
              of Rajasthan to the serene backwaters of Kerala.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <i className="fa-solid fa-check text-[#F7B801] mr-2"></i>
                <span className="text-white">Cultural Experiences</span>
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-check text-[#F7B801] mr-2"></i>
                <span className="text-white">Historical Monuments</span>
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-check text-[#F7B801] mr-2"></i>
                <span className="text-white">Wildlife Adventures</span>
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-check text-[#F7B801] mr-2"></i>
                <span className="text-white">Culinary Delights</span>
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-check text-[#F7B801] mr-2"></i>
                <span className="text-white">Spiritual Journeys</span>
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-check text-[#F7B801] mr-2"></i>
                <span className="text-white">Adventure Sports</span>
              </div>
            </div>
            <button className="bg-[#F7B801] text-white px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition duration-300 flex items-center">
              <i className="fa-solid fa-compass mr-2"></i>
              Explore Travel Packages
            </button>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
            <div>
              <img src="https://images.unsplash.com/photo-1598091383021-15ddea10925d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Kerala Backwaters" className="w-full h-48 object-cover rounded-lg mb-4" />
              <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Taj Mahal" className="w-full h-36 object-cover rounded-lg" />
            </div>
            <div className="mt-6">
              <img src="https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Holi Festival" className="w-full h-36 object-cover rounded-lg mb-4" />
              <img src="https://images.unsplash.com/photo-1470075801209-17f9ec0cada6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Himalayan Mountains" className="w-full h-48 object-cover rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelExperience;
