const User = require('./models/User');
const AboutUs = require('./models/AboutUs');
const FAQ = require('./models/FAQ');
const MissionVision = require('./models/MissionVision');
const Service = require('./models/Service');
const HeroContent = require('./models/HeroContent');
const Partner = require('./models/Partner');
const TeamSection = require('./models/TeamSection');
const TeamMember = require('./models/TeamMember');
const NewsArticle = require('./models/NewsArticle');
const WhyJoinUs = require('./models/WhyJoinUs');
const WhyBecomeMember = require('./models/WhyBecomeMember');

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

  socialMedia: {
    facebook: {
      href: null,
      visible: true,
    },
    instagram: {
      href: "https://www.instagram.com/rska_ssociates",
      visible: true,
    },
    whatsapp: {
      href: null,
      visible: true,
    },
    x: {
      href: null,
      visible: true,
    },
    linkedin: {
      href: "https://www.linkedin.com/company/rsk-associates-ltd/about/",
      visible: true,
    },
    youtube: {
      href: null,
      visible: true,
    },
  },
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
  },
  {
    name: "MTN Rwanda",
  },
  {
    name: "Umujyi wa Kigali",
  },
  {
    name: "Airtel Rwanda",
  },
  {
    name: "Sensitive",
  },
];

const DEFAULT_HERO = {
  title: 'Welcome to RSK Associates',
  subtitle: 'Professional Audit, Tax Advisory, and Financial Consulting Services',
  trust: 'Trusted by 500+ businesses worldwide',
  subtitleVisible: true,
  trustVisible: true,
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

const DEFAULT_NEWS = [
  {
    title: "RSK Associates Expands Tax Advisory Services",
    slug: "rsk-associates-expands-tax-advisory-services",
    excerpt: "We are pleased to announce the expansion of our tax advisory services to include international tax planning for businesses operating across borders.",
    content: "RSK Associates is excited to announce the expansion of our tax advisory services. Our new international tax planning division will help businesses navigate cross-border tax regulations and optimize their global tax positions. This expansion reflects our commitment to providing comprehensive financial solutions to our clients.",
    coverImage: null,
    category: "Finance",
    author: {
      name: "RSK Admin",
      role: "Administrator",
      avatar: null,
    },
    status: "published",
    featured: true,
    readingTime: 3,
    publishedAt: new Date('2024-01-15'),
  },
  {
    title: "New Business Management Consulting Package Launched",
    slug: "new-business-management-consulting-package-launched",
    excerpt: "Introducing our new comprehensive business management consulting package designed for SMEs looking to streamline operations and drive growth.",
    content: "Our new business management consulting package combines strategic planning, operational efficiency analysis, and performance monitoring to help SMEs achieve sustainable growth. The package includes monthly advisory sessions, custom dashboards, and actionable recommendations.",
    coverImage: null,
    category: "Business",
    author: {
      name: "RSK Admin",
      role: "Administrator",
      avatar: null,
    },
    status: "published",
    featured: false,
    readingTime: 4,
    publishedAt: new Date('2024-02-20'),
  },
  {
    title: "RSK Associates Partners with Local Financial Institutions",
    slug: "rsk-associates-partners-with-local-financial-institutions",
    excerpt: "We have formed strategic partnerships with leading local financial institutions to provide our clients with better access to funding and financial products.",
    content: "RSK Associates has signed memoranda of understanding with three leading local financial institutions. These partnerships will enable our clients to access preferential financing terms, specialized financial products, and streamlined loan application processes.",
    coverImage: null,
    category: "Business",
    author: {
      name: "RSK Admin",
      role: "Administrator",
      avatar: null,
    },
    status: "published",
    featured: false,
    readingTime: 2,
    publishedAt: new Date('2024-03-10'),
  },
];

const DEFAULT_WHY_JOIN_US = {
  title: 'Why Join RSK',
  description:
    'Join a premium corporate community designed for growth. Move faster with trusted partners, business support, and member-only opportunities for teams and leaders.',
  points: [
    {
      title: 'Trusted corporate network',
      description:
        'Connect with established businesses, decision-makers, and strategic partners across industries.',
      image: null,
      imagePublicId: null,
    },
    {
      title: 'Business-ready solutions',
      description:
        'Access practical advisory services, tailored training, and funding guidance designed for growth.',
      image: null,
      imagePublicId: null,
    },
    {
      title: 'Strategic credibility',
      description:
        'Boost your company profile through a respected membership that opens doors and builds trust.',
      image: null,
      imagePublicId: null,
    },
    {
      title: 'Global opportunity pipeline',
      description:
        'Receive curated tender alerts, internship matches, and training opportunities for your team.',
      image: null,
      imagePublicId: null,
    },
  ],
};

const DEFAULT_WHY_BECOME_MEMBER = {
  title: 'Become a member.',
  description: 'Member benefits designed for modern businesses.',
  points: [
    {
      title: 'Networking',
      description:
        'Build lasting business relationships with senior decision makers.',
      visible: true,
      image: null,
      imagePublicId: null,
    },
    {
      title: 'Training',
      description:
        'Exclusive workshops and executive learning sessions for members.',
      visible: true,
      image: null,
      imagePublicId: null,
    },
    {
      title: 'Business Support',
      description:
        'Access advisory guidance and operational support when you need it most.',
      visible: true,
      image: null,
      imagePublicId: null,
    },
    {
      title: 'Funding Opportunities',
      description:
        'Be first to know about grants, tenders, and capital introductions.',
      visible: true,
      image: null,
      imagePublicId: null,
    },
    {
      title: 'Certifications',
      description:
        'Gain credibility through member-focused professional certifications.',
      visible: true,
      image: null,
      imagePublicId: null,
    },
    {
      title: 'Mentorship',
      description:
        'Receive one-to-one mentorship from industry leaders and advisors.',
      visible: true,
      image: null,
      imagePublicId: null,
    },
  ],
};

const DEFAULT_TEAM_SECTIONS = [
  {
    name: "Board of Directors",
    order: 1,
  },
  {
    name: "Accountants",
    order: 2,
  },
  {
    name: "Tax Consultants",
    order: 3,
  },
];

const seedData = async () => {
  try {
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

    // Seed a default team member for news author references
    const defaultAuthor = await TeamMember.findOne({ name: 'RSK Admin' });
    if (!defaultAuthor) {
      DEFAULT_NEWS.forEach((news) => {
        news.author._id = createdAuthor._id;
      });
    } else {
      console.log('Default team member already exists');
      // Update news seed data with existing author ID
      DEFAULT_NEWS.forEach((news) => {
        news.author._id = defaultAuthor._id;
      });
    }

    const newsExists = await NewsArticle.findOne();
    if (!newsExists) {
      await NewsArticle.insertMany(DEFAULT_NEWS);
      console.log('Default news data created successfully');
    } else {
      console.log('News data already exists');
    }

    const whyJoinUsExists = await WhyJoinUs.findOne();
    if (!whyJoinUsExists) {
      await WhyJoinUs.create(DEFAULT_WHY_JOIN_US);
      console.log('Default Why Join Us data created successfully');
    } else {
      console.log('Why Join Us data already exists');
    }

    const whyBecomeMemberExists = await WhyBecomeMember.findOne();
    if (!whyBecomeMemberExists) {
      await WhyBecomeMember.create(DEFAULT_WHY_BECOME_MEMBER);
      console.log('Default Why Become Member data created successfully');
    } else {
      console.log('Why Become Member data already exists');
    }

    for (const sectionData of DEFAULT_TEAM_SECTIONS) {
      const sectionExists = await TeamSection.findOne({ name: sectionData.name });
      if (!sectionExists) {
        await TeamSection.create(sectionData);
        console.log(`Default team section "${sectionData.name}" created successfully`);
      } else {
        console.log(`Team section "${sectionData.name}" already exists`);
      }
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
