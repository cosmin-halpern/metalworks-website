import React from 'react';

const ContactForm: React.FC = () => {
  return (
    <form>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" />
      </div>
      <div>
        <label htmlFor="message">Message:</label>
        <textarea id="message" name="message"></textarea>
      </div>
      <button type="submit">Send Message</button>
    </form>
  );
};

export default ContactForm; 