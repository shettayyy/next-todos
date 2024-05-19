import { Schema, model } from 'mongoose';
import { User } from '../types.generated';
import passportLocalMongoose from 'passport-local-mongoose';

export const UserCollection = 'user';

export const UserSchema = new Schema<User>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePictureURL: { type: String },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('validate', function (next) {
  if (!this.firstName || !this.lastName || !this.email) {
    next(new Error('All fields are required'));
  }

  if (this.firstName.length < 2) {
    next(new Error('First Name should be at least 2 characters long'));
  }

  if (this.lastName.length < 2) {
    next(new Error('Last Name should be at least 2 characters long'));
  }

  if (this.firstName.length > 30) {
    next(new Error('First Name should be at most 30 characters long'));
  }

  if (this.lastName.length > 30) {
    next(new Error('Last Name should be at most 30 characters long'));
  }

  if (!/^[A-Za-z]+$/.test(this.firstName)) {
    next(new Error('First Name should contain only alphabets'));
  }

  if (!/^[A-Za-z]+$/.test(this.lastName)) {
    next(new Error('Last Name should contain only alphabets'));
  }

  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.email)) {
    next(new Error('Invalid email address'));
  }

  next();
});

UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  errorMessages: {
    UserExistsError: 'A user with the given email is already registered',
  },
});

export const UserModel = model<User>(UserCollection, UserSchema);
