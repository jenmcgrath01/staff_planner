"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStaffForDate = exports.addStaffMember = exports.saveStaffMember = exports.getStaffMember = exports.getAllStaff = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// In-memory storage for development
let staffMembers = [];
// Route handlers
router.get('/', async (req, res) => {
    const date = req.query.date;
    const staff = await (0, exports.getStaffForDate)(date);
    res.json(staff);
});
router.get('/:id', async (req, res) => {
    const staff = await (0, exports.getStaffMember)(req.params.id);
    res.json(staff);
});
// Export functions for use in other files
const getAllStaff = async () => {
    return staffMembers;
};
exports.getAllStaff = getAllStaff;
const getStaffMember = async (id) => {
    return staffMembers.find(s => s.id === id);
};
exports.getStaffMember = getStaffMember;
const saveStaffMember = async (staff) => {
    const index = staffMembers.findIndex(s => s.id === staff.id);
    if (index >= 0) {
        staffMembers[index] = staff;
    }
    else {
        staffMembers.push(staff);
    }
    return staff;
};
exports.saveStaffMember = saveStaffMember;
// When adding a new staff member, verify ID uniqueness
const addStaffMember = async (staffData) => {
    const existingStaff = await (0, exports.getStaffMember)(staffData.id);
    // If staff exists with this ID but different name, generate new ID
    if (existingStaff && existingStaff.name !== staffData.name) {
        // Find highest existing ID and increment
        const allStaff = await (0, exports.getAllStaff)();
        const maxId = Math.max(...allStaff.map(s => parseInt(s.id)));
        staffData.id = (maxId + 1).toString();
    }
    // Now add the staff member
    return (0, exports.saveStaffMember)(staffData);
};
exports.addStaffMember = addStaffMember;
// When getting staff for a date, ensure no duplicates
const getStaffForDate = async (date) => {
    const staff = await (0, exports.getAllStaff)();
    // Create a Map to ensure unique staff by ID
    const staffMap = new Map();
    staff.forEach(member => {
        var _a;
        if (((_a = member.shift) === null || _a === void 0 ? void 0 : _a.date) === date) {
            const existingMember = staffMap.get(member.id);
            // Only add if not already present or if this is a more recent record
            if (!existingMember ||
                (member.updatedAt && existingMember.updatedAt &&
                    member.updatedAt > existingMember.updatedAt)) {
                staffMap.set(member.id, member);
            }
        }
    });
    return Array.from(staffMap.values());
};
exports.getStaffForDate = getStaffForDate;
exports.default = router;
