import { useForm } from "react-hook-form";
import {  Send, MessageCircle, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { contactForm } from "../../api/api";
import useTitle from "../../hooks/pageTitle"


const Contact = () => {
    useTitle("Contact | Smart Campus");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },

  } = useForm({ mode: "onChange" });
  
  const onSubmit = async (data) => {
   try{
    const res =await contactForm(data);
    toast.success('Message sent successfully!');
    reset();
   }catch(err){
    const status = err.response?.status;
    if(status === 429 ){
        toast.error('Too many requests, please try again later.');
    }else if(status === 400){
        toast.error('Bad request, please check your input.');
    }else{
        toast.error('Something went wrong, please try again later.');
    }

   }

   
  };
  
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-6 sm:py-10 px-4">
      {" "}
      {/* Header Section */}
      <div className="w-full max-w-2xl text-center mb-6 sm:mb-10">
        <div className="relative inline-block">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600 mb-3 tracking-tight drop-shadow-lg">
            Contact Us
          </h1>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 md:w-40 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-80"></div>
        </div>
        <p className="text-gray-600 text-base sm:text-lg md:text-xl px-2 mt-4">
          We'd love to hear from you! Reach out for any inquiries, support, or
          feedback.
        </p>
      </div>      {/* Main Content Section */}
      <div className="w-full max-w-[85vw] md:max-w-4xl bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100/50 flex flex-col md:flex-row overflow-hidden mx-2 sm:mx-4">
        {" "}
        {/* Contact Info */}{" "}
        <div className="flex-1 bg-gradient-to-br from-blue-50/60 to-purple-50/40 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-100/50">
          {" "}
          <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-2 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />{" "}
            Get in Touch
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 text-center">
            We typically respond within{" "}
            <span className="text-blue-600 font-semibold">24 hours</span>
          </p>
        </div>{" "}
        {/* Contact Form */}
        <form
          className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col justify-center bg-white/90"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-4 sm:mb-6 flex items-center gap-2">
            <Send className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" /> Send a
            Message
          </h2>
          <div className="mb-3 sm:mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              className={`w-full p-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 transition bg-white text-sm sm:text-base font-medium ${
                errors.name 
                  ? "border-red-400 focus:border-red-500 bg-red-50/30" 
                  : "border-gray-300 focus:border-blue-500"
              }`}
              placeholder="Your Name"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 6,
                  message: "Name must be at least 6 characters",
                },
              })}
            />
            {errors.name && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center gap-2 text-red-700 font-mono text-sm font-medium">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="leading-tight">{errors.name.message}</span>
                </div>
              </div>
            )}
          </div>
          <div className="mb-3 sm:mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className={`w-full p-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 transition bg-white text-sm sm:text-base font-medium ${
                errors.email 
                  ? "border-red-400 focus:border-red-500 bg-red-50/30" 
                  : "border-gray-300 focus:border-blue-500"
              }`}
              placeholder="Your Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center gap-2 text-red-700 font-mono text-sm font-medium">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="leading-tight">{errors.email.message}</span>
                </div>
              </div>
            )}
          </div>
          <div className="mb-4 sm:mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              className={`w-full p-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 transition bg-white text-sm sm:text-base resize-none font-medium ${
                errors.message 
                  ? "border-red-400 focus:border-red-500 bg-red-50/30" 
                  : "border-gray-300 focus:border-blue-500"
              }`}
              rows="3"
              placeholder="Your Message"
              {...register("message", {
                required: "Message is required",
                minLength: {
                  value: 10,
                  message: "Message must be at least 10 characters",
                },
              })}
            ></textarea>
            {errors.message && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center gap-2 text-red-700 font-mono text-sm font-medium">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="leading-tight">{errors.message.message}</span>
                </div>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transition-all text-base sm:text-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 sm:w-5 sm:h-5" /> Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
