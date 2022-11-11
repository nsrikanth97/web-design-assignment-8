
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const  userSchema =new Schema({
    name:
        {
           type:{
                first: {
                    type : String,
                    required: true,
                    validate: {
                        validator: v => {
                            const regex = /^[A-Za-z]{1,}$/;
                            return v.match(regex)
                        },
                        message : props => `${props.value} is not a valid value for the firstname`
                    }
                    
                },
                last : {
                    type : String,
                    required: true,
                    validate: {
                        validator: v => {
                            const regex = /^[A-Za-z]{1,}$/;
                            return v.match(regex)
                        },
                        message : props => `${props.value} is not a valid value for the lastname`
                    }
                }
            },
            _id :false
        },
    email : {
        type : String,
        required: true,
        minLength : 8, 
        immutable: true,
        lowercase:true,
        unique: true,
        validate: {
            validator: v => {
                const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                return v.match(regex)
            },
            message : props => `${props.value} is not a valid email address`
        }
    },
    password: {
        type: String,
        required :true,
        minLength: 8,
        maxLength: 16,
        validate: {
            validator : v => {
                const re =  /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
                return v.match(re);
            },
            message: props => `Password is not valid, your password must have a number, special character and upper case alphabet`
        }
    }
  },{
    virtuals: {
        fullName : {
            get() {
                return this.name.first + ' ' + this.name.last;
            },
            set(v){
                this.name.first = v.substr(0, v.indexOf(' '));
                this.name.last = v.substr(v.indexOf(' ') + 1);
            }
        }
    }
});

userSchema.pre('save', async function(next){
    try{
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(this.password,salt);
        this.password = hashPass;
        next();
    }catch(err){
        next(err);
    }
});

const  User = mongoose.model('User', userSchema);    

module.exports = User;