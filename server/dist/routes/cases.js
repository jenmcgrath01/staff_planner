"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// In-memory storage for development
let cases = [
    {
        id: '1',
        procedure: 'Total Knee Replacement',
        room: 'OR1',
        start: '2024-02-20T08:00:00',
        end: '2024-02-20T10:00:00',
        surgeon: {
            id: 's1',
            name: 'Dr. Smith',
            specialty: 'Orthopedics',
            subspecialty: 'Joint'
        },
        assignments: {}
    },
    {
        id: '2',
        procedure: 'Knee Arthroscopy',
        room: 'OR2',
        start: '2024-02-20T09:30:00',
        end: '2024-02-20T11:30:00',
        surgeon: {
            id: 's2',
            name: 'Dr. Jones',
            specialty: 'Orthopedics',
            subspecialty: 'Sports'
        },
        assignments: {}
    }
];
router.get('/', (req, res) => {
    console.log('GET /api/cases', req.query);
    const date = req.query.date;
    const filteredCases = cases.filter(c => c.start.startsWith(date));
    console.log('Returning cases:', filteredCases);
    res.json(filteredCases);
});
router.get('/room/:roomId', (req, res) => {
    const roomCases = cases.filter(c => c.room === req.params.roomId);
    res.json(roomCases);
});
exports.default = router;
