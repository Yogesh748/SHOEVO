import React, { useState, useRef } from 'react'; // 1. Import useRef
import emailjs from '@emailjs/browser'; // 2. Import EmailJS
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
  // State for form inputs (for clearing the form)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  // State for submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null); // { type: 'success' | 'error', text: '...' }
  
  // 3. Create a ref for the form element
  const form = useRef();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 4. Update the submit handler to use EmailJS
  const onSubmitHandler = async (e) => {
    e.preventDefault(); // Prevent default form reload
    setIsSubmitting(true);
    setSubmitMessage(null);

    const YOUR_SERVICE_ID = "service_8cdf4h9";
    const YOUR_TEMPLATE_ID = "template_p9rmosu";
    const YOUR_PUBLIC_KEY = "deO3LOYdtrLFX0jIl";
    

    try {
      // Send the form data using the form ref
      await emailjs.sendForm(
        YOUR_SERVICE_ID,
        YOUR_TEMPLATE_ID,
        form.current, // Pass the form element itself
        YOUR_PUBLIC_KEY
      );

      // On success:
      setIsSubmitting(false);
      setSubmitMessage({ type: 'success', text: 'Thank you! Your message has been sent. We will get back to you soon.' });
      setFormData({ name: '', email: '', subject: '', message: '' }); // Clear the controlled state
      form.current.reset(); // Reset the form fields
      
    } catch (error) {
      // On error:
      console.error("EmailJS Error:", error);
      setIsSubmitting(false);
      setSubmitMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Get In Touch</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          Have questions about your order? We're here for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Contact Form */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
          {/* 5. Add the ref={form} to the form element */}
          <form ref={form} onSubmit={onSubmitHandler} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                {/* The 'name' attribute MUST match your EmailJS template variable (e.g., {{name}}) */}
                <input type="text" name="name" id="name" value={formData.name} onChange={onChangeHandler} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
                {/* The 'name' attribute MUST match (e.g., {{email}}) */}
                <input type="email" name="email" id="email" value={formData.email} onChange={onChangeHandler} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black" />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
              {/* The 'name' attribute MUST match (e.g., {{subject}}) */}
              <input type="text" name="subject" id="subject" value={formData.subject} onChange={onChangeHandler} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              {/* The 'name' attribute MUST match (e.g., {{message}}) */}
              <textarea name="message" id="message" value={formData.message} onChange={onChangeHandler} required rows="5" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-black focus:border-black"></textarea>
            </div>
            <div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
                  isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
            {/* Submission Message */}
            {submitMessage && (
              <div className={`text-sm font-medium text-center p-3 rounded-md ${
                submitMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {submitMessage.text}
              </div>
            )}
          </form>
        </div>

        {/* Contact Info (Unchanged) */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
          <p className="text-gray-600">
            You can also reach us at any of the contact points below. Our customer service team is available
            from 9 AM to 6 PM, Monday to Friday.
          </p>
          <div className="flex items-start gap-4">
            <FaEnvelope size={20} className="text-gray-700 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Email</h3>
              <p className="text-gray-600">support@shoevo.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <FaPhone size={20} className="text-gray-700 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
              <p className="text-gray-600">+91 01234 56789</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <FaMapMarkerAlt size={20} className="text-gray-700 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Address</h3>
              <p className="text-gray-600">123 Shoe Lane, Footwear City</p>
              <p className="text-gray-600">Amritsar, 143001, India</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
