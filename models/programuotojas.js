import mongoose from "mongoose"

const Schema = mongoose.Schema
const DevSchema = new Schema({
    vardas: {
        type: String,
        required: [true, 'Prašome įrašyti savo vardą']
    },
    tech: {
        type: [String],
        required: [true, 'Prašome pasirinkti technologijas']
    },
    laisvas: {
        type: Boolean,
        default: false
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
})
DevSchema.index({location: '2dsphere'})
const Dev = mongoose.model('Dev', DevSchema)
export default Dev