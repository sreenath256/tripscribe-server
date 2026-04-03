const Stay = require('../../models/stayModel');


// Get Stay By ID
exports.getStayById = async (req, res) => {
    try {
        const stay = await Stay.findById(req.params.id);
        res.status(200).json(stay);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get All Stays (Admin)
exports.getAllStays = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            state,
            district,
            propertyType,
            minPrice,
            maxPrice
        } = req.query;

        const query = {};

        // 1. Search by propertyName or location
        if (search) {
            query.$or = [
                { propertyName: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { district: { $regex: search, $options: 'i' } },
                { state: { $regex: search, $options: 'i' } },
                { propertyType: { $regex: search, $options: 'i' } }
            ];
        }

        // 2. Exact match filters
        if (state) query.state = { $regex: new RegExp(`^${state}$`, 'i') };
        if (district) query.district = { $regex: new RegExp(`^${district}$`, 'i') };
        if (propertyType) query.propertyType = { $regex: new RegExp(`^${propertyType}$`, 'i') };

        // 3. Price Filters (using sellingPrice)
        if (minPrice || maxPrice) {
            query.sellingPrice = {};
            if (minPrice) query.sellingPrice.$gte = Number(minPrice);
            if (maxPrice) query.sellingPrice.$lte = Number(maxPrice);
        }

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;

        const total = await Stay.countDocuments(query);

        const stays = await Stay.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        res.status(200).json({
            stays,
            pagination: {
                totalItems:total,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(total / limitNumber)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create Stay (Admin)
exports.createStay = async (req, res) => {
    try {
        console.log("=== TEXT DATA (req.body) ===", req.body);
        console.log("=== FILE DATA (req.files) ===", req.files);

        // 1. Parse the stringified amenities back into an array/object
        let parsedAmenities = [];
        if (req.body.amenities) {
            try {
                parsedAmenities = JSON.parse(req.body.amenities);
            } catch (e) {
                console.error("Could not parse amenities:", e);
            }
        }

        // 2. Separate the main image and gallery images from the req.files array
        let mainImageUrl = '';
        let galleryImageUrls = [];

        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                // multer-s3 usually puts the uploaded URL in file.location.
                // *NOTE: If Cloudflare R2 doesn't return a usable public URL in file.location, 
                // you will need to construct it using your public R2 domain + file.key
                // Example: const fileUrl = `https://pub-your-id.r2.dev/${file.key}`;
                // const fileUrl = file.location; 

                const fileUrl = `${process.env.R2_PUBLIC_ENDPOINT}/${file.key}`;
                if (file.fieldname === 'mainImage') {
                    mainImageUrl = fileUrl;
                } else if (file.fieldname === 'galleryImages') {
                    galleryImageUrls.push(fileUrl);
                }
            });
        }

        // 3. Construct the final object for the database
        const stayData = {
            ...req.body,
            amenities: parsedAmenities,
            mainImage: mainImageUrl,
            galleryImages: galleryImageUrls
        };

        // 4. Save to database
        const newStay = new Stay(stayData);
        const savedStay = await newStay.save();
        res.status(201).json(savedStay);

    } catch (error) {
        console.error("Error creating stay:", error);
        res.status(400).json({ message: error.message });
    }
};

// Update Stay (Admin)
exports.updateStay = async (req, res) => {
    try {
        console.log("Incoming Update Body:", req.body);

        // 1. Create a copy of the body so we can safely modify it
        let updateData = { ...req.body };

        // 2. Parse the amenities string back into an array
        if (updateData.amenities) {
            try {
                // If it's a stringified array, parse it
                if (typeof updateData.amenities === 'string') {
                    updateData.amenities = JSON.parse(updateData.amenities);
                } 
                // Edge case: Sometimes FormData + Multer wraps it in an array early
                else if (Array.isArray(updateData.amenities) && typeof updateData.amenities[0] === 'string') {
                    updateData.amenities = JSON.parse(updateData.amenities[0]);
                }
            } catch (e) {
                console.error("Could not parse amenities during update:", e);
            }
        }
        // 3. Handle image updates
        let mainImageUrl = updateData.mainImage || '';
        let finalGalleryImages = [];

        // Parse existing gallery images from body (links to keep)
        if (updateData.galleryImages) {
            let galleryData = updateData.galleryImages;
            if (typeof galleryData === 'string') {
                try {
                    const parsed = JSON.parse(galleryData);
                    if (Array.isArray(parsed)) {
                        finalGalleryImages.push(...parsed);
                    } else {
                        finalGalleryImages.push(galleryData);
                    }
                } catch (e) {
                    finalGalleryImages.push(galleryData);
                }
            } else if (Array.isArray(galleryData)) {
                galleryData.forEach(item => {
                    if (typeof item === 'string') {
                        try {
                            const parsed = JSON.parse(item);
                            if (Array.isArray(parsed)) {
                                finalGalleryImages.push(...parsed);
                            } else {
                                finalGalleryImages.push(item);
                            }
                        } catch (e) {
                            finalGalleryImages.push(item);
                        }
                    }
                });
            }
        }

        // Process new files
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                const fileUrl = `${process.env.R2_PUBLIC_ENDPOINT}/${file.key}`;
                if (file.fieldname === 'mainImage') {
                    mainImageUrl = fileUrl; // Overrides existing link if a new file is uploaded
                } else if (file.fieldname === 'galleryImages') {
                    finalGalleryImages.push(fileUrl);
                }
            });
        }

        updateData.mainImage = mainImageUrl;
        updateData.galleryImages = finalGalleryImages;

        // 4. Update the document with the parsed data
        const updatedStay = await Stay.findByIdAndUpdate(
            req.params.id,
            updateData, // Use the modified object, not the raw req.body
            { new: true, runValidators: true }
        );

        if (!updatedStay) return res.status(404).json({ message: "Stay not found" });
        
        res.status(200).json(updatedStay);
    } catch (error) {
        console.error("Update Error:", error);
        res.status(400).json({ message: error.message });
    }
};

// Delete Stay (Admin)
exports.deleteStay = async (req, res) => {
    try {
        const deletedStay = await Stay.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        if (!deletedStay) return res.status(404).json({ message: "Stay not found" });
        res.status(200).json({ message: "Stay marked as inactive successfully", stay: deletedStay });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
