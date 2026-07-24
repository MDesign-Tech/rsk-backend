const User = require('./models/User');
const AboutUs = require('./models/AboutUs');
const FAQ = require('./models/FAQ');
const MissionVision = require('./models/MissionVision');
const Service = require('./models/Service');
const HeroContent = require('./models/HeroContent');
const Partner = require('./models/Partner');
const TeamSection = require('./models/TeamSection');
const TeamMember = require('./models/TeamMember');
const News = require('./models/News');
const Category = require('./models/Category');
const WhyJoinUs = require('./models/WhyJoinUs');
const WhyBecomeMember = require('./models/WhyBecomeMember');
const OpportunityType = require('./models/OpportunityType');
const Opportunity = require('./models/Opportunity');

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
    tiktok: {
      href: null,
      visible: true,
    },
    snapchat: {
      href: null,
      visible: true,
    },
  },

  ourStory: {
    title: "Our Story",
    description:
      "RSK Associates was founded with a vision to empower businesses through expert financial guidance. From humble beginnings, we have grown into a trusted corporate advisory collective, helping organizations navigate complex financial landscapes with confidence and integrity.",
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
    content: "RSK Associates is excited to announce the expansion of our tax advisory services. Our new international tax planning division will help businesses navigate cross-border tax regulations and optimize their global tax positions. This expansion reflects our commitment to providing comprehensive financial solutions to our clients.",
    coverImage: null,
    category: null,
    author: {
      name: "RSK associates",
      role: "Adminr",
      avatar: null,
    },
    status: "published",
    publishedAt: new Date('2024-01-15'),
  },
  {
    title: "New Business Management Consulting Package Launched",
    slug: "new-business-management-consulting-package-launched",
    content: "Our new business management consulting package combines strategic planning, operational efficiency analysis, and performance monitoring to help SMEs achieve sustainable growth. The package includes monthly advisory sessions, custom dashboards, and actionable recommendations.",
    coverImage: null,
    category: null,
    author: {
      name: "RSK associates",
      role: "Admin",
      avatar: null,
    },
    status: "published",
    publishedAt: new Date('2024-02-20'),
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

const DEFAULT_OPPORTUNITIES = [
  {
    title: "Supply and Installation of Solar Power Systems",
    type: "Tender",
    org: "Ministry of Infrastructure",
    description: "Supply and installation of solar power systems for public buildings across the country.",
    category: "Infrastructure",
    location: "Kigali, Rwanda",
    date: new Date('2026-07-15'),
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
    status: "Open",
    visible: true,
  },
  {
    title: "Construction of District Health Centers",
    type: "Tender",
    org: "Rwanda Biomedical Centre",
    description: "Construction of 5 district health centers in the Northern Province.",
    category: "Health",
    location: "Northern Province, Rwanda",
    date: new Date('2026-07-12'),
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    status: "Open",
    visible: true,
  },
  {
    title: "Senior Financial Analyst",
    type: "Job",
    org: "RSK Associates Ltd",
    description: "We are looking for a Senior Financial Analyst to join our growing team.",
    category: "Finance",
    location: "Kigali, Rwanda",
    date: new Date('2026-07-10'),
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
    status: "Open",
    visible: true,
  },
  {
    title: "Frontend React Developer",
    type: "Job",
    org: "Tech Rwanda",
    description: "Join our team as a Frontend React Developer to build amazing web applications.",
    category: "Technology",
    location: "Kigali, Rwanda",
    date: new Date('2026-07-08'),
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    status: "Open",
    visible: true,
  },
  {
    title: "Procurement of ICT Equipment for Public Schools",
    type: "Tender",
    org: "Ministry of Education",
    description: "Procurement of ICT equipment including computers, projectors, and networking equipment for 50 public schools.",
    category: "Education",
    location: "Kigali, Rwanda",
    date: new Date('2026-07-05'),
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    status: "Open",
    visible: true,
  },
  {
    title: "Human Resources Officer",
    type: "Job",
    org: "Bank of Kigali",
    description: "Looking for an experienced HR Officer to manage recruitment and employee relations.",
    category: "Human Resources",
    location: "Kigali, Rwanda",
    date: new Date('2026-07-03'),
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    status: "Open",
    visible: true,
  },
  {
    title: "Supply of Medical Laboratory Equipment",
    type: "Tender",
    org: "King Faisal Hospital",
    description: "Supply of advanced medical laboratory equipment for the hospital's diagnostic center.",
    category: "Health",
    location: "Kigali, Rwanda",
    date: new Date('2026-06-30'),
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    status: "Open",
    visible: true,
  },
  {
    title: "Digital Marketing Specialist",
    type: "Job",
    org: "Rwanda Convention Bureau",
    description: "Seeking a creative Digital Marketing Specialist to drive our online presence.",
    category: "Marketing",
    location: "Kigali, Rwanda",
    date: new Date('2026-06-28'),
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    status: "Open",
    visible: true,
  },
  {
    title: "Road Rehabilitation and Maintenance Works",
    type: "Tender",
    org: "Rwanda Transport Development Agency",
    description: "Rehabilitation and maintenance of 50km of rural roads in the Southern Province.",
    category: "Infrastructure",
    location: "Southern Province, Rwanda",
    date: new Date('2026-06-25'),
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    status: "Open",
    visible: true,
  },
  {
    title: "Project Manager",
    type: "Job",
    org: "United Nations Development Programme",
    description: "UNDP is seeking a Project Manager for the sustainable development program.",
    category: "Development",
    location: "Kigali, Rwanda",
    date: new Date('2026-06-22'),
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    status: "Open",
    visible: true,
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

    // Seed default categories
    const defaultCategories = [
      { name: 'Finance' },
      { name: 'Business' },
      { name: 'Technology' },
      { name: 'Events' },
      { name: 'General' },
    ];
    const existingCategoryCount = await Category.countDocuments();
    if (existingCategoryCount === 0) {
      const createdCategories = await Category.insertMany(defaultCategories);
      console.log('Default categories created successfully');
      // Map category names to IDs for news seeding
      const categoryMap = {};
      createdCategories.forEach((c) => {
        categoryMap[c.name] = c._id;
      });
      DEFAULT_NEWS.forEach((news) => {
        news.category = categoryMap[news.category] || categoryMap['General'];
      });
    } else {
      console.log('Categories already exist');
      const categories = await Category.find();
      const categoryMap = {};
      categories.forEach((c) => {
        categoryMap[c.name] = c._id;
      });
      DEFAULT_NEWS.forEach((news) => {
        news.category = categoryMap[news.category] || categoryMap['General'];
      });
    }

    // Seed a default team member for news author references
    const defaultAuthor = await TeamMember.findOne({ name: 'RSK Admin' });
    if (!defaultAuthor) {
      console.log('Default team member not found, skipping news seed');
    } else {
      console.log('Default team member already exists');
      // Update news seed data with existing author ID
      DEFAULT_NEWS.forEach((news) => {
        news.author._id = defaultAuthor._id;
      });
    }

    const newsExists = await News.findOne();
    if (!newsExists) {
      await News.insertMany(DEFAULT_NEWS);
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

    // Seed opportunity types only if none exist
    const existingTypeCount = await OpportunityType.countDocuments();
    if (existingTypeCount === 0) {
      const defaultTypes = [
        { name: 'Tender' },
        { name: 'Job' },
        { name: 'Internship' },
        { name: 'Consultancy' },
        { name: 'Training' },
        { name: 'Event' },
        { name: 'RFP' },
        { name: 'RFQ' },
        { name: 'EOI' },
      ];
      await OpportunityType.insertMany(defaultTypes);
      console.log('Default opportunity types created successfully');
    } else {
      console.log('Opportunity types already exist');
    }

    // Seed opportunities only if none exist
    const opportunityExists = await Opportunity.findOne();
    if (!opportunityExists) {
      const types = await OpportunityType.find();
      const typeMap = {};
      types.forEach((t) => {
        typeMap[t.name] = t._id;
      });

      const opportunitiesToInsert = DEFAULT_OPPORTUNITIES.map((opp) => ({
        ...opp,
        type: typeMap[opp.type] || types[0]._id,
        slug: Opportunity.generateSlug(opp.title),
        publishedAt: new Date(),
      }));

      // Generate unique slugs
      for (const opp of opportunitiesToInsert) {
        opp.slug = await Opportunity.generateUniqueSlug(opp.slug);
      }

      await Opportunity.insertMany(opportunitiesToInsert);
      console.log('Default opportunity data created successfully');
    } else {
      console.log('Opportunity data already exists');
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
