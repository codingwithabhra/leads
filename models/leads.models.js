const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        required: true,
        enum: ['website', 'referral', 'cold call', 'advertisement', 'email', 'other'],
    },
    salesAgent: {
        type: String,
        ref: 'SalesAgent',
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['new', 'contacted', 'qualified', 'proposalsent', 'closed'],
        default: 'New',
    },
    tags: {
        type: [String],
    },
    timetoclose: {
        type: Number,
        required: true,
        min: 1,
    },
    priority: {
        type: String,
        required: true,
        enum: ['high', 'medium', 'low'],
        default: 'Medium',
    },
    closedAt: {
        type: Date,
    }
},
    {
        timestamps: true
    },
)

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;