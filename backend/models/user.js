const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    birthday_day :{
        type:  Date,
        required: true,
    },
    number: {
        type: String,
        required: true,
        unique: true
    },
    weight: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },    
    training_split: {
        type: String,
        enum: ['ABC', 'ABCD', 'ABCDE'],
        default: null,
    },
    training_days: {
        type: [String], 
        default: [],
    },
    trainings_of_week: {
        type: Map,
        of: [
          new mongoose.Schema({
            muscleArea: {
              type: [String],
              enum: [
                'Peito', 'Costas', 'Quadriceps', 'Posterior da Coxa', 'Glúteos', 'Panturrilhas', 'Ombros', 'Bíceps', 'Tríceps', 'Abdômen', 'Trapézio', 'Antebraços'
              ]
            },
            exercise: {
              type: [
                {
                   _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
                  name: { type: String, required: true },
                  series: { type: Number, required: true },
                  equipment: { type: String, required: true }
                }
              ],
              validate: {
                validator: function (val) {
                  return val.length >= 1 && val.length <= 5;
                },
                message: 'Cada grupo muscular deve ter entre 2 e 5 exercícios.'
              }
            }
          }, { _id: false }),
        ]
      }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;