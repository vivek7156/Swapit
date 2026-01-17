import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Camera, ShieldCheck, Search, Menu, X, MessageCircle, MapPin, CheckCircle, Plus, Minus } from "lucide-react";
import logo from "../../assets/logo.png";
import illustrationLeft from "../../assets/illustration-left.png";
import illustrationRight from "../../assets/illustration-right.png";
import { motion } from "framer-motion";

function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-green-500/30 selection:text-green-200">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="SwapIt Logo" className="size-8 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold tracking-tight">SwapIt</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</a>
            <a href="#categories" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Categories</a>
            <a href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Community</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:text-white text-zinc-300 transition-colors">
              Log in
            </Link>
            <Link
              to="/signup"
              className="h-10 px-5 rounded-full bg-white text-black text-sm font-semibold flex items-center hover:bg-zinc-200 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-20 left-0 right-0 bg-[#0a0a0a] border-b border-white/10 p-6 flex flex-col gap-4 md:hidden animate-in slide-in-from-top-5">
            <a href="#features" className="text-lg font-medium text-zinc-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#categories" className="text-lg font-medium text-zinc-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Categories</a>
            <div className="h-px bg-white/10 my-2" />
            <Link to="/login" className="text-lg font-medium text-white" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
            <Link to="/signup" className="h-12 rounded-lg bg-green-500 flex items-center justify-center text-black font-bold" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-64 md:pb-32 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-green-500/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

        {/* Hero Illustrations (Desktop) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 0.9, x: 0, y: [0, -20, 0] }}
          transition={{
            opacity: { duration: 1 },
            x: { duration: 1 },
            y: { repeat: Infinity, duration: 5, ease: "easeInOut" }
          }}
          className="hidden lg:block absolute top-1/2 -translate-y-1/2 left-0 w-[250px] xl:w-[300px]"
        >
          <img src={illustrationLeft} alt="Student browsing" className="w-full h-auto object-contain drop-shadow-2xl" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 0.9, x: 0, y: [0, -25, 0] }}
          transition={{
            opacity: { duration: 1 },
            x: { duration: 1 },
            y: { repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }
          }}
          className="hidden lg:block absolute top-1/2 -translate-y-1/2 right-0 w-[300px] xl:w-[350px]"
        >
          <img src={illustrationRight} alt="Student success" className="w-full h-auto object-contain drop-shadow-2xl" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto text-center flex flex-col items-center relative z-10"
        >

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Buy, Sell, and Trade <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
              Campus Wide.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            SwapIt is the safest, easiest, and fastest way to trade textbooks, electronics, and dorm essentials with students on your campus.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Link to="/signup">
              <button className="h-12 px-8 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group">
                Start Trading
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <button className="h-12 px-8 rounded-full bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all">
              Explore Listings
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 md:px-0">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why choose SwapIt?</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">Everything you need to buy and sell safely on campus.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 px-4">
            {[
              {
                icon: <ShieldCheck className="size-8 text-green-400" />,
                title: "Verified Students",
                desc: "Every user is verified with their .edu email address. Know exactly who you're dealing with."
              },
              {
                icon: <Camera className="size-8 text-purple-400" />,
                title: "Snap & List",
                desc: "List an item in under 30 seconds. Just take a photo, add a price, and you're done."
              },
              {
                icon: <Search className="size-8 text-blue-400" />,
                title: "Smart Search",
                desc: "Find exactly what you need for your specific classes and dorm requirements."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-green-500/30 transition-colors group"
              >
                <div className="h-14 w-14 rounded-xl bg-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-zinc-100">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How it works</h2>
            <p className="text-zinc-400">Simple, safe, and social trading in 4 steps.</p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[20%] left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-zinc-800 -z-10" />

            {[
              {
                step: "01",
                title: "List it",
                desc: "Snap a photo, set a price, and post your item in seconds.",
                icon: <Camera className="size-6 text-white" />,
                gradient: "from-orange-400 to-pink-500"
              },
              {
                step: "02",
                title: "Chat",
                desc: "Connect instantly with verified students on your campus.",
                icon: <MessageCircle className="size-6 text-white" />,
                gradient: "from-blue-400 to-indigo-500"
              },
              {
                step: "03",
                title: "Meet up",
                desc: "Agree on a safe meeting spot on campus to make the swap.",
                icon: <MapPin className="size-6 text-white" />,
                gradient: "from-green-400 to-emerald-500"
              },
              {
                step: "04",
                title: "Done",
                desc: "Hand over the item and get paid. Review your experience.",
                icon: <CheckCircle className="size-6 text-white" />,
                gradient: "from-purple-400 to-violet-500"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg shadow-white/5 mb-6 hover:scale-110 transition-transform duration-300 relative`}>
                  <div className="absolute -bottom-3 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-400">
                    Step {item.step}
                  </div>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-[200px]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section id="categories" className="py-24 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Popular Categories</h2>
              <p className="text-zinc-400">Find what you're looking for.</p>
            </div>
            <a href="#" className="hidden md:flex items-center gap-2 text-green-400 hover:text-green-300 font-medium transition-colors">
              View all <ArrowRight className="size-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Textbooks", img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600" },
              { name: "Electronics", img: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=600" },
              { name: "Furniture", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600" },
              { name: "Clothing", img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=600" }
            ].map((cat, i) => (
              <div key={i} className="group relative aspect-[4/5] overflow-hidden rounded-2xl cursor-pointer">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-xl font-bold text-white">{cat.name}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <a href="#" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-medium transition-colors">
              View all <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <motion.section
        id="faq"
        className="py-24 bg-[#0a0a0a]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-zinc-400">Everything you need to know about SwapIt.</p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "Is SwapIt free to use?",
                a: "Yes! Creating an account, listing items, and browsing is completely free. We don't charge any listing fees."
              },
              {
                q: "How do verify that users are students?",
                a: "We require a valid .edu email address to sign up. This ensures that everyone on the platform is a verified student at your university."
              },
              {
                q: "How do I pay for items?",
                a: "Currently, SwapIt facilitates the connection. Payments are handled offline between students (Cash, Venmo, Zelle) when you meet up to exchange the item."
              },
              {
                q: "Is it safe to meet up?",
                a: "We recommend meeting in public places on campus, such as the library, student center, or coffee shops. Check our safety guidelines for more tips."
              },
              {
                q: "Can I trade items instead of selling?",
                a: "Absolutely! You can mark your listing as 'Open to Trade' and swap textbooks, electronics, or other gear directly."
              }
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border border-white/5 rounded-2xl bg-zinc-900/30 overflow-hidden transition-colors duration-300 hover:border-white/10"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-lg font-medium text-zinc-100">{faq.q}</span>
                  {openFaqIndex === i ? (
                    <Minus className="size-5 text-green-400 flex-shrink-0" />
                  ) : (
                    <Plus className="size-5 text-zinc-500 flex-shrink-0" />
                  )}
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${openFaqIndex === i ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"
                    }`}
                >
                  <div className="overflow-hidden px-6">
                    <p className="text-zinc-400 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-green-500 to-emerald-700 p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="relative text-3xl md:text-5xl font-bold text-white mb-6">Ready to start swapping?</h2>
          <p className="relative text-green-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Join thousands of students trading on SwapIt today. It's free to join and takes less than a minute.
          </p>
          <div className="relative flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup" className="h-14 px-8 rounded-full bg-white text-green-600 font-bold hover:bg-zinc-100 transition-colors flex items-center justify-center">
              Create Free Account
            </Link>
            <Link to="/login" className="h-14 px-8 rounded-full bg-green-700 text-white font-bold hover:bg-green-800 transition-colors flex items-center justify-center">
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="SwapIt Logo" className="size-6" />
              <span className="text-lg font-bold text-white">SwapIt</span>
            </Link>
            <p className="text-zinc-500 text-sm">
              The student marketplace. Designed for safety, speed, and campus life.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><a href="#" className="hover:text-green-400">About</a></li>
              <li><a href="#" className="hover:text-green-400">Careers</a></li>
              <li><a href="#" className="hover:text-green-400">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><a href="#" className="hover:text-green-400">Help Center</a></li>
              <li><a href="#" className="hover:text-green-400">Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-green-400">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><a href="#" className="hover:text-green-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-green-400">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center text-sm text-zinc-600">
          &copy; {new Date().getFullYear()} SwapIt Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
