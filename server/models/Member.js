import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    membershipType: {
        type: String,
        enum: ['core', 'alumni'],
        default: 'core'
    },
    // Current active position
    currentPosition: {
        title: {
            type: String,
            // Remove default, title should be derived from role
        },
        role: {
            type: String,
            enum: ['secretary', 'joint-secretary', 'core-member'],
            default: 'core-member'
        },
        department: {
            type: String,
            enum: ['leadership', 'general'],
            default: 'general'
        },
        responsibilities: [{
            type: String
        }],
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: {
            type: Date,
            default: null
        },
        period: {
            type: String,
            default: function() {
                // Calculate academic year based on start date
                const startDate = this.startDate || new Date();
                const startYear = startDate.getFullYear();
                const startMonth = startDate.getMonth();
                
                // Academic year typically runs July to June
                // If joining between July-December, academic year is current-next
                // If joining between January-June, academic year is previous-current
                let academicStartYear, academicEndYear;
                
                if (startMonth >= 6) { // July onwards (month 6 = July)
                    academicStartYear = startYear;
                    academicEndYear = startYear + 1;
                } else { // January to June
                    academicStartYear = startYear - 1;
                    academicEndYear = startYear;
                }
                
                return `${academicStartYear}-${academicEndYear}`;
            }
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    dept: {
        type: String,
        default:'not-available'
    },
    // Position history for tracking previous roles
    positionHistory: [{
        title: String,
        role: {
            type: String,
            enum: ['secretary', 'joint-secretary', 'core-member']
        },
        department: String,
        responsibilities: [String],
        startDate: Date,
        endDate: Date,
        period: String, // e.g., "2023-2024", "Jan 2023 - Dec 2023"
        achievements: [String]
    }],
    // Simplified profile with only essential fields
    profile: {
        bio: {
            type: String,
            maxlength: 1000
        },
        mobile: {
            type: String
        },
        profileImage: {
            type: String, // URL to profile image
            default: null
        },
        skills: [{
            type: String
        }]
    },
    visibility: {
        profileVisible: {
            type: Boolean,
            default: true
        },
        showInDirectory: {
            type: Boolean,
            default: true
        },
        contactAllowed: {
            type: Boolean,
            default: true
        }
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'graduated', 'alumni'],
        default: 'active'
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Static method to calculate academic year period
memberSchema.statics.calculateAcademicPeriod = function(date = new Date()) {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Academic year: July to June
    if (month >= 6) { // July onwards
        return `${year}-${year + 1}`;
    } else { // January to June
        return `${year - 1}-${year}`;
    }
};

// Instance method to get current tenure information
memberSchema.methods.getTenureInfo = function() {
    const currentRole = this.currentPosition.role;
    const isLeadershipRole = ['secretary', 'joint-secretary'].includes(currentRole);
    
    return {
        currentRole: this.currentPosition.role,
        currentTitle: this.currentPosition.title,
        department: this.currentPosition.department,
        period: this.currentPosition.period,
        startDate: this.currentPosition.startDate,
        endDate: this.currentPosition.endDate,
        isActive: this.currentPosition.isActive,
        isLeadershipRole,
        responsibilities: this.currentPosition.responsibilities,
        totalPositionsHeld: this.positionHistory.length + 1, // +1 for current position
        positionHistory: this.positionHistory
    };
};

// Instance method to get proper title from role
memberSchema.methods.getRoleTitle = function(role = null) {
    const targetRole = role || this.currentPosition.role;
    const roleTitleMap = {
        'secretary': 'Secretary',
        'joint-secretary': 'Joint Secretary',
        'core-member': 'Core Team Member'
    };
    return roleTitleMap[targetRole] || targetRole.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Pre-save middleware to set title from role
memberSchema.pre('save', function(next) {
    // Set title for current position based on role
    if (this.currentPosition && this.currentPosition.role) {
        this.currentPosition.title = this.getRoleTitle(this.currentPosition.role);
    }
    
    // Set title for all position history items based on role
    if (this.positionHistory && this.positionHistory.length > 0) {
        this.positionHistory.forEach(position => {
            if (position.role) {
                position.title = this.getRoleTitle(position.role);
            }
        });
    }
    
    next();
});

// Index for better query performance
memberSchema.index({ membershipType: 1 });
memberSchema.index({ 'currentPosition.role': 1 });

export default mongoose.model('Member', memberSchema);
