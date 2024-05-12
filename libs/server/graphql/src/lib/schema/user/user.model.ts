import { Schema, model } from 'mongoose';
import { User } from '../types.generated';
import passportLocalMongoose from 'passport-local-mongoose';

export const UserSchema = new Schema<User>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  errorMessages: {
    UserExistsError: 'A user with the given email is already registered',
  },
});

export const UserModel = model<User>('User', UserSchema);
