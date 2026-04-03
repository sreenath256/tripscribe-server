require('dotenv').config();
const mongoose = require('mongoose');
const Stay = require('./models/stayModel');

// Reusable mock data arrays
const districts = [
    "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam", 
    "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram", "Kozhikode", 
    "Wayanad", "Kannur", "Kasaragod"
];

const locations = [
    "Varkala", "Fort Kochi", "Munnar", "Thekkady", "Kumarakom", 
    "Alleppey Backwaters", "Kalpetta", "Kovalam", "Vagamon", "Marari Beach", 
    "Bekal", "Thrissur City", "Athirappilly", "Guruvayur", "Kozhikode Beach"
];

const propertyTypes = ["Resort", "Hotel", "Homestay", "Villa", "Cabin", "Houseboat", "Guesthouse", "Hostel"];

const allAmenities = [
    "Free WiFi", "Swimming Pool", "Restaurant", "Room Service", 
    "Spa", "Gym", "Parking", "Air Conditioning", "Breakfast Included", 
    "Bar", "Beach Access", "Mountain View", "Pet Friendly", "Kitchen"
];

const images = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1542314831-c6a4d14d8c53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89402bb15bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1596436889106-be35e843f6a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
];

const adjectives = ["Grand", "Royal", "Serene", "Emerald", "Lush", "Tranquil", "Misty", "Golden", "Heritage", "Cozy", "Classic"];

// Helper to get random array item
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate random number between min and max
const getNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const stays = [];

for (let i = 1; i <= 50; i++) {
    const propertyType = getRandom(propertyTypes);
    const location = getRandom(locations);
    const district = getRandom(districts);
    const adj = getRandom(adjectives);
    
    // Pick 3-6 random amenities
    const numAmenities = getNum(3, 6);
    const propertyAmenities = [];
    const shuffledAmenities = [...allAmenities].sort(() => 0.5 - Math.random());
    for(let j=0; j<numAmenities; j++) {
        propertyAmenities.push(shuffledAmenities[j]);
    }

    const priceBase = getNum(1000, 6000);
    const profitMargin = getNum(500, 3000);

    stays.push({
        propertyName: `${adj} ${location} ${propertyType} ${i}`,
        propertyPhone: `+91 9${getNum(100000000, 999999999)}`,
        propertyEmail: `contact${i}@${location.toLowerCase().replace(' ', '')}stays.com`,
        maxGuests: getNum(2, 10),
        purchasePrice: priceBase,
        sellingPrice: priceBase + profitMargin,
        state: "Kerala",
        district: district,
        location: location,
        propertyType: propertyType,
        propertyDescription: `A wonderful and newly refined ${propertyType.toLowerCase()} nestled in beautiful ${location}. Experience luxury and local culture. Automatically generated detailed property mock data.`,
        mainImage: getRandom(images),
        galleryImages: [
            getRandom(images),
            getRandom(images)
        ],
        amenities: propertyAmenities,
        googleMapsLink: `https://goo.gl/maps/mock${i}`
    });
}

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("Connected to MongoDB. Seeding 50 stays...");
        try {
            await Stay.insertMany(stays);
            console.log("50 Stays seeded successfully!");
        } catch (err) {
            console.error("Error seeding stays:", err);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => {
        console.error("Error connecting to MongoDB", err);
    });
