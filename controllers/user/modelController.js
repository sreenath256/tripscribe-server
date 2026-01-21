const { default: mongoose } = require("mongoose");
const Model = require("../../models/modelModel");

// Create a new model
const createModel = async (req, res) => {
    try {
        const { name, slug, modelDescription, categoryId } = req.body;





        // Generate slug if not provided
        const generatedSlug = slug || name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-'); // Remove consecutive hyphens

        // Check if slug already exists
        const existingModel = await Model.findOne({ slug: generatedSlug });

        if (existingModel) {
            return res.status(400).json({ message: "A model with this name already exists" });
        }

        // Check if files exist in the request
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "At least one image is required" });
        }

        // Group files by fieldname
        const filesByFieldname = {};
        req.files.forEach(file => {
            if (!filesByFieldname[file.fieldname]) {
                filesByFieldname[file.fieldname] = [];
            }
            filesByFieldname[file.fieldname].push(file);
        });

        // Get model images
        const modelImages = filesByFieldname['images'] || [];
        if (modelImages.length === 0) {
            return res.status(400).json({ message: "At least one model image is required" });
        }
        const imageUrls = modelImages.map(file => file.path);

        // Create description object from individual fields
        const description = {
            mainHeading: req.body['description.mainHeading'] || '',
            subHeading: req.body['description.subHeading'] || '',
            mainContent: req.body['description.mainContent'] || '',
            highlightBox: {
                title: req.body['description.highlightBox.title'] || '',
                content: req.body['description.highlightBox.content'] || ''
            }
        };

        // Parse features and specifications if they exist
        let featuresData = {
            heading: req.body['features.heading'] || '',
            subHeading: req.body['features.subHeading'] || '',
            mainContent: req.body['features.mainContent'] || '',
            items: []
        };

        let specificationsData = {
            heading: req.body['specifications.heading'] || '',
            introText: req.body['specifications.introText'] || '',
            specs: []
        };

        // Process feature icons - FIXED: properly handle multiple indices
        const featureIcons = filesByFieldname['featureIcons'] || [];
        let featureIconIndices = [];

        // Convert indices to array properly whether it's a single value or multiple values
        if (req.body.featureIconIndices) {
            featureIconIndices = Array.isArray(req.body.featureIconIndices)
                ? req.body.featureIconIndices.map(idx => parseInt(idx, 10))
                : [parseInt(req.body.featureIconIndices, 10)];
        }

        // Create a map of indices to file paths
        const featureIconsMap = {};
        featureIcons.forEach((icon, i) => {
            if (i < featureIconIndices.length) {
                const index = featureIconIndices[i];
                if (!isNaN(index)) {
                    featureIconsMap[index] = icon.path;
                }
            }
        });

        // Process specification icons - FIXED: properly handle multiple indices
        const specIcons = filesByFieldname['specificationIcons'] || [];
        let specIconIndices = [];

        // Convert indices to array properly whether it's a single value or multiple values
        if (req.body.specificationIconIndices) {
            specIconIndices = Array.isArray(req.body.specificationIconIndices)
                ? req.body.specificationIconIndices.map(idx => parseInt(idx, 10))
                : [parseInt(req.body.specificationIconIndices, 10)];
        }

        // Create a map of indices to file paths
        const specIconsMap = {};
        specIcons.forEach((icon, i) => {
            if (i < specIconIndices.length) {
                const index = specIconIndices[i];
                if (!isNaN(index)) {
                    specIconsMap[index] = icon.path;
                }
            }
        });

        // Parse features JSON and assign icons
        if (req.body.features) {
            try {
                const parsedFeatures = JSON.parse(req.body.features);
                featuresData.items = parsedFeatures.map((feature) => {
                    // FIXED: properly check for icons and handle them
                    return {
                        title: feature.title || '',
                        description: feature.description || '',
                        icon: feature.iconIndex >= 0 && featureIconsMap[feature.iconIndex]
                            ? featureIconsMap[feature.iconIndex]
                            : ''
                    };
                });
            } catch (err) {
                console.error("Error parsing features:", err);
                // Continue with empty features if parsing fails
            }
        }

        // Parse specifications JSON and assign icons
        if (req.body.specifications) {
            try {
                const parsedSpecs = JSON.parse(req.body.specifications);
                specificationsData.specs = parsedSpecs.map((spec) => {
                    // FIXED: properly check for icons and handle them
                    return {
                        title: spec.title || '',
                        value: spec.value || '',
                        icon: spec.iconIndex >= 0 && specIconsMap[spec.iconIndex]
                            ? specIconsMap[spec.iconIndex]
                            : ''
                    };
                });
            } catch (err) {
                console.error("Error parsing specifications:", err);
                // Continue with empty specifications if parsing fails
            }
        }

        // Debug logs to verify icon mappings
        console.log("Feature Icons Map:", featureIconsMap);
        console.log("Spec Icons Map:", specIconsMap);
        console.log("Features Data:", featuresData);
        console.log("Specifications Data:", specificationsData);

        // Create a new model
        const newModel = new Model({
            name,
            modelDescription,
            slug: generatedSlug,
            categoryId,
            images: imageUrls,
            description: description,
            features: featuresData,
            specifications: specificationsData,
            isActive: true
        });

        await newModel.save();

        res.status(201).json({ message: "Model created successfully", model: newModel });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Get all models
