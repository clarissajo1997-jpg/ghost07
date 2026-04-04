const services = [
  {
    id: 'svc-general-dentistry',
    name: 'General Dentistry',
    description: 'Routine checkups, oral exams, fillings, and preventive care.',
  },
  {
    id: 'svc-cosmetic-dentistry',
    name: 'Cosmetic Dentistry',
    description: 'Teeth whitening, veneers, and smile enhancement treatments.',
  },
  {
    id: 'svc-orthodontics',
    name: 'Orthodontics',
    description: 'Braces and clear aligner consultations for teeth alignment.',
  },
  {
    id: 'svc-pediatric-care',
    name: 'Pediatric Dental Care',
    description: 'Gentle, family-friendly oral care for children and teens.',
  },
];

const priceList = {
  heading: 'Affordable Care for Your Brightest Smile',
  section: 'General & Restorative Services',
  items: [
    { name: 'Scaling', price: 'RM120-200' },
    { name: 'Filling', price: 'RM120-200' },
    { name: 'Extraction', price: 'RM120-200' },
    { name: 'Difficult Extraction', price: 'RM250' },
    { name: 'Wisdom Tooth Surgery', price: 'RM800-1600' },
    { name: 'Root Canal Treatment', price: 'RM800-1600' },
    { name: 'Crown', price: 'RM1000-1600' },
    { name: 'Veneer', price: 'RM250++' },
    { name: 'Implant (Include Crown)', price: 'RM6000-7000' },
    { name: 'Braces', price: 'RM6000++' },
    { name: 'Whitening', price: 'RM400++' },
    { name: 'Denture', price: 'RM460++' },
    { name: 'Aligners', price: 'RM8000++' },
    { name: 'Kids Scaling', price: 'RM80-120' },
    { name: 'Kids Filling', price: 'RM80-120' },
    { name: 'Kids Extraction', price: 'RM80-120' },
    { name: 'Fluoride Treatment (Kids)', price: 'RM40++' },
    { name: 'X-Rays', price: 'RM50++' },
  ],
  cta: 'Contact Us Today!',
  contact: {
    phone: '+60163403382',
    email: 'paulineandngdental@hotmail.com',
    address: 'NO.39 JALAN USJ 1/1A REGALIA BUSINESS CENTRE 47650 SUBANG JAYA SELANGOR',
  },
};

const priceListPostText = [
  'Affordable Care for Your Brightest Smile',
  '',
  'General & Restorative Services',
  '• Scaling — RM120-200',
  '• Filling — RM120-200',
  '• Extraction — RM120-200',
  '• Difficult Extraction — RM250',
  '• Wisdom Tooth Surgery — RM800-1600',
  '• Root Canal Treatment — RM800-1600',
  '• Crown — RM1000-1600',
  '• Veneer — RM250++',
  '• Implant (Include Crown) — RM6000-7000',
  '• Braces — RM6000++',
  '• Whitening — RM400++',
  '• Denture — RM460++',
  '• Aligners — RM8000++',
  '• Kids Scaling — RM80-120',
  '• Kids Filling — RM80-120',
  '• Kids Extraction — RM80-120',
  '• Fluoride Treatment (Kids) — RM40++',
  '• X-Rays — RM50++',
  '',
  'Contact Us Today!',
  'Phone: +60163403382',
  'Email: paulineandngdental@hotmail.com',
  'Address: NO.39 JALAN USJ 1/1A REGALIA BUSINESS CENTRE 47650 SUBANG JAYA SELANGOR',
].join('\n');

const appointments = [];
const contactMessages = [];

module.exports = {
  services,
  priceList,
  priceListPostText,
  appointments,
  contactMessages,
};
