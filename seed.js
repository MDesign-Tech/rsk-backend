require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const AboutUs = require('./models/AboutUs');
const FAQ = require('./models/FAQ');
const MissionVision = require('./models/MissionVision');
const Service = require('./models/Service');
const HeroContent = require('./models/HeroContent');
const Partner = require('./models/Partner');

const DEFAULT_ABOUT = {
  title: "About RSK Associates",

  description:
    "At RSK Associates, we are more than accountants; we are trusted partners on the path to financial success.",

  stats: [
    {
      number: "500+",
      label: "Clients",
    },
    {
      number: "50+",
      label: "Experts",
    },
    {
      number: "15+",
      label: "Years Experience",
    },
  ],

  contactMethods: [
    {
      label: "Email",
      value: "rskassociatescpa@gmail.com",
      href: null,
    },

    {
      label: "Phone",
      value: "+250 788 492 529",
      href: null,
    },

    {
      label: "Location",
      value: "KIMIRONKO, KG 11 Ave, Kigali",
      href: "https://www.google.com/maps/dir//KG+11+Ave,+Kigali",
    },
  ],
};

const DEFAULT_FAQS = [
  {
    question: "What services does RSK Associates provide?",
    answer:
      "We provide auditing, tax advisory, financial consulting, business management consulting, compliance services, and financial product development tailored to businesses and individuals.",
  },
  {
    question: "Who can benefit from RSK Associates' services?",
    answer:
      "Our services are designed for startups, SMEs, large corporations, NGOs, government institutions, and individual clients seeking expert financial and business advisory services.",
  },
  {
    question: "How can RSK Associates help my business stay compliant?",
    answer:
      "We assess your business operations, review policies, identify compliance gaps, and help ensure you meet applicable regulatory and financial reporting requirements.",
  },
  {
    question: "Why should I hire an external auditor?",
    answer:
      "An independent audit improves the credibility of your financial statements, identifies operational risks, strengthens internal controls, and helps build trust with investors, lenders, and regulators.",
  },
  {
    question: "Do you provide tax planning and advisory services?",
    answer:
      "Yes. We assist businesses and individuals with tax planning, tax compliance, filing support, and strategies to optimize tax obligations while complying with Rwandan tax laws.",
  },
];

const DEFAULT_MISSION_VISION = {
  missionTitle: "Our Mission",
  missionDescription:
    "To empower businesses with comprehensive financial expertise and strategic guidance, enabling them to make informed decisions, optimize their operations, and achieve sustainable growth. We are committed to delivering exceptional service with integrity, professionalism, and a deep understanding of our clients' unique challenges and opportunities.",

  visionTitle: "Our Vision",
  visionDescription:
    "To be the trusted partner of choice for businesses seeking financial excellence and strategic transformation. We envision a future where our clients thrive in a dynamic marketplace, supported by our innovative solutions, forward-thinking approach, and unwavering commitment to their success and growth.",
};

const DEFAULT_PARTNERS = [
  {
    name: "Bank of Kigali",
    text: "BK",
  },
  {
    name: "MTN Rwanda",
    text: "MTN",
  },
  {
    name: "Umujyi wa Kigali",
    text: "UMUGI WA KIGALI",
  },
  {
    name: "Airtel Rwanda",
    text: "Airtel",
  },
  {
    name: "Sensitive",
    text: "Sensitive",
  },
];

const DEFAULT_HERO = {
  title: 'Welcome to RSK Associates',
  subtitle: 'Professional Audit, Tax Advisory, and Financial Consulting Services',
  trust: 'Trusted by 500+ businesses worldwide',
};

const DEFAULT_SERVICES = [
  {
    title: "Audit",
    description:
      "Comprehensive audit services ensuring financial accuracy, transparency, and regulatory compliance for your organization.",
  },
  {
    title: "Tax Advisory",
    description:
      "Strategic tax planning and optimization to minimize your tax burden while maximizing financial efficiency.",
  },
  {
    title: "Financial Consulting",
    description:
      "Expert financial guidance to improve profitability, cash flow management, and long-term financial planning.",
  },
  {
    title: "Business Management",
    description:
      "Comprehensive business management solutions to streamline operations and drive sustainable growth.",
  },
  {
    title: "Compliance & Financial Product Development",
    description:
      "Develop compliant financial products and ensure regulatory adherence across all business operations.",
  },
  {
    title: "Supporting Business Growth",
    description:
      "Strategic initiatives and support to accelerate your business growth and achieve your objectives.",
  },
];

const seedData = async () => {
  try {
    await connectDB();

    const adminExists = await User.findOne({ email: 'admin@rskassociates.com' });

    if (adminExists) {
      console.log('Admin user already exists');
    } else {
      await User.create({
        name: 'Admin User',
        email: 'admin@rskassociates.com',
        password: 'Admin123!',
        role: 'admin',
      });

      console.log('Default admin user created successfully');
      console.log('Email: admin@rskassociates.com');
      console.log('Password: Admin123!');
    }

    const aboutExists = await AboutUs.findOne();
    if (!aboutExists) {
      await AboutUs.create(DEFAULT_ABOUT);
      console.log('Default about data created successfully');
    } else {
      console.log('About data already exists');
    }

    const faqExists = await FAQ.findOne();
    if (!faqExists) {
      await FAQ.insertMany(DEFAULT_FAQS);
      console.log('Default FAQ data created successfully');
    } else {
      console.log('FAQ data already exists');
    }

    const missionVisionExists = await MissionVision.findOne();
    if (!missionVisionExists) {
      await MissionVision.create(DEFAULT_MISSION_VISION);
      console.log('Default mission & vision data created successfully');
    } else {
      console.log('Mission & Vision data already exists');
    }

    const serviceExists = await Service.findOne();
    if (!serviceExists) {
      await Service.insertMany(DEFAULT_SERVICES);
      console.log('Default service data created successfully');
    } else {
      console.log('Service data already exists');
    }

    const heroExists = await HeroContent.findOne();
    if (!heroExists) {
      await HeroContent.create(DEFAULT_HERO);
      console.log('Default hero data created successfully');
    } else {
      console.log('Hero data already exists');
    }

    const partnerExists = await Partner.findOne();
    if (!partnerExists) {
      await Partner.insertMany(DEFAULT_PARTNERS);
      console.log('Default partner data created successfully');
    } else {
      console.log('Partner data already exists');
    }

    console.log('All seeds completed successfully');
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    throw error;
  }
};

// Run seeds if this file is executed directly
if (require.main === module) {
  seedData()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedData;
