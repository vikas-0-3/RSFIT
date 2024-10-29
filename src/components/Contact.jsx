import React, { useState } from 'react'
import "./Contact.css";

const Contact = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        message: '',
      });
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
      };


  return (
    <div className="container">
        <h2 className='contact-title'>Contact US</h2>
    <form onSubmit={handleSubmit} className="contact-form">
        <div>
            <label htmlFor="name">Name</label>
            <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            />
        </div>
        <div>
            <label htmlFor="email">Email</label>
            <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            />
        </div>
        <div>
            <label htmlFor="mobile">Mobile No</label>
            <input
            type="tel"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            />
        </div>
        <div>
            <label htmlFor="message">Message</label>
            <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            ></textarea>
        </div>
        <button type="submit">Submit</button>
    </form>
    </div>
  )
}

export default Contact