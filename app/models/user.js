var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var validate = require('mongoose-validator');

var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z\-]+$/i
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 50],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
    }),
    validate({
        validator: 'isAlphanumeric',
        passIfEmpty: true,
        message: 'Name should contain alpha-numeric characters only'
    })
];

var emailValidator = [
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z\-]+$/i
    })
];

var UserSchema = new Schema({
    //name:       {type: String, validate: nameValidator },
    //username:   {type: String,  required: true, unique: true },
    email:      {type: String, required: true, unique: true },
    password:   {type: String },
    active:     {type: Boolean, required: true, default:false },
    tempToken:  {type: String }
});

UserSchema.pre('save', function(next){
    var user = this;
    if(user.password) {
        bcrypt.hash(user.password,  null ,null, function(err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    }
});

UserSchema.methods.comparePassword = function(password) {
    console.log("password: "+ this.password);
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);