const getAllModels = async (req, res) => {

    try {
        console.log("Reciveed")
        const {
            category,
            search,
            page = 1,
            limit = 10,
        } = req.query;

        let filter = {};

        if (category) {
            filter.categoryId = category;
        }
        if (search) {
            filter.name = { $regex: new RegExp(search, "i") };
        }
        const skip = (page - 1) * limit;

        const models = await Model.find(filter, {
            attributes: 0,
            moreImageURL: 0,
        })
            .skip(skip)
            .limit(limit)
            .populate("categoryId", { name: 1 });

        const totalAvailableModels = await Model.countDocuments(filter);

        res.status(200).json({ models, totalAvailableModels });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }


};

// Get a single model by ID
const getModelById = async (req, res) => {
    try {

        // Validate ObjectId before querying
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        const model = await Model.findById(req.params.id).populate("categoryId");
        if (!model) return res.status(404).json({ message: "Model not found" });

        res.status(200).json(model);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

// Update a model
const updateModel = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, modelDescription, categoryId, images } = req.body;
        console.log("Recived body :", req.body.images)
        console.log("Recived files :", req.files)


        // Validate ObjectId before querying
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        // Check if model exists
        const model = await Model.findById(id);
        if (!model) {
            return res.status(404).json({ message: "Model not found" });
        }

        // Generate slug if not provided
        const generatedSlug = slug || name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

        if (generatedSlug !== model.slug) {
            const existingModel = await Model.findOne({ slug: generatedSlug });
            if (existingModel) {
                return res.status(400).json({ message: "A model with this name already exists" });
            }
        }

        // // Handle file uploads
        const filesByFieldname = {};
        if (req.files) {
            req.files.forEach(file => {
                if (!filesByFieldname[file.fieldname]) {
                    filesByFieldname[file.fieldname] = [];
                }
                filesByFieldname[file.fieldname].push(file);
            });
        }

        // Handle model images
        const modelImages = filesByFieldname['newImages'] || [];
        let imageUrls = [];
        console.log("Model Images:", modelImages)

        // Parse existing images (if any)
        const parsedExistingImages = images
            ? (typeof images === 'string'
                ? JSON.parse(images)
                : images)
            : [];

        // Image handling logic
        if (modelImages.length > 0) {
            // New images uploaded
            imageUrls = modelImages.map(file => file.path);

            // If there are existing image links, add them to the new images
            if (parsedExistingImages && parsedExistingImages.length > 0) {
                imageUrls = [...imageUrls, ...parsedExistingImages];
            }
        } else if (parsedExistingImages && parsedExistingImages.length > 0) {
            // No new images, but existing images present
            imageUrls = parsedExistingImages;
        }

        // If no images at all, use existing model images
        if (imageUrls.length === 0) {
            imageUrls = model.images;
        }

        // Update description
        const description = {
            mainHeading: req.body['description.mainHeading'] || model.description.mainHeading,
            subHeading: req.body['description.subHeading'] || model.description.subHeading,
            mainContent: req.body['description.mainContent'] || model.description.mainContent,
            highlightBox: {
                title: req.body['description.highlightBox.title'] || model.description.highlightBox.title,
                content: req.body['description.highlightBox.content'] || model.description.highlightBox.content
            }
        };

        // Update features and specifications
        let featuresData = model.features || {};
        let specificationsData = model.specifications || {};

        if (req.body.features) {
            try {
                const parsedFeatures = JSON.parse(req.body.features);
                featuresData = {
                    heading: req.body['features.heading'] || model.features.heading,
                    subHeading: req.body['features.subHeading'] || model.features.subHeading,
                    mainContent: req.body['features.mainContent'] || model.features.mainContent,
                    items: parsedFeatures.map((feature, index) => ({
                        title: feature.title || '',
                        description: feature.description || '',
                    }))
                };
            } catch (err) {
                console.error("Error parsing features:", err);
            }
        }

        if (req.body.specifications) {
            try {
                const parsedSpecs = JSON.parse(req.body.specifications);
                specificationsData = {
                    heading: req.body['specifications.heading'] || model.specifications.heading,
                    introText: req.body['specifications.introText'] || model.specifications.introText,
                    specs: parsedSpecs.map((spec, index) => ({
                        title: spec.title || '',
                        value: spec.value || '',
                    }))
                };
            } catch (err) {
                console.error("Error parsing specifications:", err);
            }
        }

        // Update model data
        model.name = name || model.name;
        model.slug = generatedSlug;
        model.modelDescription = modelDescription || model.modelDescription;
        model.categoryId = categoryId || model.categoryId;
        model.images = imageUrls;
        model.description = description;
        model.features = featuresData;
        model.specifications = specificationsData;

        await model.save();
        res.status(200).json({
            message: "Model updated successfully",
            model,
            imageUrls // Return the final image URLs for frontend confirmation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Delete a model
const deleteModel = async (req, res) => {
    try {
        const model = await Model.findByIdAndDelete(req.params.id);
        if (!model) return res.status(404).json({ message: "Model not found" });

        res.status(200).json({ message: "Model deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createModel,
    getAllModels,
    getModelById,
    updateModel,
    deleteModel
};
