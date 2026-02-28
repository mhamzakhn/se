import React, { useState } from "react";
import { FaSpinner, FaCheckCircle } from "react-icons/fa";
import api from "../services/api";

const SendEmail = () => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({ subject: false, content: false });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isFormValid = subject.trim() !== "" && content.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      subject: subject.trim() === "",
      content: content.trim() === "",
    };
    setErrors(newErrors);
    if (newErrors.subject || newErrors.content) return;

    setIsLoading(true);
    try {
      await api.post("/api/v1/admin/send-email", { subject, content });

      setSubject("");
      setContent("");
      setErrors({ subject: false, content: false });
      setShowSuccess(true);
      setIsLoading(false);

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-nav">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          Send Email
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-900">
              Subject
            </label>
            {errors.subject && (
              <p className="text-sm text-red-500 mb-1">Please enter a subject.</p>
            )}
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (errors.subject) setErrors(err => ({ ...err, subject: false }));
              }}
              placeholder="Enter subject…"
              className={`block w-full p-2 rounded-md bg-gray-100 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-restaurant-accent ${
                errors.subject ? "border border-red-500" : "border border-gray-300"
              }`}
            />
          </div>

          {}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-900">
              Content
            </label>
            {errors.content && (
              <p className="text-sm text-red-500 mb-1">Please enter the email content.</p>
            )}
            <textarea
              id="content"
              rows={6}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content) setErrors(err => ({ ...err, content: false }));
              }}
              placeholder="Write your message here…"
              className={`block w-full p-2 rounded-md bg-gray-100 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-restaurant-accent ${
                errors.content ? "border border-red-500" : "border border-gray-300"
              }`}
            />
          </div>

          {}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`
                px-4 py-2 rounded transition flex items-center
                ${
                  isFormValid
                    ? isLoading
                      ? "bg-green-500 text-white cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-not-allowed"
                }
              `}
            >
              {isLoading && <FaSpinner className="animate-spin mr-2" />}
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>

      {}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-green-100 border border-green-500 text-green-700 px-6 py-4 rounded-md shadow-lg flex items-center space-x-3 pointer-events-auto">
            <FaCheckCircle className="w-6 h-6" />
            <span className="font-medium">Email sent successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendEmail;
