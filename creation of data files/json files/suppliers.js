import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';

const COUNT = 200;
const outDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const catalog = {
  electronics: [
    { item: 'LED Monitor 24"', priceRange: [90, 250] },
    { item: 'Wireless Keyboard', priceRange: [20, 80] },
    { item: 'USB-C Docking Station', priceRange: [60, 220] },
    { item: 'External SSD 1TB', priceRange: [80, 180] },
  ],
  office: [
    { item: 'Copy Paper A4 (ream)', priceRange: [3, 8] },
    { item: 'Stapler', priceRange: [5, 25] },
    { item: 'Office Chair', priceRange: [60, 350] },
    { item: 'Desk Lamp', priceRange: [15, 75] },
  ],
  food: [
    { item: 'Olive Oil (1L)', priceRange: [6, 25] },
    { item: 'Coffee Beans (1kg)', priceRange: [8, 40] },
    { item: 'Canned Tuna (pack)', priceRange: [4, 15] },
    { item: 'Sugar (5kg)', priceRange: [5, 20] },
  ],
  'raw-materials': [
    { item: 'Steel Rod (meter)', priceRange: [10, 60] },
    { item: 'Timber Plank (piece)', priceRange: [5, 45] },
    { item: 'Cement Bag (50kg)', priceRange: [4, 15] },
  ],
  services: [
    { item: 'Equipment Maintenance (hour)', priceRange: [30, 150] },
    { item: 'Consulting (hour)', priceRange: [50, 300] },
  ],
  it: [
    { item: 'Cloud Hosting (month)', priceRange: [20, 1000] },
    { item: 'Managed Backup (month)', priceRange: [10, 200] },
    { item: 'Antivirus License (seat/year)', priceRange: [5, 50] },
  ],
  construction: [
    { item: 'Concrete Mixer Rental (day)', priceRange: [50, 400] },
    { item: 'Rebar (ton)', priceRange: [200, 800] },
  ],
};

const categories = Object.keys(catalog);

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randPrice([min, max]) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

function makeSupplier(i) {
  const supplierName = faker.company.name();
  const contactName = faker.person.fullName();
  // choose 1-3 categories for this supplier (shared pool ensures overlap)
  const chosenCategories = faker.helpers.arrayElements(categories, randInt(1, 3));

  // for each chosen category, pick 1-5 items from that category
  const supplies = chosenCategories.flatMap((cat) => {
    const items = faker.helpers.arrayElements(catalog[cat], randInt(1, 5));
    return items.map((it) => ({
      category: cat,
      item: it.item,
      quantity: randInt(5, 2000),
      price: randPrice(it.priceRange),
    }));
  });

  return {
    id: `SUP-${String(i).padStart(4, '0')}`,
    name: supplierName,
    contact: {
      name: contactName,
      email: faker.internet.email(contactName.split(' ')[0], contactName.split(' ').slice(-1)[0]),
      phone: faker.phone.number(),
    },
    address: {
      line1: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      postalCode: faker.location.zipCode(),
      country: faker.location.country(),
    },
    taxId: faker.string.alphanumeric(10).toUpperCase(),
    website: faker.internet.url(),
    supplies,
    rating: Number((Math.random() * 5).toFixed(1)),
    active: Math.random() > 0.1,
    createdAt: faker.date.past({ years: 5 }).toISOString(),
    notes: faker.company.buzzPhrase(),
  };
}

const suppliers = Array.from({ length: COUNT }, (_, i) => makeSupplier(i + 1));
fs.writeFileSync(path.join(outDir, 'suppliers.json'), JSON.stringify(suppliers, null, 2), 'utf8');
console.log(`Wrote ${suppliers.length} suppliers to ${path.join(outDir, 'suppliers.json')}`);