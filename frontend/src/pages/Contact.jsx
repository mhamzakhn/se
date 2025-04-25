import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-darkblue via-deepblack to-darkblue text-white px-6 py-16 flex justify-center items-start">
      <div className="w-full max-w-4xl bg-card p-8 rounded-2xl shadow-2xl border border-border">
        <h1 className="text-2xl font-bold mb-4 text-center">Contact Us</h1>

        <p className="text-center text-muted mb-10 text-lg">
          <span className="text-primary font-semibold"></span>We are a Chinese cuisine serving food made with passion. Try us out and we are sure you will visit us again.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-primary mb-1">Phone Numbers</h2>
              <p>📞 0305 5696401</p>
              <p>📞 0305 5696404</p>
              <p>📞 (042) 35708699</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-primary mb-1">Email</h2>
              <p>📧 <a href="mailto:zaanpanasian@gmail.com" className="text-blue-400 hover:underline">zaanpanasian@gmail.com</a></p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-primary mb-1">Timings</h2>
              <p>🕒 Mon–Fri: 12 PM – 11:30 PM</p>
              <p>🕒 Sat–Sun: 3 PM – 12 AM</p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg">
            <iframe
              title="Zaan Location"
              src="https://maps.google.com/maps?q=zaan%20pan%20asian%20lahore&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="350"
              frameBorder="0"
              className="rounded-xl border border-muted"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
