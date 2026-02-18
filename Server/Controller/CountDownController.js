const Countdown = require("../Model/CountDownModel");

const createCountdown = async (req, res) => {
    try {
        const { title, endTime, isActive, subCategoryId } = req.body;
        console.log("REQ BODY =>", req.body);

        /* ================= VALIDATION ================= */

        if (!subCategoryId) {
            return res.status(400).json({ success: false, message: "Subcategory is required", });
        }
        if (!endTime) {
            return res.status(400).json({ success: false, message: "End time is required", });
        }

        /* ================= DUPLICATE CHECK ================= */
        const existingRecord = await Countdown.findOne({ subCategoryId });
        if (existingRecord) {
            return res.status(400).json({ success: false, message: "Countdown already exists for this subcategory", });
        }

        /* ================= CREATE ================= */
        const record = await Countdown.create({ title: title?.trim() || "", endTime, isActive: Boolean(isActive), subCategoryId, });
        return res.status(201).json({ success: true, message: "Countdown created successfully", data: record, });
    } catch (err) {
        console.error("Create countdown error:", err);
        return res.status(500).json({ success: false, message: "Internal server error", });
    }
};

const getCountdown = async (req, res) => {
    try {
        const data = await Countdown.find().sort({ createdAt: -1 })
            .populate("subCategoryId")
            .lean();

        return res.status(200).json({ success: true, count: data.length, data, });
    } catch (err) {
        console.error("Get countdown error:", err);
        return res.status(500).json({ success: false, message: "Internal server error", });
    }
};


const updateCountdown = async (req, res) => {
    try {
        const { title, endTime, isActive, subCategoryId } = req.body;
        console.log("req.params.id==>", req.body);
        let record = await Countdown.findOne({ _id: req.params.id });
        if (!record) {
            return res.status(404).json({ success: false });
        }

        record.title = title;
        record.endTime = endTime;
        record.isActive = isActive;
        record.subCategoryId = subCategoryId;
        await record.save();

        res.json({ success: true, data: record });
    } catch (err) {
        res.status(500).json({ success: false });
    }
};

const getSingleCountdown = async (req, res) => {
    try {
        const record = await Countdown.findOne({ _id: req.params.id });
        console.log("req.params.id==>", record);
        if (!record) {
            return res.status(404).json({ success: false });
        }
        res.json({ success: true, data: record });
    } catch (err) {
        res.status(500).json({ success: false });
    }
};

const deleteCountdown = async (req, res) => {
    try {
        const { id } = req.params;

        const record = await Countdown.findByIdAndDelete(id);

        if (!record) {
            return res.status(404).json({ success: false, message: "Countdown not found", });
        }

        return res.status(200).json({ success: true, message: "Countdown deleted successfully", data: record, });

    } catch (err) {
        console.error("Delete countdown error:", err);

        return res.status(500).json({ success: false, message: "Internal server error", });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { isActive } = req.body;

        const record = await Countdown.findOne({ _id: req.params.id });
        if (!record) {
            return res.status(404).json({ success: false });
        }
        record.isActive = isActive;
        await record.save();
        res.json({ success: true, data: record });
    } catch (err) {
        res.status(500).json({ success: false });
    }
}

const getCountdownByCategory = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("ExistRecord==>", id);
        const data = await Countdown.findOne({ subCategoryId: id })
        return res.status(200).json({ success: true, data, });
    } catch (err) {
        console.error("Get countdown error:", err);
        return res.status(500).json({ success: false, message: "Internal server error", });
    }
}
module.exports = { getCountdown, getCountdownByCategory, updateStatus, updateCountdown, createCountdown, getSingleCountdown, deleteCountdown };
