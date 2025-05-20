const testimonialsData = [
  {
    id: 1,
    rating: 5,
    content: "Our trip to Rajasthan was absolutely magical! The hotel arrangements were perfect, and the guided tours gave us deep insights into the rich culture. YatraIndia made everything hassle-free.",
    name: "Priya Sharma",
    location: "Delhi, India",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg"
  },
  {
    id: 2,
    rating: 4.5,
    content: "The flight booking process was seamless, and we got amazing deals for our family vacation to Goa. The beach resort exceeded our expectations. Will definitely book through YatraIndia again!",
    name: "Rahul Mehta",
    location: "Mumbai, India",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    rating: 5,
    content: "As a solo female traveler, safety was my priority. YatraIndia's service was exceptional - from airport pickup to hotel stays. Their 24/7 support gave me peace of mind throughout my Kerala trip.",
    name: "Ananya Patel",
    location: "Bengaluru, India",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-[#1D3557] mb-3">What Our Travelers Say</h2>
          <p className="text-[#457B9D] max-w-2xl mx-auto">Read genuine reviews from travelers who have experienced our services</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial) => (
            <div key={testimonial.id} className="bg-[#F1FAEE] p-6 rounded-lg shadow-card">
              <div className="flex text-[#F7B801] mb-4">
                {[...Array(Math.floor(testimonial.rating))].map((_, index) => (
                  <i key={index} className="fa-solid fa-star"></i>
                ))}
                {testimonial.rating % 1 !== 0 && (
                  <i className="fa-solid fa-star-half-alt"></i>
                )}
              </div>
              <p className="text-gray-600 mb-6">{testimonial.content}</p>
              <div className="flex items-center">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-medium text-[#1D3557]">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
