import { describe, it, expect, vi, afterEach } from 'vitest';
import { userAuthService, userService } from './user.service';
import { UserModel } from './user.model';
import { GraphQLError } from 'graphql';
import { getSignedUploadUrl } from '@task-master/server/config';

// Mock dependencies
vi.mock('./user.model');
vi.mock('passport');
// Mock the entire config module
vi.mock('@task-master/server/config', () => ({
  env: {
    NODE_ENV: 'test',
    CORS_ORIGIN: 'http://localhost:3000',
    HOST: 'localhost',
    PORT: '4000',
    MONGODB_URI: 'mongodb://localhost:27017/test',
    PASSPORT_SECRET: 'test-secret',
    AWS_ACCESS_KEY_ID: 'test-key-id',
    AWS_SECRET_ACCESS_KEY: 'test-secret-key',
    AWS_REGION: 'us-east-1',
    S3_BUCKET_NAME: 'test-bucket',
  },
  getSignedUploadUrl: vi.fn(),
}));

describe('userAuthService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const mockUser = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };
      const mockPassword = 'password123';
      const mockResult = { id: '123', ...mockUser };

      vi.mocked(UserModel.register).mockResolvedValue(mockResult as any);

      const result = await userAuthService.createUser(mockUser, mockPassword);

      expect(result).toEqual(mockResult);
    });

    it('should throw an error if user creation fails', async () => {
      const mockUser = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };
      const mockPassword = 'password123';

      vi.mocked(UserModel.register).mockRejectedValue(
        new Error('Registration failed')
      );

      await expect(
        userAuthService.createUser(mockUser, mockPassword)
      ).rejects.toThrow(GraphQLError);
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const mockId = '123';
      const mockUpdateData = { firstName: 'Jane' };
      const mockExistingUser = {
        _id: mockId,
        firstName: 'John',
        lastName: 'Doe',
      };
      const mockUpdatedUser = { ...mockExistingUser, ...mockUpdateData };

      vi.mocked(UserModel.findOne).mockResolvedValue(mockExistingUser as any);
      vi.mocked(UserModel.findOneAndUpdate).mockResolvedValue(
        mockUpdatedUser as any
      );

      const result = await userAuthService.updateUser(mockId, mockUpdateData);

      expect(UserModel.findOne).toHaveBeenCalledWith({ _id: mockId });
      expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockId },
        { $set: mockUpdateData },
        { new: true }
      );
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should throw an error if user is not found', async () => {
      const mockId = '123';
      const mockUpdateData = { firstName: 'Jane' };

      vi.mocked(UserModel.findOne).mockResolvedValue(null);

      await expect(
        userAuthService.updateUser(mockId, mockUpdateData)
      ).rejects.toThrow(GraphQLError);
    });
  });

  // Add more tests for loginUser and logoutUser...
});

describe('userService', () => {
  describe('getUser', () => {
    it('should return a user by id', async () => {
      const mockId = '123';
      const mockUser = { id: mockId, firstName: 'John', lastName: 'Doe' };

      vi.mocked(UserModel.findById).mockResolvedValue(mockUser as any);

      const result = await userService.getUser(mockId);

      expect(UserModel.findById).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user is not found', async () => {
      const mockId = '123';

      vi.mocked(UserModel.findById).mockResolvedValue(null);

      await expect(userService.getUser(mockId)).rejects.toThrow(GraphQLError);
    });
  });

  describe('generateUserProfileURL', () => {
    it('should generate a signed URL for valid file', async () => {
      const mockFilename = 'profile.jpg';
      const mockUserId = '123';
      const mockSignedUrl = 'https://example.com/signed-url';

      vi.mocked(getSignedUploadUrl).mockResolvedValue(mockSignedUrl);

      const result = await userService.generateUserProfileURL(
        mockFilename,
        mockUserId
      );

      expect(getSignedUploadUrl).toHaveBeenCalledWith(
        `user-profiles/${mockUserId}/${mockFilename}`
      );
      expect(result).toBe(mockSignedUrl);
    });

    it('should throw an error for invalid file extension', async () => {
      const mockFilename = 'profile.gif';
      const mockUserId = '123';

      await expect(
        userService.generateUserProfileURL(mockFilename, mockUserId)
      ).rejects.toThrow(GraphQLError);
    });
  });
});
